export function threshold(value: string | undefined, fallback: number): number {
  const score = value === undefined || value === "" ? fallback : Number(value);
  if (!Number.isFinite(score) || score < 90 || score > 100) throw new Error("Face threshold must be between 90 and 100");
  return score;
}

export function awsFaceConfigured(): boolean {
  return process.env.FACE_VERIFICATION_PROVIDER === "aws" && process.env.FACE_AWS_DATA_USE_REVIEWED === "true" && !!(process.env.FACE_AWS_REGION && process.env.FACE_AWS_ACCESS_KEY_ID && process.env.FACE_AWS_SECRET_ACCESS_KEY && process.env.FACE_AWS_BROWSER_ROLE_ARN);
}

export function validEnrollmentKey(value: unknown): value is string {
  return typeof value === "string" && /^profiles\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png)$/i.test(value);
}

export function livenessPassed(status: unknown, score: unknown, minimum: number): boolean {
  return status === "SUCCEEDED" && typeof score === "number" && Number.isFinite(score) && score >= minimum && score <= 100;
}
