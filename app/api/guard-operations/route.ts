import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getCollection, getDatabase } from '@/app/lib/db';
import getMongoClient from '@/app/lib/mongodb';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCompanySettings } from '@/app/lib/settingsServer';
import { istDateString } from '@/app/lib/attendance';
import { canManageGuardOps, validDutyDate, dutyTimes, guardText, validOpsOrigin } from '@/app/lib/guardOperations';
const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });
const safeShift = { _id: 0, id: 1, employeeId: 1, fullName: 1, workLocation: 1, date: 1, start: 1, end: 1, startsAt: 1, endsAt: 1, post: 1, instructions: 1, status: 1 };
export async function GET(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  const params = new URL(request.url).searchParams;
  const all = params.get('scope') === 'all';
  if (all && !canManageGuardOps(user.role)) return fail('Only HR and administrators can view all guard operations.', 403);
  const date = params.get('date') || istDateString(); if (!validDutyDate(date)) return fail('Invalid date.', 400);
  try {
    const duties = await getCollection('guardDuties');
    if (!all) {
      if (!user.employeeId) return fail('No employee profile is linked to this account.', 400);
      const employees = await getCollection('employees');
      const employee = await employees.findOne({ employeeId: user.employeeId }, { projection: { _id: 0, employeeId: 1, fullName: 1, designation: 1, workLocation: 1, reportingManager: 1, reportingManagerId: 1 } });
      if (!employee) return fail('Employee profile not found. Contact HR.', 404);
      const [shifts, company, supervisor] = await Promise.all([
        duties.find({ employeeId: user.employeeId, status: 'scheduled', endsAt: { $gt: new Date() } }, { projection: safeShift }).sort({ startsAt: 1 }).limit(14).toArray(),
        getCompanySettings(),
        employee.reportingManagerId ? employees.findOne({ employeeId: employee.reportingManagerId }, { projection: { _id: 0, fullName: 1, mobileNumber: 1 } }) : null,
      ]);
      return NextResponse.json({ success: true, data: { employee, shifts, company: { name: company.companyName, phone: company.phone, email: company.email }, supervisor } }, { headers: { 'Cache-Control': 'no-store' } });
    }
    const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
    const site = params.get('site')?.trim();
    const query = { date, status: 'scheduled', ...(site ? { workLocation: site } : {}) };
    const employees = await getCollection('employees');
    const [rows, count, assigned, sites] = await Promise.all([
      duties.find(query, { projection: safeShift }).sort({ start: 1, fullName: 1 }).skip((page - 1) * 50).limit(50).toArray(),
      duties.countDocuments(query), duties.find(query, { projection: { employeeId: 1, workLocation: 1, _id: 0 } }).toArray(),
      employees.distinct('workLocation'),
    ]);
    const punches = assigned.length ? await (await getCollection('attendance')).find({ employeeId: { $in: assigned.map(s => s.employeeId) }, date }, { projection: { _id: 0, employeeId: 1, 'clockIn.at': 1, 'clockOut.at': 1 } }).toArray() : [];
    const indexed = new Map(punches.map(p => [p.employeeId, p]));
    const openIncidents = await (await getCollection('guardIncidents')).countDocuments({ status: { $ne: 'Resolved' }, ...(site ? { workLocation: site } : {}) });
    return NextResponse.json({ success: true, data: rows.map(row => ({ ...row, punch: indexed.get(row.employeeId) || null })), page, total: count, pages: Math.max(1, Math.ceil(count / 50)), sites: sites.filter((s): s is string => typeof s === 'string' && !!s.trim()).sort(), summary: { assigned: count, clockedIn: punches.filter(p => p.clockIn?.at && !p.clockOut?.at).length, completed: punches.filter(p => p.clockOut?.at).length, withoutPunch: assigned.length - punches.filter(p => p.clockIn?.at).length, openIncidents } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return fail('Could not load duty information. Please retry.', 503); }
}
export async function POST(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!canManageGuardOps(user.role)) return fail('Only HR and administrators can assign duties.', 403);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  const body = await request.json().catch(() => null); if (!body) return fail('Invalid request.', 400);
  let input;
  try { input = { ...dutyTimes(body.date, body.start, body.end), employeeId: guardText(body.employeeId, 100, 'employee', true), post: guardText(body.post, 100, 'post'), instructions: guardText(body.instructions, 2000, 'instructions') }; } catch (e) { return fail((e as Error).message, 400); }
  try {
    const db = await getDatabase(); const duties = db.collection('guardDuties');
    await duties.createIndex({ employeeId: 1, date: 1 }, { unique: true, partialFilterExpression: { status: 'scheduled' } });
    await duties.createIndex({ employeeId: 1, endsAt: 1 });
    const client = await getMongoClient(); const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        // Lock the employee's roster in this transaction, so simultaneous
        // assignments cannot bypass the overnight overlap check.
        const employee = await db.collection('employees').findOneAndUpdate({ employeeId: input.employeeId }, { $inc: { guardRosterVersion: 1 } }, { session, returnDocument: 'after', projection: { fullName: 1, workLocation: 1 } });
        if (!employee) throw new Error('Employee not found.');
        if (!employee.workLocation?.trim()) throw new Error('Set the employee work location in the directory before assigning duty.');
        const overlap = await duties.findOne({ employeeId: input.employeeId, status: 'scheduled', startsAt: { $lt: input.endsAt }, endsAt: { $gt: input.startsAt } }, { session });
        if (overlap) throw new Error('This employee already has an overlapping duty. Cancel or change the other assignment first.');
        await duties.insertOne({ ...input, id: randomUUID(), fullName: employee.fullName, workLocation: employee.workLocation.trim(), status: 'scheduled', createdBy: user.id, createdAt: new Date() }, { session });
      });
    } finally { await session.endSession(); }
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    if (/Employee not found|Set the employee|overlapping duty/.test(message)) return fail(message, 400);
    if ((e as { code?: number }).code === 11000) return fail('This employee already has a duty on this date. Cancel it before assigning a replacement.', 409);
    return fail('Could not save the duty. Please retry.', 503);
  }
}
export async function PATCH(request: Request) {
  const user = await getSessionUser(); if (!user) return fail('Unauthorized', 401);
  if (!canManageGuardOps(user.role)) return fail('Forbidden', 403);
  if (!validOpsOrigin(request)) return fail('Invalid origin.', 403);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || body.id.length > 100 || body.action !== 'cancel') return fail('Invalid cancellation.', 400);
  try {
    const result = await (await getCollection('guardDuties')).updateOne({ id: body.id, status: 'scheduled' }, { $set: { status: 'cancelled', cancelledBy: user.id, cancelledAt: new Date() } });
    return result.matchedCount ? NextResponse.json({ success: true }) : fail('Duty not found or already cancelled.', 404);
  } catch { return fail('Could not cancel the duty. Please retry.', 503); }
}
