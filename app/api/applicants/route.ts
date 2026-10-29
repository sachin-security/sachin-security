// app/api/applicants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';
import { getSessionUser } from '@/app/lib/apiAuth';
import { validOpsOrigin } from '@/app/lib/guardOperations';
import { randomUUID } from 'node:crypto';


// GET - Fetch applicants (with optional jobId filter)
export async function GET(request: NextRequest) {
  const user=await getSessionUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});if(!['admin','hr'].includes(user.role))return NextResponse.json({error:'Forbidden'},{status:403});
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');  // ✅ This handles ?jobId=JOB001
    const status = searchParams.get('status');
    
    const collection = await getCollection('applicants');
    
    const query: Record<string,unknown> = {};
    if (jobId) {
      query.jobId = jobId;  // ✅ Filters by jobId
    }
    if (status && status !== 'all') {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    const applicants = await collection
      .find(query)
      .sort({ appliedDate: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: applicants,
      count: applicants.length
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to process applicant records' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user=await getSessionUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});if(!['admin','hr'].includes(user.role))return NextResponse.json({error:'Forbidden'},{status:403});if(!validOpsOrigin(request))return NextResponse.json({error:'Invalid origin'},{status:403});
  try {
    const { id, status } = await request.json();
    if (typeof id!=='string'||id.length>100||!['Pending','Shortlisted','Rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    const collection = await getCollection('applicants');
    if(await collection.countDocuments({id})>1)return NextResponse.json({error:'Duplicate legacy applicant ID. Use the recruitment workspace.'},{status:409});
    const existing=await collection.findOne({id});if(!existing)return NextResponse.json({error:'Applicant not found'},{status:404});
    if((existing.recruitment||[]).length>=100)return NextResponse.json({error:'Candidate history limit reached'},{status:409});
    const revision=existing.recruitmentVersion||0,revisionQuery=revision===0?{$or:[{recruitmentVersion:0},{recruitmentVersion:{$exists:false}}]}:{recruitmentVersion:revision};
    const result = await collection.updateOne(
      { _id:existing._id,...revisionQuery },
      { $set: { status,updatedAt:new Date(),recruitment:[...(existing.recruitment||[]),{id:randomUUID(),action:'stage',stage:status,notes:'Status updated from job applicants view.',at:new Date(),author:user.name||'HR',actorId:user.id}] },$inc:{recruitmentVersion:1} }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Applicant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status updated successfully' });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to process applicant records' }, { status: 500 });
  }
}
