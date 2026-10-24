'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
type PhotoRequest = { employeeId: string; fullName: string; profileUrl?: string; photoUpdate: { id: string; submittedAt: string } };
export default function PhotoRequests() {
  const [requests, setRequests] = useState<PhotoRequest[]>([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  async function load() {
    try { const response = await fetch('/api/me/photo?scope=all', { cache: 'no-store' }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Could not load requests.'); setRequests(result.data); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Could not load requests.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function review(item: PhotoRequest, action: 'approve' | 'reject') {
    if (!window.confirm(action === 'approve' ? `Confirm you have checked ${item.fullName} (${item.employeeId}) and this is their own photo. Approve it as the new face-punch reference?` : 'Reject this replacement photo?')) return;
    setBusy(true); setNotice('');
    try { const response = await fetch('/api/me/photo', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId: item.employeeId, requestId: item.photoUpdate.id, action }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Review failed.'); setNotice(action === 'approve' ? 'Photo approved. The employee must start a new face verification.' : 'Photo rejected.'); await load(); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Review failed.'); }
    finally { setBusy(false); }
  }
  return <div className="max-w-5xl mx-auto"><h1 className="text-3xl font-bold text-gray-900">Employee photo requests</h1><p className="text-gray-600 mt-3">Verify the employee’s identity before approving. Approval replaces their attendance reference photo; face matching and liveness are still required. Shows up to 100 oldest pending requests.</p><button type="button" onClick={load} disabled={busy} className="underline mt-4">Refresh requests</button><p role="status" className="my-4">{notice}</p>{loading ? <p>Loading requests…</p> : requests.length === 0 ? <p>No pending photo requests.</p> : <div className="space-y-5">{requests.map(item => <section key={item.photoUpdate.id} className="bg-white border rounded-xl p-6"><h2 className="font-bold text-lg">{item.fullName} · {item.employeeId}</h2><p className="text-sm text-gray-500 mb-4">Submitted {new Date(item.photoUpdate.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p><div className="flex flex-wrap gap-8">{item.profileUrl && <div><p className="text-sm mb-2">Current enrollment</p><Image src={item.profileUrl} alt="Current enrollment" width={150} height={180} unoptimized className="object-contain h-44 w-36 border rounded-lg" /></div>}<div><p className="text-sm mb-2">Requested replacement</p><Image src={`/api/me/photo?view=pending&employeeId=${encodeURIComponent(item.employeeId)}&request=${item.photoUpdate.id}`} alt="Requested replacement" width={150} height={180} unoptimized className="object-contain h-44 w-36 border rounded-lg" /></div></div><div className="flex gap-4 mt-5"><button type="button" disabled={busy} onClick={() => review(item, 'approve')} className="px-4 py-2 bg-red-700 text-white rounded-lg disabled:opacity-50">Approve photo</button><button type="button" disabled={busy} onClick={() => review(item, 'reject')} className="px-4 py-2 border rounded-lg disabled:opacity-50">Reject photo</button></div></section>)}</div>}</div>;
}
