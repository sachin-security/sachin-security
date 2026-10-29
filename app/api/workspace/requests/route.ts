import { NextResponse } from 'next/server';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCollection } from '@/app/lib/db';

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const all = params.get('scope') === 'all';
  if (all && !['admin', 'hr'].includes(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!all && !user.employeeId) return NextResponse.json({ error: 'No employee profile linked.' }, { status: 400 });
  const kind = params.get('kind') || 'leave';
  const state = params.get('state') || (all ? 'pending' : 'all');
  const rawPage = params.get('page') || '1';
  if (!['leave', 'photo', 'report', 'service'].includes(kind) || !['pending', 'all'].includes(state) || !/^\d{1,6}$/.test(rawPage) || Number(rawPage) < 1) return NextResponse.json({ error: 'Invalid request filter.' }, { status: 400 });
  const page = Number(rawPage), limit = 25;
  try {
    const collections = await Promise.all(['leaveRequests', 'employees', 'guardIncidents', 'hrServiceRequests'].map(name => getCollection(name)));
    const scope = all ? {} : { employeeId: user.employeeId };
    const bases = [scope, { ...scope, 'photoUpdate.status': { $exists: true } }, scope, scope];
    const pending = [{ ...scope, status: 'Pending' }, { ...scope, 'photoUpdate.status': 'pending' }, { ...scope, status: { $in: ['Open', 'In review'] } }, { ...scope, status: { $in: ['Pending', 'In review'] } }];
    const counts = await Promise.all(collections.map(async (collection, index) => ({ kind: ['leave', 'photo', 'report', 'service'][index], total: await collection.countDocuments(bases[index]), pending: await collection.countDocuments(pending[index]) })));
    const index = ['leave', 'photo', 'report', 'service'].indexOf(kind);
    const query = state === 'pending' ? pending[index] : bases[index];
    const total = state === 'pending' ? counts[index].pending : counts[index].total;
    const projections = [
      { _id: 1, employeeId: 1, employeeName: 1, type: 1, fromDate: 1, toDate: 1, days: 1, status: 1, appliedAt: 1 },
      { _id: 0, employeeId: 1, fullName: 1, 'photoUpdate.id': 1, 'photoUpdate.status': 1, 'photoUpdate.submittedAt': 1 },
      { _id: 0, id: 1, employeeId: 1, fullName: 1, title: 1, priority: 1, status: 1, createdAt: 1 },
      { _id: 0, id: 1, employeeId: 1, fullName: 1, module: 1, 'values.subject': 1, status: 1, createdAt: 1 },
    ];
    const dateField = ['appliedAt', 'photoUpdate.submittedAt', 'createdAt', 'createdAt'][index];
    const documents = await collections[index].find(query, { projection: projections[index] }).sort({ [dateField]: all && state === 'pending' ? 1 : -1, employeeId: 1 }).skip((page - 1) * limit).limit(limit).toArray();
    const data = documents.map(item => ({
      id: String(kind === 'leave' ? item._id : kind === 'photo' ? item.photoUpdate?.id : item.id),
      employeeId: item.employeeId, name: item.employeeName || item.fullName || item.employeeId,
      title: kind === 'leave' ? `${item.type || 'Leave'} request` : kind === 'photo' ? 'Enrollment photo update' : kind === 'service' ? item.values?.subject || `${item.module} request / task` : item.title,
      detail: kind === 'leave' ? `${item.fromDate} to ${item.toDate} · ${item.days} day(s)` : kind === 'photo' ? 'Photo replacement review' : kind === 'service' ? 'HR service request or assigned task' : `${item.priority || 'Routine'} guard report`,
      status: kind === 'photo' ? item.photoUpdate?.status : item.status,
      createdAt: kind === 'leave' ? item.appliedAt : kind === 'photo' ? item.photoUpdate?.submittedAt : item.createdAt,
      href: kind === 'service' ? `${all ? '/admin' : '/portal'}/services/${encodeURIComponent(item.module)}` : all ? kind === 'leave' ? '/admin/leave' : kind === 'photo' ? '/admin/photo-requests' : '/admin/guard-operations' : kind === 'leave' ? '/portal/leave' : kind === 'photo' ? '/portal/profile' : '/portal/duty#reports',
    }));
    return NextResponse.json({ success: true, data, counts, page, pages: Math.max(1, Math.ceil(total / limit)), total }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return NextResponse.json({ error: 'Could not load requests. Please retry.' }, { status: 503 }); }
}
