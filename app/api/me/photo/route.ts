import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { getSessionUser } from '@/app/lib/apiAuth';
import { getCollection } from '@/app/lib/db';
import { putR2Object, getR2Object, deleteR2Object } from '@/app/lib/r2';
import { validOpsOrigin } from '@/app/lib/guardOperations';

export const runtime = 'nodejs';
const staff = (role: string) => ['admin', 'hr'].includes(role);

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const params = new URL(request.url).searchParams;
  if (params.get('scope') === 'all') {
    if (!staff(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const employees = await getCollection('employees');
    const data = await employees.find({ 'photoUpdate.status': 'pending' }, { projection: { _id: 0, employeeId: 1, fullName: 1, profileUrl: 1, 'photoUpdate.id': 1, 'photoUpdate.submittedAt': 1 } }).sort({ 'photoUpdate.submittedAt': 1 }).limit(100).toArray();
    return NextResponse.json({ success: true, data }, { headers: { 'Cache-Control': 'no-store' } });
  }
  const employeeId = staff(user.role) && params.get('employeeId') ? params.get('employeeId') : user.employeeId;
  if (!employeeId) return NextResponse.json({ error: 'No employee linked' }, { status: 400 });
  const employee = await (await getCollection('employees')).findOne({ employeeId });
  if (!employee) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  if (params.get('view') === 'pending') {
    if (employee.photoUpdate?.status !== 'pending' || !employee.photoUpdate?.key) return NextResponse.json({ error: 'No pending photo' }, { status: 404 });
    const image = await getR2Object(employee.photoUpdate.key);
    return new Response(Buffer.from(image.bytes), { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
  }
  return NextResponse.json({ success: true, data: { profileUrl: employee.profileUrl, status: employee.photoUpdate?.status, requestId: employee.photoUpdate?.id } }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!user.employeeId) return NextResponse.json({ error: 'No employee linked' }, { status: 400 });
  if (!validOpsOrigin(request)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  if (!process.env.R2_PUBLIC_URL) return NextResponse.json({ error: 'Photo storage is unavailable. Contact HR.' }, { status: 503 });
  if (Number(request.headers.get('content-length')) > 6 * 1024 * 1024) return NextResponse.json({ error: 'Choose a JPG or PNG up to 5 MB.' }, { status: 413 });
  const employees = await getCollection('employees');
  const employee = await employees.findOne({ employeeId: user.employeeId });
  if (!employee) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  if (employee.photoUpdate?.status === 'pending') return NextResponse.json({ error: 'Your photo is already waiting for HR approval.' }, { status: 409 });
  let bytes: Buffer;
  try {
    const form = await request.formData();
    const file = form.get('photo');
    if (!(file instanceof File) || !['image/jpeg', 'image/png'].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) throw new Error('Invalid image');
    const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25000000, animated: false });
    const metadata = await image.metadata();
    if (!['jpeg', 'png'].includes(metadata.format || '') || !metadata.width || !metadata.height || metadata.width < 200 || metadata.height < 200 || (metadata.pages || 1) > 1) throw new Error('Invalid image');
    bytes = await image.rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer();
  } catch {
    return NextResponse.json({ error: 'Choose a valid JPG or PNG up to 5 MB, at least 200 × 200 pixels.' }, { status: 400 });
  }
  const id = randomUUID();
  const key = `profiles/${id}.jpg`;
  try {
    await putR2Object(key, bytes, 'image/jpeg');
    const result = await employees.updateOne({ employeeId: user.employeeId, 'photoUpdate.status': { $ne: 'pending' } }, { $set: { photoUpdate: { id, key, status: 'pending', submittedAt: new Date(), submittedBy: user.id }, updatedAt: new Date() } });
    if (!result.matchedCount) { await deleteR2Object(key).catch(() => {}); return NextResponse.json({ error: 'Another request is already pending. Refresh your profile.' }, { status: 409 }); }
    if (employee.photoUpdate?.status === 'rejected' && employee.photoUpdate?.key) await deleteR2Object(employee.photoUpdate.key).catch(() => {});
    return NextResponse.json({ success: true, message: 'Photo submitted. HR approval is required before face punching uses it.' });
  } catch {
    await deleteR2Object(key).catch(() => {});
    return NextResponse.json({ error: 'Could not submit photo. Please try again.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!staff(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!validOpsOrigin(request)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.employeeId !== 'string' || typeof body.requestId !== 'string' || !['approve', 'reject'].includes(body.action)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const employees = await getCollection('employees');
  const employee = await employees.findOne({ employeeId: body.employeeId, 'photoUpdate.id': body.requestId, 'photoUpdate.status': 'pending' });
  if (!employee) return NextResponse.json({ error: 'Request changed. Refresh the list.' }, { status: 409 });
  if (employee.employeeId === user.employeeId || employee.photoUpdate.submittedBy === user.id) return NextResponse.json({ error: 'Ask another HR/admin user to review your own photograph.' }, { status: 403 });
  if (body.action === 'approve' && (!process.env.R2_PUBLIC_URL || !/^profiles\/[a-f0-9-]{36}\.jpg$/.test(employee.photoUpdate.key))) return NextResponse.json({ error: 'Photo storage is unavailable.' }, { status: 503 });
  const update = { 'photoUpdate.status': body.action === 'approve' ? 'approved' : 'rejected', 'photoUpdate.reviewedAt': new Date(), 'photoUpdate.reviewedBy': user.id, updatedAt: new Date(), ...(body.action === 'approve' ? { profileUrl: `${process.env.R2_PUBLIC_URL!.replace(/\/$/, '')}/${employee.photoUpdate.key}`, profileFilename: employee.photoUpdate.key, isUploadedtoR2: true } : {}) };
  const result = await employees.updateOne({ employeeId: body.employeeId, 'photoUpdate.id': body.requestId, 'photoUpdate.status': 'pending', profileUrl: employee.profileUrl }, { $set: update });
  if (!result.matchedCount) return NextResponse.json({ error: 'Profile changed. Refresh before reviewing.' }, { status: 409 });
  return NextResponse.json({ success: true });
}
