import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCollection } from '@/app/lib/db';
import { validOpsOrigin } from '@/app/lib/guardOperations';
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
const staff = (role: string) => ['admin', 'hr'].includes(role);
export async function GET(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  const params = new URL(request.url).searchParams, all = params.get('scope') === 'all';
  if (all && !staff(user.role)) return fail('Forbidden', 403);
  const raw = params.get('page') || '1'; if (!/^\d{1,5}$/.test(raw) || Number(raw) < 1) return fail('Invalid page.', 400);
  const search=(params.get('search')||'').trim(),kind=params.get('kind')||'notice';
  if(search.length>80||!['notice','knowledge'].includes(kind))return fail('Invalid search.',400);
  const escaped=search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const page=Number(raw),query={kind:kind==='knowledge'?'knowledge':{$ne:'knowledge'},...(!all?{active:true,$or:[{expiresAt:null},{expiresAt:{$gt:new Date()}}]}:{}),...(search?{$and:[{$or:[{title:{$regex:escaped,$options:'i'}},{body:{$regex:escaped,$options:'i'}}]}]}:{})};
  try {
    const collection = await getCollection('hrAnnouncements');
    const [rows, total] = await Promise.all([collection.find(query).sort({ createdAt: -1, id: 1 }).skip((page - 1) * 20).limit(20).toArray(), collection.countDocuments(query)]);
    return NextResponse.json({ success: true, data: rows.map(row => ({ id: row.id, title: row.title, body: row.body, active: row.active, expiresAt: row.expiresAt, createdAt: row.createdAt, author: row.author, revision: row.revision, acknowledged: (row.acknowledgedBy || []).includes(user.id), ...(all ? { acknowledgementCount: (row.acknowledgedBy || []).length } : {}) })), page, pages: Math.max(1, Math.ceil(total / 20)), total }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return fail('Could not load announcements.', 503); }
}
export async function POST(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!staff(user.role)) return fail('Forbidden', 403);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  if (Number(request.headers.get('content-length')) > 12000) return fail('Notice is too large.', 413);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 120 || typeof body.body !== 'string' || !body.body.trim() || body.body.length > 4000 || typeof body.requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.requestId)) return fail('Add a title (120 characters maximum) and notice (4000 characters maximum).', 400);
  if(body.kind!==undefined&&!['notice','knowledge'].includes(body.kind))return fail('Invalid content type.',400);
  const expiresAt = body.expiry ? new Date(`${body.expiry}T23:59:59+05:30`) : null;
  if (body.expiry && (typeof body.expiry !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.expiry) || !expiresAt || Number.isNaN(expiresAt.getTime()) || expiresAt < new Date() || new Date(expiresAt.getTime() + 19800000).toISOString().slice(0, 10) !== body.expiry)) return fail('Choose a valid future expiry date.', 400);
  try {
    const collection = await getCollection('hrAnnouncements'); await collection.createIndex({ createdBy: 1, requestId: 1 }, { unique: true });
    const existing = await collection.findOne({ createdBy: user.id, requestId: body.requestId }); if (existing) return NextResponse.json({ success: true });
    await collection.insertOne({ id: randomUUID(), title: body.title.trim(), body: body.body.trim(), kind:body.kind||'notice', active: true, createdAt: new Date(), author: user.name || 'HR', createdBy: user.id, requestId: body.requestId, expiresAt, acknowledgedBy: [], revision: 0 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch { return fail('Could not publish announcement. Please refresh and retry.', 503); }
}
export async function PATCH(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.id) || !Number.isInteger(body.revision) || !['acknowledge','archive','restore'].includes(body.action)) return fail('Invalid action.', 400);
  if (body.action !== 'acknowledge' && !staff(user.role)) return fail('Forbidden', 403);
  try {
    const collection = await getCollection('hrAnnouncements'), record = await collection.findOne({ id: body.id });
    if (!record) return fail('Announcement not found.', 404);
    if (body.action === 'acknowledge' && (!record.active || record.expiresAt && new Date(record.expiresAt) <= new Date())) return fail('Announcement is no longer active.', 409);
    if (body.action === 'acknowledge' && (record.acknowledgedBy || []).includes(user.id)) return NextResponse.json({ success: true });
    const change = body.action === 'acknowledge' ? { acknowledgedBy: [...(record.acknowledgedBy || []), user.id] } : { active: body.action === 'restore', updatedBy: user.id, updatedAt: new Date() };
    const result = await collection.updateOne({ id: body.id, revision: body.revision }, { $set: change, $inc: { revision: 1 } });
    return result.matchedCount ? NextResponse.json({ success: true }) : fail('Announcement changed. Refresh and try again.', 409);
  } catch { return fail('Could not update announcement.', 503); }
}
