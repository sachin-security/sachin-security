import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCollection } from '@/app/lib/db';
import { canManageGuardOps, guardText, validIncidentStatus, validOpsOrigin } from '@/app/lib/guardOperations';
const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });
const fields = { _id: 0, id: 1, employeeId: 1, fullName: 1, workLocation: 1, title: 1, details: 1, priority: 1, status: 1, response: 1, createdAt: 1, updatedAt: 1 };
export async function GET(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  const params = new URL(request.url).searchParams;
  const all = params.get('scope') === 'all';
  if (all && !canManageGuardOps(user.role)) return fail('Forbidden', 403);
  if (!all && !user.employeeId) return fail('No employee profile linked.', 400);
  const status = params.get('status'); if (status && !validIncidentStatus(status)) return fail('Invalid status.', 400);
  const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
  const query = { ...(!all ? { employeeId: user.employeeId } : {}), ...(status ? { status } : {}) };
  try {
    const reports = await getCollection('guardIncidents');
    const [data, total] = await Promise.all([reports.find(query, { projection: fields }).sort({ createdAt: -1 }).skip((page - 1) * 25).limit(25).toArray(), reports.countDocuments(query)]);
    return NextResponse.json({ success: true, data, total, page, pages: Math.max(1, Math.ceil(total / 25)) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return fail('Could not load reports. Please retry.', 503); }
}
export async function POST(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!user.employeeId) return fail('No employee profile linked.', 400);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  const body = await request.json().catch(() => null); if (!body) return fail('Invalid report.', 400);
  let input;
  try {
    if (!['Routine', 'Urgent'].includes(body.priority)) throw new Error('Choose a report priority.');
    if (typeof body.requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.requestId)) throw new Error('Refresh the page and retry.');
    input = { title: guardText(body.title, 120, 'title', true), details: guardText(body.details, 3000, 'details', true), priority: body.priority, requestId: body.requestId };
  } catch (e) { return fail((e as Error).message, 400); }
  try {
    const employee = await (await getCollection('employees')).findOne({ employeeId: user.employeeId }, { projection: { fullName: 1, workLocation: 1 } });
    if (!employee) return fail('Employee profile not found.', 404);
    const reports = await getCollection('guardIncidents');
    await reports.createIndex({ employeeId: 1, requestId: 1 }, { unique: true });
    await reports.createIndex({ status: 1, createdAt: -1 });
    const existing = await reports.findOne({ employeeId: user.employeeId, requestId: input.requestId }, { projection: { id: 1 } });
    if (existing) return NextResponse.json({ success: true, id: existing.id });
    if (await reports.countDocuments({ employeeId: user.employeeId, createdAt: { $gte: new Date(Date.now() - 86400000) } }) >= 20) return fail('Report limit reached. Please contact your supervisor.', 429);
    const id = randomUUID();
    await reports.insertOne({ ...input, id, employeeId: user.employeeId, fullName: employee.fullName, workLocation: employee.workLocation || '', status: 'Open', response: '', createdAt: new Date(), createdBy: user.id });
    return NextResponse.json({ success: true, id });
  } catch (e) { if ((e as { code?: number }).code === 11000) return NextResponse.json({ success: true }); return fail('Could not save the report. Please retry.', 503); }
}
export async function PATCH(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!canManageGuardOps(user.role)) return fail('Forbidden', 403);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  const body = await request.json().catch(() => null); if (!body || !validIncidentStatus(body.status)) return fail('Choose a valid report status.', 400);
  let input;
  try { input = { id: guardText(body.id, 100, 'report ID', true), status: body.status, response: guardText(body.response, 2000, 'response') }; } catch (e) { return fail((e as Error).message, 400); }
  try {
    const saved = await (await getCollection('guardIncidents')).updateOne({ id: input.id }, { $set: { status: input.status, response: input.response, updatedAt: new Date(), updatedBy: user.id } });
    return saved.matchedCount ? NextResponse.json({ success: true }) : fail('Report not found.', 404);
  } catch { return fail('Could not update the report. Please retry.', 503); }
}
