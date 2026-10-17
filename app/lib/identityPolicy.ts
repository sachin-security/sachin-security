import { createHash } from "node:crypto";

export type VerificationKind = "face" | "aadhaar";
export function photoVersion(url: string): string {
  return createHash("sha256").update(url).digest("hex");
}
export function verifiedResult(
  kind: VerificationKind,
  result: Record<string, unknown>,
  subject: string,
  sessionId: string,
): boolean {
  if (result.subject !== subject || result.sessionId !== sessionId || result.status !== "verified") return false;
  return kind === "face"
    ? result.livenessPassed === true && result.faceMatched === true
    : result.authenticationMethod === "aadhaar_otp" && result.consentRecorded === true && result.identityMatched === true;
}

export function verificationUrl(value: unknown): string {
  if (typeof value !== "string") throw new Error("Invalid verification URL");
  const url = new URL(value);
  const allowed = (process.env.IDENTITY_HOSTED_ORIGINS || "").split(",").map(x => x.trim());
  if (url.protocol !== "https:" || url.username || url.password || !allowed.includes(url.origin)) {
    throw new Error("Verification URL is not approved");
  }
  return url.href;
}
