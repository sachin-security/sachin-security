# Face attendance and Aadhaar verification setup

Source: https://github.com/sachin-security/sachin-security (main).

## What is implemented

- HR can open **Edit Employee**, select and upload a replacement photo, then save the employee. Unsaved photo selections block saving. Canceling a selection preserves the saved photo.
- Employees see identity verification in the attendance card when a provider is configured. Verification opens the provider's HTTPS screen in a separate tab; the employee completes it and returns to **Check verification**.
- Face attendance, when enabled, requires a live face check against the saved enrollment photo for **each** punch. The backend accepts only a server-confirmed, unexpired, employee/account-bound session and consumes it once. Existing GPS and geofence checks still apply. Changing the enrollment photo invalidates outstanding face proofs.
- Aadhaar OTP verification, when enabled, must match the employee's enrolled Aadhaar through the provider. The app keeps verification status, method and session reference; the new flow does not store OTPs, selfies, face templates or additional Aadhaar copies. Changing Aadhaar in the HR edit form clears verification.
- Aadhaar is an identity check inside the existing signed-in employee portal. It does not replace the application's password login.

## What is still required

### Face consent and DPDP readiness

The attendance UI now shows a separate, itemised face-data notice and an initially unchecked consent box. The API rejects face verification before any employee/provider access unless it receives explicit consent to the **current notice version**. A time-stamped receipt records the employee/account, purpose and exact notice. Consent is scoped to one verification; it is separate from browser/provider camera permission and Aadhaar consent. Verification does not automatically submit an attendance punch.

Configure `FACE_PROVIDER_NAME`, `FACE_RETENTION_NOTICE`, `FACE_PRIVACY_CONTACT_EMAIL`, and `FACE_CONSENT_RETENTION_DAYS` with real, approved operational details. Face verification fails closed if this information is missing. Changes to the notice invalidate earlier unused face proofs. Do not enable enforcement before a genuine HR manual attendance review path is available for refusal, withdrawal, camera denial or failed recognition.

Employees can decline before processing and withdraw using the attendance control or **Face privacy & consent** in the portal. Withdrawal revokes the face proof locally and calls `POST /sessions/withdraw` with `{sessionId, providerSessionId, subject, kind:"face", eraseFaceData:true}`. The adapter must stop capture/processing, revoke the hosted session, and return `{processingStopped:true,deletionCompleted:true}` only after the corresponding provider actions are confirmed. Failed processor cancellation is shown as pending; the employee can retry in the privacy page and HR must follow up. Stopping/deleting provider data must be completed within the applicable legal/contractual timeframes. A local revoked flag is not proof that the provider erased its copies.

The provider receives a consent version and purpose on start, plus `prohibitTraining:true` and `prohibitSecondaryUse:true`. The adapter must enforce these obligations; flags alone do not enforce a third party's behaviour. Never collect face captures for training, advertising or unrelated monitoring. Configure actual face-data deletion and processor/subprocessor controls, access restrictions, incident handling and operator grievance/rights processes before enabling. Consent receipts expire using the configured TTL; live images/templates are not stored by this HRMS flow. Existing HR enrollment photos and attendance records require their own justified retention policy. Only the 20 most recent unexpired consent receipts are shown in the portal; older receipts remain subject to the same rights and retention process through HR.

