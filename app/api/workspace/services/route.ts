import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCollection } from '@/app/lib/db';
import { getServiceModule, SERVICE_STATUSES, validateServiceInput } from '@/app/lib/serviceModules';
import { validOpsOrigin } from '@/app/lib/guardOperations';
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
const isStaff = (role: string) => ['admin', 'hr'].includes(role);
const closed = ['Approved', 'Rejected', 'Cancelled', 'Resolved'];

export async function GET(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  const params = new URL(request.url).searchParams, all = params.get('scope') === 'all';
  if (all && !isStaff(user.role)) return fail('Forbidden', 403);
  if (!all && !user.employeeId) return fail('No employee profile linked.', 400);
  const definition = getServiceModule(params.get('module')); if (!definition) return fail('Choose a valid definition.', 400);
  const status = params.get('status') || 'all', pageText = params.get('page') || '1';
  if ((status !== 'all' && ![...SERVICE_STATUSES, 'Resolved'].includes(status as typeof SERVICE_STATUSES[number])) || !/^\d{1,5}$/.test(pageText) || Number(pageText) < 1) return fail('Invalid filter.', 400);
  const page = Number(pageText), base = { module: definition.key, ...(!all ? { employeeId: user.employeeId } : {}) }, query = { ...base, ...(status === 'all' ? {} : { status }) };
  try {
    const collection = await getCollection('hrServiceRequests');
    const [data, total, pending] = await Promise.all([collection.find(query, { projection: { _id: 0, submittedBy: 0, requestId: 0 } }).sort({ updatedAt: -1, id: 1 }).skip((page - 1) * 20).limit(20).toArray(), collection.countDocuments(query), collection.countDocuments({ ...base, status: { $in: ['Pending', 'In review'] } })]);
    return NextResponse.json({ success: true, data, total, pending, page, pages: Math.max(1, Math.ceil(total / 20)) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return fail('Could not load records. Please retry.', 503); }
}

export async function POST(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  if (Number(request.headers.get('content-length')) > 16000) return fail('Request is too large.', 413);
  const body = await request.json().catch(() => null); if (!body) return fail('Invalid request.', 400);
  const definition = getServiceModule(body.module); if (!definition) return fail('Choose a valid definition.', 400);
  if (definition.staffCreates && !isStaff(user.role)) return fail('Only HR/admin can assign these tasks.', 403);
  const employeeId = definition.staffCreates ? body.employeeId : user.employeeId;
  if (typeof employeeId !== 'string' || !employeeId.trim() || employeeId.length > 100) return fail('Provide a linked employee ID.', 400);
  if (typeof body.requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.requestId)) return fail('Refresh and retry.', 400);
  let values;
  try { values = validateServiceInput(definition, body.values); } catch (error) { return fail((error as Error).message, 400); }
  try {
    const collection = await getCollection('hrServiceRequests');
    await collection.createIndex({ submittedBy: 1, requestId: 1 }, { unique: true });
    await collection.createIndex({ module: 1, employeeId: 1, updatedAt: -1 });
    const existing = await collection.findOne({ submittedBy: user.id, requestId: body.requestId });
    if (existing) return NextResponse.json({ success: true, id: existing.id });
    const employee = await (await getCollection('employees')).findOne({ employeeId: employeeId.trim() }, { projection: { fullName: 1, workLocation: 1 } });
    if (!employee) return fail('Employee profile not found.', 404);
    if (await collection.countDocuments({ submittedBy: user.id, createdAt: { $gte: new Date(Date.now() - 86400000) } }) >= (isStaff(user.role) ? 200 : 20)) return fail('Daily request limit reached. Contact HR.', 429);
    const now = new Date(), id = randomUUID();
    await collection.insertOne({ id, module: definition.key, employeeId: employeeId.trim(), fullName: employee.fullName, workLocation: employee.workLocation || '', values, submittedBy: user.id, requestId: body.requestId, status: 'Pending', revision: 0, createdAt: now, updatedAt: now, events: [{ at: now, actorId: user.id, author: user.name || user.employeeId || 'HR', type: 'created', text: definition.staffCreates ? 'Task assigned' : 'Request submitted' }] });
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) { const existing = await (await getCollection('hrServiceRequests')).findOne({ submittedBy: user.id, requestId: body.requestId }); if (existing) return NextResponse.json({ success: true, id: existing.id }); }
    return fail('Could not save record. Please retry.', 503);
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  if (Number(request.headers.get('content-length')) > 8000) return fail('Message is too large.', 413);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.id) || !Number.isInteger(body.revision) || body.revision < 0 || !['comment', 'review', 'cancel', 'complete'].includes(body.action)) return fail('Invalid action.', 400);
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text || text.length > 2000) return fail('Add a comment or decision reason (up to 2000 characters).', 400);
  try {
    const collection = await getCollection('hrServiceRequests');
    const record = await collection.findOne({ id: body.id, ...(!isStaff(user.role) ? { employeeId: user.employeeId || '__unlinked__' } : {}) });
    if (!record) return fail('Record not found.', 404);
    if (record.revision !== body.revision) return fail('Record changed. Refresh before updating.', 409);
    const definition = getServiceModule(record.module); if (!definition) return fail('Invalid saved definition.', 409);
    if (closed.includes(record.status)) return fail('This record is closed. Create a new request if needed.', 409);
    if ((record.events || []).length >= 100) return fail('Conversation limit reached. Contact HR.', 409);
    let status = record.status;
    if (body.action === 'review') {
      if (!isStaff(user.role)) return fail('Only HR/admin can review.', 403);
      if (record.employeeId === user.employeeId || record.submittedBy === user.id && !definition.staffCreates) return fail('Another HR/admin user must review your own request.', 403);
      const allowed = definition.key === 'helpdesk' ? ['In review', 'Resolved', 'Rejected'] : ['In review', 'Approved', 'Rejected'];
      if (!allowed.includes(body.status)) return fail('Choose a valid review status.', 400);
      status = body.status;
    }
    if (body.action === 'cancel') {
      if (record.status !== 'Pending' || (!isStaff(user.role) && (definition.staffCreates || record.submittedBy !== user.id))) return fail('This request cannot be cancelled by you.', 403);
      status = 'Cancelled';
    }
    if (body.action === 'complete') {
      if (!definition.staffCreates || record.employeeId !== user.employeeId) return fail('Only the assigned employee can submit completion.', 403);
      status = 'In review';
    }
    const now = new Date();
    const result = await collection.updateOne({ id: body.id, revision: body.revision, status: record.status }, { $set: { status, updatedAt: now, events: [...(record.events || []), { at: now, actorId: user.id, author: user.name || user.employeeId || 'HR', type: body.action, text, status }] }, $inc: { revision: 1 } });
    return result.matchedCount ? NextResponse.json({ success: true }) : fail('Record changed. Refresh before updating.', 409);
  } catch { return fail('Could not update record. Please retry.', 503); }
}
