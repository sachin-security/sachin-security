# AWS employee face punching — activation

## Implemented flow

Existing HRMS login → face-data notice and explicit consent → camera permission → AWS live face challenge → server-side comparison with enrollment photo → GPS/site checks → employee submits attendance. Every punch requires a new short-lived proof. Failed liveness, mismatched or multiple faces, withdrawal, expiry and replay are rejected. HR must provide manual attendance review for refusal, accessibility problems or failed checks.

Uses `CreateFaceLivenessSession`, `GetFaceLivenessSessionResults`, `DetectFaces`, `CompareFaces`, and a restricted STS streaming role. No searchable face collection or face template is created. Enrollment images are read only from validated `profiles/` keys in the existing R2 bucket. Older photo records may need a re-upload. The browser cannot create/read sessions, compare faces, access R2 or administer AWS.

## Account, permissions and charges

You need your own AWS account, billing setup, a supported Rekognition region and restricted credentials. AWS charges for liveness checks and image API usage; this is not an offline recognition licence. No AWS accounts, cloud resources, subscriptions or live face checks were created during code preparation.

Create a dedicated backend principal (never root/admin keys). Create an IAM browser role trusted only by that backend principal. Replace placeholders in the policies below. Credentials are issued once per signed-in employee's unexpired, unrevoked consent session. The STS credentials last 15 minutes; AWS liveness sessions expire after three minutes. Streaming requires the wildcard resource shown in AWS's documentation; do not broaden the actions.

Backend policy:

```json
{"Version":"2012-10-17","Statement":[
  {"Effect":"Allow","Action":["rekognition:CreateFaceLivenessSession","rekognition:GetFaceLivenessSessionResults","rekognition:DetectFaces","rekognition:CompareFaces"],"Resource":"*","Condition":{"StringEquals":{"aws:RequestedRegion":"CHOSEN_REGION"}}},
  {"Effect":"Allow","Action":"sts:AssumeRole","Resource":"arn:aws:iam::ACCOUNT_ID:role/HRMSFaceStreaming"}
]}
```

Browser role trust:

```json
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":"BACKEND_PRINCIPAL_ARN"},"Action":"sts:AssumeRole"}]}
```

Browser role permissions:

```json
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"rekognition:StartFaceLivenessSession","Resource":"*","Condition":{"StringEquals":{"aws:RequestedRegion":"CHOSEN_REGION"}}}]}
```

## Privacy and withdrawal

Before activation, approve the processor agreement, supported AWS region/international transfer implications, actual retention notice, privacy/grievance contact, consent-evidence retention, and manual HR review path. Apply and verify AWS's AI services data-use opt-out for the relevant account/organisation and all used Rekognition APIs. An application flag is not a service-level opt-out. `FACE_AWS_DATA_USE_REVIEWED=true` records operator acknowledgement, not an automated legal audit.

The app sets `AuditImagesLimit:0`, specifies no S3 output, and handles reference-image bytes only in server memory. It does not save live captures/templates to MongoDB/R2. AWS documents that the session expires after three minutes and associated liveness data becomes unavailable through the service. This is not proof of immediate erasure or an exemption from AWS data-use terms.

AWS has no per-session cancel/delete API. Withdrawal immediately revokes the HRMS proof and unmounts the camera UI. Active camera components check consent status every three seconds and stop on withdrawal, expiry or a status-check failure. Already issued STS credentials cannot be individually revoked here; they cannot create sessions but may stream to a known pre-created session until it expires. If immediate provable remote cancellation/deletion is required, do not enable this backend; choose another provider. Provider stop/deletion stays pending in the consent record rather than being falsely confirmed. HR must manage processor follow-up and erasure/retention requests.

Employee consent, camera permission, existing enrollment-photo retention and attendance retention are separate. Past attendance is not automatically deleted by withdrawal. These controls support a consent-led design; full DPDP compliance depends on the employer's legal basis and operating practices.

## Netlify configuration

First use a staging deployment/database. Store credentials as Netlify secrets, never `NEXT_PUBLIC_*`, GitHub source or chat. AWS backend keys are separate from R2's S3-compatible keys.

```env
FACE_VERIFICATION_PROVIDER=aws
FACE_AWS_REGION=CHOSEN_REGION
FACE_AWS_ACCESS_KEY_ID=BACKEND_KEY_ID
FACE_AWS_SECRET_ACCESS_KEY=BACKEND_SECRET
FACE_AWS_BROWSER_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/HRMSFaceStreaming
FACE_AWS_DATA_USE_REVIEWED=false
FACE_AWS_LIVENESS_THRESHOLD=95
FACE_AWS_MATCH_THRESHOLD=99
FACE_PROVIDER_NAME=Amazon Web Services — Amazon Rekognition
FACE_RETENTION_NOTICE=REPLACE_WITH_APPROVED_ACTUAL_RETENTION_NOTICE
FACE_PRIVACY_CONTACT_EMAIL=REPLACE_WITH_REAL_PRIVACY_CONTACT
FACE_CONSENT_RETENTION_DAYS=REPLACE_WITH_APPROVED_DAYS
FACE_ATTENDANCE_REQUIRED=false
```

Optional `FACE_AWS_SESSION_TOKEN` supports temporary backend credentials. After the account/data-use review, set `FACE_AWS_DATA_USE_REVIEWED=true`. After acceptance tests, enable `FACE_ATTENDANCE_REQUIRED=true` and redeploy. AWS face verification needs no generic `IDENTITY_PROVIDER_URL`. Aadhaar retains its independent hosted-provider setup.

Defaults are liveness confidence 95 and match similarity 99 out of 100, with configuration restricted to 90–100. Validate these thresholds on consenting representative test users/devices; they are not accuracy guarantees or a basis for automatic disciplinary decisions.

## Acceptance tests before enabling

Test consent refusal, camera denial/cancellation, a matching enrolled employee, another employee, photo/video spoof attempts, multiple/no enrolled faces, lighting, GPS/site rejection, expired/replayed/cross-account proofs, withdrawal during capture and after verification, AWS/R2 outages and overnight shifts. Verify that temporary credentials cannot Create/Get/Compare/Detect or access storage. Confirm the published notice matches effective AWS settings. Do not test real employee faces before authorisation and consent.

Automated tests use synthetic responses, not an AWS account. Live camera, AWS permissions and provider retention/data-use checks remain pending until an account is configured.

## Official references

- [AWS prerequisites](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness-prerequisites.html)
- [AWS pricing](https://aws.amazon.com/rekognition/pricing/)
- [Amplify custom credentials provider](https://ui.docs.amplify.aws/react/connected-components/liveness?platform=javascript)
- [Session expiry](https://docs.aws.amazon.com/cli/latest/reference/rekognition/create-face-liveness-session.html)
- [Data use and encryption](https://docs.aws.amazon.com/rekognition/latest/dg/security-data-encryption.html)
