export interface FaceCheckResult {
  verified?: boolean;
  id?: string;
  pending?: boolean;
  error?: string;
}

function waitForResult(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 2000);
    signal.addEventListener("abort", abort, { once: true });
  });
}

// Retry only an explicitly pending result. Failed faces must never be approved
// by retrying, and withdrawal/unmount must stop both polling and its callbacks.
export async function checkFaceResult(
  check: () => Promise<FaceCheckResult>,
  signal: AbortSignal,
  pause: (signal: AbortSignal) => Promise<void> = waitForResult,
): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    signal.throwIfAborted();
    const result = await check();
    signal.throwIfAborted();
    if (result.verified === true && typeof result.id === "string" && result.id) return result.id;
    if (result.pending !== true) throw new Error(result.error || "Face verification did not pass. Please retry or contact HR.");
    if (attempt < 7) await pause(signal);
  }
  throw new Error("The face result is taking too long. Please retry or contact HR for manual attendance review.");
}
