import { NextResponse } from 'next/server';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCollection } from '@/app/lib/db';
export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['admin','hr'].includes(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const month = new URL(request.url).searchParams.get('month') || new Date(Date.now() + 19800000).toISOString().slice(0, 7);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return NextResponse.json({ error: 'Choose a valid month.' }, { status: 400 });
  try {
    const [employees, attendance, services, payslips] = await Promise.all(['employees','attendance','hrServiceRequests','payslips'].map(name => getCollection(name)));
    const [employeeCount, locations, punches, workflow, payroll] = await Promise.all([
      employees.countDocuments({}),
      employees.aggregate([{ $group: { _id: { $ifNull: ['$workLocation', 'Unassigned'] }, count: { $sum: 1 } } }, { $sort: { count: -1, _id: 1 } }, { $limit: 100 }]).toArray(),
      attendance.aggregate([{ $match: { date: { $regex: `^${month}-` } } }, { $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]).toArray(),
      services.aggregate([{ $group: { _id: { module: '$module', status: '$status' }, count: { $sum: 1 } } }, { $sort: { '_id.module': 1, '_id.status': 1 } }]).toArray(),
      payslips.aggregate([{ $match: { month } }, { $group: { _id: null, count: { $sum: 1 }, gross: { $sum: '$grossPay' }, deductions: { $sum: '$totalDeduction' }, net: { $sum: '$netPay' } } }]).toArray(),
    ]);
    return NextResponse.json({ success: true, month, employeeCount, locations, attendance: punches, workflows: workflow, payroll: payroll[0] || { count: 0, gross: 0, deductions: 0, net: 0 }, generatedAt: new Date() }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return NextResponse.json({ error: 'Could not load insights. Please retry.' }, { status: 503 }); }
}
