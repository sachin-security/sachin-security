"use client";
import { useMemo, useEffect, useRef } from "react";
import { FaceLivenessDetectorCore, type AwsCredentialProvider } from "@aws-amplify/ui-react-liveness";
import { ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function AwsFaceCapture({ id, sessionId, region, onComplete, onCancel, onError }: {
  id: string; sessionId: string; region: string;
  onComplete: () => void; onCancel: () => void; onError: (message: string) => void;
}) {
  const onErrorRef = useRef(onError);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    async function checkActive() {
      if (pending) return;
      pending = true;
      try {
        const res = await fetch("/api/identity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "face", action: "status", id }), signal: controller.signal });
        if (!res.ok && !controller.signal.aborted) onErrorRef.current("Camera session stopped: consent was withdrawn, changed or expired. Start again only if you wish to consent.");
      } catch { if (!controller.signal.aborted) onErrorRef.current("Camera session stopped because the consent status could not be checked. Please retry."); }
      finally { pending = false; }
    }
    const timer = setInterval(() => { void checkActive(); }, 3000);
    return () => { clearInterval(timer); controller.abort(); };
  }, [id]);
  const credentialProvider = useMemo<AwsCredentialProvider>(() => {
    let request: ReturnType<AwsCredentialProvider> | undefined;
    return () => {
      request ??= (async () => {
        const res = await fetch("/api/identity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "face", action: "credentials", id }) });
        if (!res.ok) throw new Error("Camera session expired or consent was withdrawn. Start again.");
        const data = await res.json();
        return { ...data.credentials, expiration: new Date(data.credentials.expiration) };
      })();
      return request;
    };
  }, [id]);
  return <div className="my-3" aria-label="Live face camera check"><ThemeProvider>
    <FaceLivenessDetectorCore sessionId={sessionId} region={region} config={{ credentialProvider }}
      onAnalysisComplete={async () => { onComplete(); }} onUserCancel={onCancel}
      onError={() => onError("Live camera verification failed. Check camera permission and lighting, or contact HR for manual attendance review.")} />
  </ThemeProvider></div>;
}
