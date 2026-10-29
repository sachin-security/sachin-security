import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'node:crypto';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCollection } from '@/app/lib/db';
import { validOpsOrigin } from '@/app/lib/guardOperations';
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
export async function GET(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!['admin','hr'].includes(user.role)) return fail('Forbidden', 403);
  const params = new URL(request.url).searchParams, search = (params.get('search') || '').trim(), raw = params.get('page') || '1';
  if (search.length > 80 || !/^\d{1,5}$/.test(raw) || Number(raw) < 1) return fail('Invalid filter.', 400);
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const query = search ? { $or: ['fullName','email','id','jobId'].map(field => ({ [field]: { $regex: escaped, $options: 'i' } })) } : {};
  try {
    const collection = await getCollection('applicants'), page = Number(raw);
    const [data,total] = await Promise.all([collection.find(query, { projection: { fullName: 1, id: 1, jobId: 1, email: 1, status: 1, recruitment: 1, recruitmentVersion: 1, appliedDate: 1 } }).sort({ appliedDate: -1, _id: -1 }).skip((page - 1) * 20).limit(20).toArray(), collection.countDocuments(query)]);
    return NextResponse.json({ success: true, data: data.map(row => ({ ...row, _id: String(row._id) })), total, pages: Math.max(1,Math.ceil(total / 20)) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return fail('Could not load candidates.', 503); }
}
export async function POST(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!['admin','hr'].includes(user.role)) return fail('Forbidden', 403);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  if (Number(request.headers.get('content-length')) > 16000) return fail('Record too large.', 413);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !/^[a-f0-9]{24}$/i.test(body.id) || !Number.isInteger(body.version) || body.version < 0 || typeof body.requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.requestId) || !['interview','offer','note','stage'].includes(body.action)) return fail('Invalid candidate action.', 400);
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
  if (!notes || notes.length > 3000) return fail('Add notes or a decision reason (up to 3000 characters).', 400);
  const payload: Record<string,string | number> = {};
  if (body.action === 'interview') {
    if (typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(body.date) || Number.isNaN(Date.parse(body.date + ':00+05:30')) || typeof body.interviewer !== 'string' || !body.interviewer.trim() || body.interviewer.length > 120) return fail('Add a valid IST interview time and interviewer.', 400);
    payload.date = body.date; payload.interviewer = body.interviewer.trim();
    if(new Date(Date.parse(body.date+':00+05:30')+19800000).toISOString().slice(0,16)!==body.date)return fail('Choose a valid interview date and time.',400);
  }
  if (body.action === 'offer') {
    if (typeof body.role !== 'string' || !body.role.trim() || body.role.length > 120 || typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount <= 0 || body.amount > 10000000 || typeof body.joining !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.joining) || Number.isNaN(Date.parse(body.joining+'T00:00:00Z')) || new Date(body.joining+'T00:00:00Z').toISOString().slice(0,10) !== body.joining) return fail('Add role, proposed monthly amount (INR) and a valid joining date.', 400);
    payload.role = body.role.trim(); payload.amount = body.amount; payload.joining = body.joining; payload.state = 'Internal draft only';
  }
  if (body.action === 'stage') {
    if (!['Pending','Shortlisted','Rejected'].includes(body.stage)) return fail('Choose a supported applicant status.', 400);
    payload.stage = body.stage;
  }
  try {
    const collection = await getCollection('applicants'), id = new ObjectId(body.id), record = await collection.findOne({ _id: id });
    if (!record) return fail('Candidate not found.', 404);
    if ((record.recruitment || []).some((event: { requestId: string }) => event.requestId === body.requestId)) return NextResponse.json({ success: true });
    if ((record.recruitmentVersion || 0) !== body.version) return fail('Candidate changed. Refresh before saving.', 409);
    if ((record.recruitment || []).length >= 100) return fail('Candidate history limit reached. Contact HR.', 409);
    const versionQuery = body.version === 0 ? { $or: [{ recruitmentVersion: 0 }, { recruitmentVersion: { $exists: false } }] } : { recruitmentVersion: body.version };
    const event = { id: randomUUID(), requestId: body.requestId, action: body.action, notes, ...payload, at: new Date(), author: user.name || 'HR', actorId: user.id };
    const result = await collection.updateOne({ _id: id, ...versionQuery }, { $set: { recruitment: [...(record.recruitment || []),event], updatedAt: new Date(), ...(body.action === 'stage' ? { status: body.stage } : {}) }, $inc: { recruitmentVersion: 1 } });
    return result.matchedCount ? NextResponse.json({ success: true }) : fail('Candidate changed. Refresh before saving.', 409);
  } catch { return fail('Could not save recruitment record.', 503); }
}
