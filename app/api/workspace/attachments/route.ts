import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCollection } from '@/app/lib/db';
import { putR2Object,getR2Object,deleteR2Object } from '@/app/lib/r2';
import { validOpsOrigin } from '@/app/lib/guardOperations';
const fail=(error:string,status:number)=>NextResponse.json({error},{status});
const staff=(role:string)=>['admin','hr'].includes(role);
export const runtime='nodejs';
export async function GET(request:Request){
  const user=await getSessionUser();if(!user)return fail('Unauthorized',401);
  const params=new URL(request.url).searchParams,id=params.get('record'),fileId=params.get('file');
  if(!id||!fileId||!/^[a-f0-9-]{36}$/i.test(id)||!/^[a-f0-9-]{36}$/i.test(fileId))return fail('Invalid file reference.',400);
  try{const record=await(await getCollection('hrServiceRequests')).findOne({id,...(!staff(user.role)?{employeeId:user.employeeId||'__unlinked__'}:{})});const file=record?.attachments?.find((item:{id:string})=>item.id===fileId);if(!file||typeof file.key!=='string'||!file.key.startsWith(`hr-services/${id}/`))return fail('File not found.',404);const object=await getR2Object(file.key);return new Response(Buffer.from(object.bytes),{headers:{'Content-Type':file.type,'Content-Disposition':`attachment; filename="${file.name.replace(/[^a-zA-Z0-9._ -]/g,'_')}"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}catch{return fail('Could not download file.',503);}
}
export async function POST(request:Request){
  const user=await getSessionUser();if(!user)return fail('Unauthorized',401);if(!validOpsOrigin(request))return fail('Invalid origin.',403);
  if(Number(request.headers.get('content-length'))>6*1024*1024)return fail('File must be 5 MB or less.',413);
  let key='';
  try{
    const form=await request.formData(),id=form.get('record'),file=form.get('file');if(typeof id!=='string'||!/^[a-f0-9-]{36}$/i.test(id)||!(file instanceof File)||!file.size||file.size>5*1024*1024||!['application/pdf','image/jpeg','image/png'].includes(file.type))return fail('Choose one PDF, JPG or PNG, up to 5 MB.',400);
    const collection=await getCollection('hrServiceRequests'),record=await collection.findOne({id,...(!staff(user.role)?{employeeId:user.employeeId||'__unlinked__'}:{})});if(!record)return fail('Record not found.',404);if(['Approved','Rejected','Cancelled','Resolved'].includes(record.status))return fail('This record is closed.',409);if((record.attachments||[]).length>=5)return fail('Maximum five attachments per record.',409);if((record.events||[]).length>=100)return fail('Record history limit reached. Contact HR.',409);
    let bytes: Buffer=Buffer.from(await file.arrayBuffer()),type=file.type,extension='pdf';
    if(file.type==='application/pdf'){if(bytes.subarray(0,5).toString()!=='%PDF-')return fail('This is not a valid PDF file.',400);}else{try{const image=sharp(bytes,{limitInputPixels:25000000,animated:false}),meta=await image.metadata();if(!['jpeg','png'].includes(meta.format||'')||(meta.pages||1)>1)throw Error('Invalid image');bytes=await image.rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).jpeg({quality:90}).toBuffer();type='image/jpeg';extension='jpg';}catch{return fail('The image could not be read. Choose a valid JPG or PNG.',400);}}
    const fileId=randomUUID();key=`hr-services/${id}/${fileId}.${extension}`;await putR2Object(key,bytes,type);const name=(file.name.replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9._ -]/g,'_').slice(0,100)||'document')+'.'+extension,now=new Date();
    const result=await collection.updateOne({id,revision:record.revision,status:record.status},{$set:{attachments:[...(record.attachments||[]),{id:fileId,key,name,type,size:bytes.length,uploadedAt:now,uploadedBy:user.id}],events:[...(record.events||[]),{at:now,actorId:user.id,author:user.name||user.employeeId||'HR',type:'attachment',text:`Attached ${name}`}],updatedAt:now},$inc:{revision:1}});
    if(!result.matchedCount){await deleteR2Object(key).catch(()=>{});return fail('Record changed. Refresh before attaching.',409);}return NextResponse.json({success:true},{status:201});
  }catch{if(key)await deleteR2Object(key).catch(()=>{});return fail('Could not attach file. Please retry.',503);}
}
