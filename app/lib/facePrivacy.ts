import { createHash } from "node:crypto";

export interface FacePrivacyNotice {
  version: string;
  controller: string;
  provider: string;
  purpose: string;
  data: string;
  retention: string;
  contactEmail: string;
  consentRetentionDays: number;
}

// Face processing stays unavailable until the operator publishes real processor,
// retention and grievance details. Camera permission alone is never consent.
export function getFacePrivacyNotice(): FacePrivacyNotice | null {
  const provider = process.env.FACE_PROVIDER_NAME?.trim();
  const retention = process.env.FACE_RETENTION_NOTICE?.trim();
  const contactEmail = process.env.FACE_PRIVACY_CONTACT_EMAIL?.trim();
  const days = Number(process.env.FACE_CONSENT_RETENTION_DAYS);
  if (!provider || !retention || !contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) || !Number.isInteger(days) || days < 1 || days > 3650) return null;
  const content = {
    controller: "Sachin Security Services Pvt. Ltd.", provider, retention, contactEmail,
    purpose: "Verify that you are the enrolled employee for this attendance punch, using a live face and liveness check. Face data must not be used for advertising, model training or unrelated monitoring.",
    data: "Your saved enrollment photo, live camera face images/video captured by the provider, the face-match/liveness result, employee/account identifiers, and the time and version of your consent. The HRMS does not store the live face capture or face template.",
    consentRetentionDays: days,
  };
  return { ...content, version: createHash("sha256").update(JSON.stringify(content)).digest("hex") };
}

export function acceptsFaceNotice(value: unknown, notice: FacePrivacyNotice | null): boolean {
  if (!notice || !value || typeof value !== "object") return false;
  const consent = value as Record<string, unknown>;
  return consent.accepted === true && consent.noticeVersion === notice.version;
}
