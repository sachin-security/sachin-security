import { NextResponse } from "next/server";
import { randomUUID, createHmac } from "node:crypto";
import { requirePermission } from "@/app/lib/apiAuth";
import { getCollection } from "@/app/lib/db";
import { identityProvider } from "@/app/lib/identityProvider";
import { photoVersion, verificationUrl, verifiedResult } from "@/app/lib/identityPolicy";
import { acceptsFaceNotice, getFacePrivacyNotice } from "@/app/lib/facePrivacy";
import { awsFaceConfigured } from "@/app/lib/awsFacePolicy";

function aadhaarVersion(value: string) {
  const key = process.env.IDENTITY_PROVIDER_API_KEY;
  if (!key) throw new Error("Provider is not configured");
  return createHmac("sha256", key).update(value).digest("hex");
}

export async function GET() {
  const perm = await requirePermission("attendance:write:self");
  if (!perm.ok) return NextResponse.json({ error: perm.error }, { status: perm.status });
  const employees = await getCollection("employees");
  const employee = perm.user.employeeId ? await employees.findOne({ employeeId: perm.user.employeeId }) : null;
  const receipts = perm.user.employeeId ? await (await getCollection("faceConsentReceipts")).find(
    { employeeId: perm.user.employeeId, userId: perm.user.id, expiresAt: { $gt: new Date() } },
    { projection: { _id: 0, id: 1, grantedAt: 1, withdrawnAt: 1, processorStoppedAt: 1 } },
  ).sort({ grantedAt: -1 }).limit(20).toArray() : [];
  return NextResponse.json({
    faceRequired: process.env.FACE_ATTENDANCE_REQUIRED === "true",
    faceTestEnabled: !!perm.user.employeeId && (process.env.FACE_TEST_EMPLOYEE_IDS || "").split(",").map(id => id.trim()).includes(perm.user.employeeId),
    aadhaarRequired: process.env.AADHAAR_ATTENDANCE_REQUIRED === "true",
    configured: !!(process.env.IDENTITY_PROVIDER_URL && process.env.IDENTITY_PROVIDER_API_KEY && process.env.IDENTITY_HOSTED_ORIGINS),
    faceConfigured: awsFaceConfigured() || (process.env.FACE_VERIFICATION_PROVIDER !== "aws" && !!(process.env.IDENTITY_PROVIDER_URL && process.env.IDENTITY_PROVIDER_API_KEY && process.env.IDENTITY_HOSTED_ORIGINS)),
    aadhaarVerified: !!employee?.aadhaarVerification?.verifiedAt,
    faceNotice: getFacePrivacyNotice(),
    faceConsentReceipts: receipts,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const perm = await requirePermission("attendance:write:self");
  if (!perm.ok) return NextResponse.json({ error: perm.error }, { status: perm.status });
  const employeeId = perm.user.employeeId;
  if (!employeeId) return NextResponse.json({ error: "No employee profile linked" }, { status: 400 });
  // Browser POSTs must originate from this application.
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  if (!body || !["face", "aadhaar"].includes(body.kind) || !["start", "check", "withdraw", "credentials", "status"].includes(body.action)) {
    return NextResponse.json({ error: "Invalid verification request" }, { status: 400 });
  }
  const { kind, action } = body;
  const notice = getFacePrivacyNotice();
  if (kind === "face" && action === "start" && !acceptsFaceNotice(body.faceConsent, notice)) {
    return NextResponse.json({ error: notice ? "Read the face-data notice and give consent before face verification." : "Face attendance is not ready: privacy notice and provider details must be configured." }, { status: 403 });
  }
  const employees = await getCollection("employees");
  const employee = await employees.findOne({ employeeId });
  if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  if (action !== "withdraw" && kind === "face" && !employee.profileUrl) {
    return NextResponse.json({ error: "Ask HR to upload your enrollment photo first." }, { status: 400 });
  }
  if (action !== "withdraw" && kind === "aadhaar" && (typeof employee.aadharNumber !== "string" || !/^[2-9]\d{11}$/.test(employee.aadharNumber))) {
    return NextResponse.json({ error: "Ask HR to enter a valid enrollment Aadhaar number first." }, { status: 400 });
  }
  const sessions = await getCollection("identitySessions");
  try {
    await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    if (action === "withdraw") {
      if (kind !== "face" || typeof body.id !== "string") return NextResponse.json({ error: "Invalid withdrawal request" }, { status: 400 });
      const receipts = await getCollection("faceConsentReceipts");
      const receipt = await receipts.findOne({ id: body.id, employeeId, userId: perm.user.id });
      if (!receipt) return NextResponse.json({ error: "Consent record not found" }, { status: 404 });
      // Revoke first; a processor outage must not leave the proof usable.
      await sessions.updateOne({ id: body.id, employeeId, userId: perm.user.id }, { $set: { revokedAt: new Date() } });
      await receipts.updateOne({ _id: receipt._id }, { $set: { withdrawnAt: new Date() } });
      const result = await identityProvider("sessions/withdraw", { sessionId: body.id, providerSessionId: receipt.providerSessionId, subject: employeeId, kind: "face", provider: receipt.provider || "hosted", eraseFaceData: true });
      if (result.processingStopped !== true) throw new Error("Processor withdrawal pending");
      await (await getCollection("faceConsentReceipts")).updateOne({ _id: receipt._id }, { $set: { processorStoppedAt: new Date(), deletionConfirmed: result.deletionCompleted === true } });
      return NextResponse.json({ withdrawn: true });
    }
    if (action === "start") {
      // Atomic, shared rate limit across all application instances.
      const limits = await getCollection("identityRateLimits");
      await limits.createIndex({ employeeId: 1, window: 1, kind: 1 }, { unique: true });
      await limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      const now = Date.now();
      const window = Math.floor(now / 60000);
      const limit = await limits.findOneAndUpdate(
        { employeeId, window, kind },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(now + 120000) } },
        { upsert: true, returnDocument: "after" },
      );
      if ((limit?.count ?? 99) > 5) return NextResponse.json({ error: "Too many attempts. Wait a minute." }, { status: 429 });
      const id = randomUUID();
      const provider = kind === "face" && process.env.FACE_VERIFICATION_PROVIDER === "aws" ? "aws" : "hosted";
      if (kind === "face" && notice) {
        const receipts = await getCollection("faceConsentReceipts");
        await receipts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
        await receipts.insertOne({ id, employeeId, userId: perm.user.id, noticeVersion: notice.version, notice,
          grantedAt: new Date(), purpose: "attendance_punch", provider, expiresAt: new Date(now + notice.consentRetentionDays * 86400000) });
      }
      const result = await identityProvider("sessions/start", {
        sessionId: id, subject: employeeId, kind, provider,
        ...(kind === "face" ? { consent: { noticeVersion: notice!.version, grantedAt: new Date().toISOString(), purpose: "attendance_punch" }, prohibitTraining: true, prohibitSecondaryUse: true } : {}),
        ...(kind === "face" ? { referencePhotoUrl: employee.profileUrl, referencePhotoKey: employee.profileFilename, requireLiveness: true } : { authenticationMethod: "aadhaar_otp", requireConsent: true, expectedAadhaarNumber: employee.aadharNumber }),
      });
      const url = provider === "aws" ? null : verificationUrl(result.url);
      if (typeof result.providerSessionId !== "string" || !result.providerSessionId) throw new Error("Invalid provider session");
      if (kind === "face") await (await getCollection("faceConsentReceipts")).updateOne({ id }, { $set: { providerSessionId: result.providerSessionId } });
      await sessions.insertOne({ id, employeeId, userId: perm.user.id, kind,
        providerSessionId: result.providerSessionId, provider,
        ...(provider === "aws" ? { referencePhotoKey: employee.profileFilename } : {}),
        photoVersion: kind === "face" ? photoVersion(employee.profileUrl) : null,
        aadhaarVersion: kind === "aadhaar" ? aadhaarVersion(employee.aadharNumber) : null,
        ...(kind === "face" ? { consentVersion: notice!.version } : {}),
        status: "pending", createdAt: new Date(), expiresAt: new Date(now + (provider === "aws" ? 3 : 5) * 60000) });
      return NextResponse.json({ id, url, ...(provider === "aws" ? { captureMode: "aws", awsSessionId: result.providerSessionId, region: result.region } : {}) });
    }
    if (typeof body.id !== "string") return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    const session = await sessions.findOne({ id: body.id, employeeId, userId: perm.user.id, kind, expiresAt: { $gt: new Date() } });
    if (!session || session.consumedAt || session.revokedAt) return NextResponse.json({ error: "Verification expired, withdrawn or used. Start again." }, { status: 400 });
    if (kind === "face" && (!notice || session.consentVersion !== notice.version)) return NextResponse.json({ error: "The face-data notice changed. Read it and consent again." }, { status: 403 });
    if (action === "status") return NextResponse.json({ active: true }, { headers: { "Cache-Control": "no-store" } });
    if (action === "credentials") {
      if (kind !== "face" || session.provider !== "aws" || session.status !== "pending") return NextResponse.json({ error: "Invalid camera session" }, { status: 403 });
      const claimed = await sessions.findOneAndUpdate({ _id: session._id, revokedAt: { $exists: false }, credentialsIssuedAt: { $exists: false }, expiresAt: { $gt: new Date() } }, { $set: { credentialsIssuedAt: new Date() } }, { returnDocument: "before" });
      if (!claimed) return NextResponse.json({ error: "Camera credentials already issued or session revoked. Start again." }, { status: 403 });
      const { awsBrowserCredentials } = await import("@/app/lib/awsFace");
      const credentials = await awsBrowserCredentials(session.id);
      return NextResponse.json({ credentials }, { headers: { "Cache-Control": "no-store" } });
    }
    if (session.provider === "aws" && session.referencePhotoKey !== employee.profileFilename) return NextResponse.json({ error: "Enrollment photo changed. Verify again." }, { status: 409 });
    const result = await identityProvider("sessions/check", { providerSessionId: session.providerSessionId, sessionId: session.id, subject: employeeId, kind, provider: session.provider || "hosted", referencePhotoKey: employee.profileFilename });
    if (!verifiedResult(kind, result, employeeId, session.id)) {
      return NextResponse.json({ verified: false, error: "Verification is incomplete or was unsuccessful. Complete it in the verification tab, then check again." });
    }
    if (kind === "face" && session.photoVersion !== photoVersion(employee.profileUrl)) {
      return NextResponse.json({ error: "Enrollment photo changed. Start face verification again." }, { status: 409 });
    }
    if (kind === "aadhaar" && session.aadhaarVersion !== aadhaarVersion(employee.aadharNumber)) {
      return NextResponse.json({ error: "Enrollment Aadhaar changed. Start verification again." }, { status: 409 });
    }
    await sessions.updateOne({ _id: session._id, consumedAt: { $exists: false }, revokedAt: { $exists: false } }, { $set: { status: "verified", verifiedAt: new Date() } });
    if (kind === "aadhaar") {
      // Update only the employee whose Aadhaar field was verified for this request.
      const saved = await employees.updateOne({ _id: employee._id, aadharNumber: employee.aadharNumber }, { $set: {
        aadhaarVerification: { verifiedAt: new Date(), method: "aadhaar_otp", sessionId: session.id },
      } });
      if (!saved.matchedCount) return NextResponse.json({ error: "Enrollment changed. Start verification again." }, { status: 409 });
    }
    return NextResponse.json({ verified: true, id: session.id });
  } catch {
    if (action === "withdraw") return NextResponse.json({ error: "Withdrawal needs follow-up. Check Face privacy & consent for its status, retry there, or contact HR. Provider stop/deletion has not been confirmed." }, { status: 503 });
    return NextResponse.json({ error: "Identity verification is unavailable. Ask your administrator to check the provider configuration." }, { status: 503 });
  }
}
