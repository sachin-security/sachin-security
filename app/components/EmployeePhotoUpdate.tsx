'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function EmployeePhotoUpdate() {
  const [data, setData] = useState<{ profileUrl?: string; status?: string; requestId?: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  async function refresh() {
    const response = await fetch('/api/me/photo', { cache: 'no-store' }); const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not load photograph.');
    setData(result.data);
  }
  useEffect(() => { refresh().catch(error => setNotice(error.message)); }, []);
  useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (!file || !confirmed || busy) return;
    setBusy(true); setNotice('');
    try {
      const form = new FormData(); form.append('photo', file);
      const response = await fetch('/api/me/photo', { method: 'POST', body: form }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Upload failed.');
      setFile(null); setConfirmed(false); await refresh(); setNotice(result.message);
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Upload failed.'); }
    finally { setBusy(false); }
  }
  return <section className="bg-white rounded-2xl border border-gray-200 p-6" aria-labelledby="photo-update-heading">
    <h2 id="photo-update-heading" className="text-lg font-bold text-gray-900">My photograph</h2>
    <p className="text-sm text-gray-600 mt-2">Upload a recent, front-facing photo of yourself with even lighting, a plain background and no sunglasses. Show only your face. HR will review it before it replaces the photo used for face punching.</p>
    <div className="flex flex-wrap gap-5 mt-4">
      {data?.profileUrl && <div><p className="text-xs text-gray-500 mb-2">Current enrollment photo</p><Image src={data.profileUrl} alt="Current enrollment photograph" width={120} height={150} unoptimized className="rounded-lg object-contain h-36 w-28 border" /></div>}
      {data?.status === 'pending' && <div><p className="text-xs text-gray-500 mb-2">Waiting for HR approval</p><Image src={`/api/me/photo?view=pending&request=${encodeURIComponent(data.requestId || '')}`} alt="Photograph submitted for review" width={120} height={150} unoptimized className="rounded-lg object-contain h-36 w-28 border" /></div>}
      {preview && <Image src={preview} alt="Selected photograph preview" width={120} height={150} unoptimized className="rounded-lg object-contain h-36 w-28 border" />}
    </div>
    {data?.status === 'approved' && <p className="text-sm text-green-700 mt-3">Your replacement was approved. Start a new face verification to use the updated photo.</p>}
    {data?.status === 'rejected' && <p className="text-sm text-red-700 mt-3">HR did not approve the last photo. Contact HR for guidance, then submit a clearer photograph.</p>}
    {data && data.status !== 'pending' && <form onSubmit={submit} className="space-y-3 mt-5">
      <label className="block text-sm font-medium" htmlFor="employee-new-photo">Choose a new photograph (JPG/PNG, up to 5 MB)</label>
      <input id="employee-new-photo" type="file" accept="image/jpeg,image/png" disabled={busy} onChange={event => { const selected = event.target.files?.[0]; setNotice(''); setConfirmed(false); if (!selected) return setFile(null); if (!['image/jpeg','image/png'].includes(selected.type) || selected.size > 5 * 1024 * 1024) { setFile(null); setNotice('Choose a JPG or PNG up to 5 MB.'); return; } setFile(selected); }} className="block w-full text-sm" />
      <label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" checked={confirmed} disabled={busy} onChange={event => setConfirmed(event.target.checked)} className="mt-1" />I confirm this is my own recent photograph and request an enrollment-photo update.</label>
      <button type="submit" disabled={!file || !confirmed || busy} className="bg-red-700 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-50">{busy ? 'Submitting…' : 'Submit photo for approval'}</button>
    </form>}
    {data?.status === 'pending' && <p className="text-sm text-amber-800 mt-4">Your current enrollment photo remains active until HR approves the replacement. Contact HR for attendance assistance while waiting.</p>}
    <p role="status" className="text-sm mt-3 text-gray-700">{notice}</p>
    <button type="button" disabled={busy} onClick={() => refresh().catch(error => setNotice(error.message))} className="text-sm underline mt-2">Refresh photo status</button>
  </section>;
}
