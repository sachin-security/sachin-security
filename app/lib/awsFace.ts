import { RekognitionClient, CreateFaceLivenessSessionCommand, GetFaceLivenessSessionResultsCommand, CompareFacesCommand, DetectFacesCommand } from "@aws-sdk/client-rekognition";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { getR2Object } from "@/app/lib/r2";
import { awsFaceConfigured, livenessPassed, threshold, validEnrollmentKey } from "@/app/lib/awsFacePolicy";

function configuration() {
  if (!awsFaceConfigured()) throw new Error("AWS face verification is not configured");
  return { region: process.env.FACE_AWS_REGION!, credentials: {
    accessKeyId: process.env.FACE_AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.FACE_AWS_SECRET_ACCESS_KEY!,
    ...(process.env.FACE_AWS_SESSION_TOKEN ? { sessionToken: process.env.FACE_AWS_SESSION_TOKEN } : {}),
  } };
}

export async function awsBrowserCredentials(sessionId: string) {
  const config = configuration();
  const sts = new STSClient(config);
  const response = await sts.send(new AssumeRoleCommand({
    RoleArn: process.env.FACE_AWS_BROWSER_ROLE_ARN!, RoleSessionName: `hrms-face-${sessionId}`,
    DurationSeconds: 900,
    // The browser can stream to a pre-created random session, never create,
    // inspect sessions, compare/search faces, access R2 or manage AWS resources.
    Policy: JSON.stringify({ Version: "2012-10-17", Statement: [{ Effect: "Allow", Action: "rekognition:StartFaceLivenessSession", Resource: "*", Condition: { StringEquals: { "aws:RequestedRegion": config.region } } }] }),
  }));
  const c = response.Credentials;
  if (!c?.AccessKeyId || !c.SecretAccessKey || !c.SessionToken || !c.Expiration) throw new Error("AWS did not issue streaming credentials");
  return { accessKeyId: c.AccessKeyId, secretAccessKey: c.SecretAccessKey, sessionToken: c.SessionToken, expiration: c.Expiration.toISOString() };
}

export async function awsFaceProvider(path: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const config = configuration();
  const client = new RekognitionClient(config);
  if (path === "sessions/withdraw") {
    // AWS exposes no per-session cancel/delete API. Never claim remote erasure.
    // Local proofs are revoked by the caller; streaming UI is unmounted.
    return { processingStopped: false, deletionCompleted: false };
  }
  if (path === "sessions/start") {
    if (!validEnrollmentKey(payload.referencePhotoKey)) throw new Error("Re-upload the enrollment photo before using AWS face verification");
    const result = await client.send(new CreateFaceLivenessSessionCommand({
      ClientRequestToken: String(payload.sessionId), Settings: { AuditImagesLimit: 0 },
    }));
    if (!result.SessionId) throw new Error("AWS did not create a liveness session");
    return { providerSessionId: result.SessionId, captureMode: "aws", region: config.region };
  }
  if (path !== "sessions/check" || typeof payload.providerSessionId !== "string" || !validEnrollmentKey(payload.referencePhotoKey)) throw new Error("Invalid AWS face operation");
  const result = await client.send(new GetFaceLivenessSessionResultsCommand({ SessionId: payload.providerSessionId }));
  const base = { sessionId: payload.sessionId, subject: payload.subject, status: "failed", livenessPassed: false, faceMatched: false };
  if (result.SessionId !== payload.providerSessionId || !livenessPassed(result.Status, result.Confidence, threshold(process.env.FACE_AWS_LIVENESS_THRESHOLD, 95)) || !result.ReferenceImage?.Bytes) return base;
  // Only read a validated profiles/ key from the private configured R2 bucket.
  // Never fetch an arbitrary enrollment URL, and never persist live face bytes.
  const enrollment = await getR2Object(payload.referencePhotoKey);
  if (!enrollment.bytes.length || enrollment.bytes.length > 5 * 1024 * 1024) throw new Error("Enrollment image size is invalid");
  const detected = await client.send(new DetectFacesCommand({ Image: { Bytes: enrollment.bytes }, Attributes: ["DEFAULT"] }));
  if (detected.FaceDetails?.length !== 1) throw new Error("Enrollment photo must contain exactly one face");
  const compared = await client.send(new CompareFacesCommand({
    SourceImage: { Bytes: enrollment.bytes }, TargetImage: { Bytes: result.ReferenceImage.Bytes },
    SimilarityThreshold: threshold(process.env.FACE_AWS_MATCH_THRESHOLD, 99), QualityFilter: "AUTO",
  }));
  const faceMatched = compared.FaceMatches?.length === 1 && !compared.UnmatchedFaces?.length &&
    (compared.FaceMatches[0].Similarity ?? 0) >= threshold(process.env.FACE_AWS_MATCH_THRESHOLD, 99);
  return { ...base, status: faceMatched ? "verified" : "failed", livenessPassed: true, faceMatched };
}
