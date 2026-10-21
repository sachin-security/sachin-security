"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { FacePrivacyNotice } from "@/app/lib/facePrivacy";
import { checkFaceResult } from "@/app/lib/faceCheck";
const AwsFaceCapture = dynamic(() => import("./AwsFaceCapture"), { ssr: false, loading: () => <p>Loading secure camera check…</p> });

export default function IdentityVerification({ kind, onVerified, faceNotice, verifiedId }: {
  kind: "face" | "aadhaar"; onVerified: (id: string) => void;
  faceNotice?: FacePrivacyNotice | null; verifiedId?: string;
}) {
  const [session, setSession] = useState<{ id: string; url?: string; captureMode?: "aws"; awsSessionId?: string; region?: string } | null>(null);
  const [captureFinished, setCaptureFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => { operation.current?.abort(); }, []);
  const label = kind === "face" ? "Face verification" : "Aadhaar OTP verification";
  async function run(action: "start" | "check", sessionId = session?.id) {
    if (operation.current) return;
    const controller = new AbortController();
    operation.current = controller;
    setBusy(true); setError("");
    try {
      const request = async () => {
        const res = await fetch("/api/identity", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ kind, action, id: sessionId,
          ...(kind === "face" ? { faceConsent: { accepted: consent, noticeVersion: faceNotice?.version } } : {}),
        }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        return data;
      };
      if (action === "check" && session?.captureMode === "aws") {
        const id = await checkFaceResult(request, controller.signal);
        controller.signal.throwIfAborted();
        onVerified(id); setSession(null); return;
      }
      const data = await request();
      controller.signal.throwIfAborted();
      if (data.error) throw new Error(data.error || "Verification failed");
      if (action === "start") { setSession({ id: data.id, url: data.url, captureMode: data.captureMode, awsSessionId: data.awsSessionId, region: data.region }); setReceiptId(data.id); setCaptureFinished(false); }
      else if (data.verified) { onVerified(data.id); setSession(null); }
    } catch (e) {
      if (!controller.signal.aborted) {
        setError(e instanceof Error ? e.message : "Verification failed");
        if (session?.captureMode === "aws") { setSession(null); setConsent(false); }
      }
    }
    finally { if (operation.current === controller) { operation.current = null; setBusy(false); } }
  }
  async function withdraw() {
    operation.current?.abort(); operation.current = null;
    const id = receiptId || verifiedId;
    setBusy(true); setConsent(false); setSession(null); onVerified("");
    try {
      const res = await fetch("/api/identity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "face", action: "withdraw", id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Withdrawal could not be completed. Contact HR.");
      setSession(null); setReceiptId(""); setDeclined(true); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Contact HR to complete withdrawal."); }
    finally { setBusy(false); }
  }
  return <section className="my-3 rounded-lg border border-gray-200 p-3 text-sm" aria-label={label}>
    <h3 className="font-semibold">{label}</h3>
    {kind === "face" && (faceNotice ? <div className="my-2 space-y-2 text-gray-700" id="face-privacy-notice">
      <p><strong>Who uses your data:</strong> {faceNotice.controller}, with verification processor {faceNotice.provider}.</p>
      <p><strong>Purpose:</strong> {faceNotice.purpose}</p>
      <p><strong>Data used:</strong> {faceNotice.data}</p>
      <p><strong>Retention:</strong> {faceNotice.retention} Consent receipts are kept for {faceNotice.consentRetentionDays} days. Attendance records and the existing HR enrollment photo follow the employer’s separate retention policy.</p>
      <p>You can decline and contact HR for manual attendance review. No face processing starts without consent. You may withdraw below or from <a className="underline" href="/portal/privacy">Face privacy &amp; consent</a>. Withdrawal stops future use of this consent; an attendance entry already recorded is not automatically deleted.</p>
      <p>For access, correction, erasure or grievances, contact <a className="underline" href={`mailto:${faceNotice.contactEmail}`}>{faceNotice.contactEmail}</a>. You may also use remedies available through the Data Protection Board of India under applicable law.</p>
    </div> : <p className="my-2 text-amber-800">Face attendance is unavailable until the provider, privacy contact and retention notice are configured.</p>)}
    {declined && <p role="status" className="my-2">Face consent declined or withdrawn. Contact HR for manual attendance review.</p>}
    {!verifiedId && <>
    <label className="my-2 flex items-start gap-2">
      <input type="checkbox" checked={consent} disabled={busy || (kind === "face" && !faceNotice)} onChange={e => { if (!e.target.checked && kind === "face" && receiptId) { void withdraw(); } else { setConsent(e.target.checked); setDeclined(false); } }} />
      <span>{kind === "face" ? "I agree to a live face check against my enrollment photo for this attendance punch." : "I agree to verify my identity through Aadhaar OTP with the authentication provider."}</span>
    </label>
    {session ? <div className="space-y-2">
      {session.captureMode === "aws" ? <>
        <p>Allow the camera, then move your face into the oval as directed. There are no flashing lights. We check the result automatically against your saved employee photo.</p>
        {consent && !captureFinished && session.awsSessionId && session.region && <AwsFaceCapture key={session.id} id={session.id} sessionId={session.awsSessionId} region={session.region}
          onComplete={() => { setCaptureFinished(true); void run("check", session.id); }} onCancel={() => { void withdraw(); }}
          onError={message => { setCaptureFinished(true); setSession(null); setConsent(false); setError(message); }} />}
        {captureFinished && busy && <p role="status">Checking your face against your saved employee photo…</p>}
      </> : <>
        {consent && <a className="block text-amber-800 underline" href={session.url} target="_blank" rel="noopener noreferrer">Open secure verification (new tab)</a>}
        <p>Complete verification in that tab, then return here. Sessions expire after five minutes.</p>
      </>}
      {session.captureMode !== "aws" && <button type="button" disabled={busy || !consent} onClick={() => run("check")} className="rounded border px-3 py-2 disabled:opacity-50">{busy ? "Checking…" : "Check verification"}</button>}
      <button type="button" disabled={busy} onClick={() => setSession(null)} className="ml-2 underline">Start again</button>
    </div> : <button type="button" disabled={busy || !consent} onClick={() => run("start")} className="rounded border px-3 py-2 disabled:opacity-50">{busy ? "Starting…" : `Start ${label.toLowerCase()}`}</button>}
    </>}
    {kind === "face" && <div className="mt-2">
      {receiptId || verifiedId ? <button type="button" onClick={withdraw} className="underline">Withdraw face consent</button> : <button type="button" disabled={busy} onClick={() => { setConsent(false); setDeclined(true); }} className="underline">I do not consent</button>}
      <p className="mt-2 text-xs">Your browser or provider will ask for camera permission separately. Giving camera permission does not submit an attendance punch.</p>
    </div>}
    {error && <p role="alert" className="mt-2 text-red-700">{error}</p>}
  </section>;
}
