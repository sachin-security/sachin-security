"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { FacePrivacyNotice } from "@/app/lib/facePrivacy";

type Receipt = { id: string; grantedAt: string; withdrawnAt?: string; processorStoppedAt?: string };
export default function FacePrivacyPage() {
  const [notice, setNotice] = useState<FacePrivacyNotice | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    const res = await fetch("/api/identity");
    if (!res.ok) throw new Error("Could not load consent records.");
    const data = await res.json(); setNotice(data.faceNotice); setReceipts(data.faceConsentReceipts || []);
  }
  useEffect(() => { load().catch(e => setMessage(e.message)); }, []);
  async function withdraw(id: string) {
    setBusy(true); setMessage("");
    try {
      const res = await fetch("/api/identity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "face", action: "withdraw", id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Contact HR to complete withdrawal.");
      await load(); setMessage("Consent withdrawn. This face verification cannot be used for another attendance punch.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Please contact HR."); }
    finally { setBusy(false); }
  }
  return <div className="max-w-2xl space-y-4 text-gray-900">
    <Link className="underline" href="/portal">Back to attendance</Link>
    <h1 className="text-2xl font-bold">Face privacy &amp; consent</h1>
    <p>Face consent is requested separately for every verification. You may decline and contact HR for manual attendance review. Camera permission is separate from consent to process your face data.</p>
    {notice ? <>
      <p><strong>Responsible organisation:</strong> {notice.controller}. <strong>Processor:</strong> {notice.provider}.</p>
      <p>{notice.purpose}</p><p>{notice.data}</p><p>{notice.retention}</p>
      <p>Consent receipts are retained for {notice.consentRetentionDays} days. Withdrawing does not automatically erase past attendance or the existing enrollment photo. Contact HR to request access, correction or erasure, to raise a grievance, or to discuss manual attendance. Use <a className="underline" href={`mailto:${notice.contactEmail}`}>{notice.contactEmail}</a>. Remedies through the Data Protection Board of India remain available under applicable law.</p>
    </> : <p>Face processing is not enabled until the provider and privacy notice are configured. Contact HR for attendance assistance.</p>}
    <h2 className="text-lg font-semibold">Recent consent receipts</h2>
    {receipts.length === 0 && <p>No face consent receipts to display.</p>}
    {receipts.map(receipt => <div key={receipt.id} className="rounded border p-3">
      <p>Given: {new Date(receipt.grantedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
      <p>{receipt.withdrawnAt ? receipt.processorStoppedAt ? "Withdrawn — processor stopped" : "Withdrawn locally — processor confirmation pending" : "Consent recorded for one verification"}</p>
      {!receipt.processorStoppedAt && <button className="mt-2 underline" type="button" disabled={busy} onClick={() => withdraw(receipt.id)}>{receipt.withdrawnAt ? "Retry processor withdrawal" : "Withdraw consent"}</button>}
    </div>)}
    {message && <p role="status">{message}</p>}
  </div>;
}