These controls support a consent-led implementation; they do **not** certify legal compliance. The DPDP Act also contains employment-related legitimate-use provisions; the employer must decide its legal basis and review voluntariness and alternatives. As of 17 October 2026 the rules have a phased commencement schedule, so do not describe every obligation as already effective. Sources: [MeitY final Rules, 13 November 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf), [India Code Act entry](https://www.indiacode.nic.in/indiacode/handle/123456789/22037?view_type=browse).

There is **no face recognition engine or Aadhaar OTP service bundled with this code**. A real provider and a private adapter implementing the contract below are required. No demo result is treated as authentication. Enforcement defaults off to preserve the existing attendance flow during setup. Once enabled, verification failures or missing configuration block attendance.

1. Configure the app's existing MongoDB, authentication and R2 photo storage settings.
2. Choose providers that support hosted live face verification and Aadhaar OTP identity verification. Obtain their accounts and credentials through their onboarding process.
3. Deploy a private server adapter for those providers. It must obtain results directly from provider APIs, enforce liveness and face-match thresholds, verify the Aadhaar identity against `expectedAadhaarNumber`, collect consent, and bind results to the supplied `subject` and `sessionId`. Do not implement the adapter by echoing browser claims.
4. Copy `.env.identity.example` into the app's existing environment configuration, replacing the placeholder URLs and API key. The key stays on the server. The endpoint must use HTTPS; redirects are rejected. Set `IDENTITY_HOSTED_ORIGINS` to a comma-separated list of exact approved HTTPS origins.
5. Test using provider sandbox identities and a staging database, then turn on `FACE_ATTENDANCE_REQUIRED=true` and/or `AADHAAR_ATTENDANCE_REQUIRED=true` and restart the app.

The adapter receives the enrolled photo URL for face verification, or the already-enrolled Aadhaar number for identity matching, over the private authenticated server connection. It must not log these payloads. Camera access, OTP input and liveness capture happen in the provider screen. Existing enrollment/photo storage behavior is otherwise retained.

## Adapter contract

Both calls are HTTPS POSTs with `Authorization: Bearer <IDENTITY_PROVIDER_API_KEY>` and JSON. They must complete within 15 seconds. Return non-2xx for provider errors. Never include sensitive raw provider responses in browser-facing errors.

### `POST /sessions/start`

Face request:

```json
{"sessionId":"app-generated-uuid","subject":"ss-123","kind":"face","referencePhotoUrl":"https://photos.example.com/profiles/photo.jpg","requireLiveness":true}
```

Aadhaar request includes `kind: "aadhaar"`, `authenticationMethod: "aadhaar_otp"`, `requireConsent: true` and `expectedAadhaarNumber` from the employee record instead of the face-specific fields. Do not return this number in responses.

Response:

```json
{"providerSessionId":"provider-generated-id","url":"https://verify.your-provider.example.com/session/opaque-id"}
```

The adapter must bind these IDs before returning a URL. Hosted sessions must expire within five minutes. Require actual user consent in the hosted service. The application checkbox is an additional disclosure, not a substitute for provider consent evidence.

### `POST /sessions/check`

Request:

```json
{"providerSessionId":"provider-generated-id","sessionId":"app-generated-uuid","subject":"ss-123","kind":"face"}
```

Verified face response, only after checking the provider server-side:

```json
{"sessionId":"app-generated-uuid","subject":"ss-123","status":"verified","livenessPassed":true,"faceMatched":true}
```

Verified Aadhaar response:

```json
{"sessionId":"app-generated-uuid","subject":"ss-123","status":"verified","authenticationMethod":"aadhaar_otp","consentRecorded":true,"identityMatched":true}
```

Pending, mismatched, expired and failed outcomes must never return verified flags. The app rejects mismatched session/subject values, missing flags and non-boolean truthy values. Sessions expire in five minutes with MongoDB TTL cleanup; expiry is also checked on every read. Session creation is limited to five attempts per employee/kind/minute. Apply request-rate protection at the adapter as well.

## Staging acceptance checks

- Employee can punch with existing GPS behavior while enforcement is off.
- Each enabled gate rejects direct attendance requests without verification.
- Failed liveness, wrong face, wrong Aadhaar, missing consent, expired proof and replayed proof are rejected.
- One employee cannot check or use another employee/account's verification session.
- Updating a photo invalidates prior face sessions. Updating Aadhaar clears verified status and invalidates pending Aadhaar sessions.
- Denied camera/location, closed provider tabs, provider downtime and timeouts show recoverable errors.
- Verify both in/out punches and an overnight shift with GPS/geofence enforcement.

Automated checks can validate application decisions with synthetic provider responses. A live end-to-end test requires provider sandbox credentials and a staging database; it has not been performed without those services.
