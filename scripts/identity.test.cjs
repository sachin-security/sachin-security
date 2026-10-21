const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
process.env.FACE_PROVIDER_NAME = 'Test processor';
process.env.FACE_RETENTION_NOTICE = 'Synthetic test retention notice';
process.env.FACE_PRIVACY_CONTACT_EMAIL = 'privacy@example.com';
process.env.FACE_CONSENT_RETENTION_DAYS = '90';

// Execute the actual TypeScript modules with isolated service/database doubles.
function load(file, mocks = {}) {
  const filename = path.resolve(__dirname, '..', file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = module.paths;
  const original = mod.require.bind(mod);
  mod.require = name => Object.hasOwn(mocks, name) ? mocks[name] : name === '@/app/lib/facePrivacy' ? load('app/lib/facePrivacy.ts') : name === '@/app/lib/awsFacePolicy' ? load('app/lib/awsFacePolicy.ts') : original(name);
  mod._compile(compiled, filename);
  return mod.exports;
}
const policy = load('app/lib/identityPolicy.ts');
const face = { status: 'verified', subject: 'ss-1', sessionId: 'one', livenessPassed: true, faceMatched: true };
test('face requires both matching and liveness with exact subject and session', () => {
  assert.equal(policy.verifiedResult('face', face, 'ss-1', 'one'), true);
  for (const change of [{ subject: 'ss-2' }, { sessionId: 'two' }, { status: 'pending' }, { livenessPassed: false }, { faceMatched: false }, { livenessPassed: 'true' }]) {
    assert.equal(policy.verifiedResult('face', { ...face, ...change }, 'ss-1', 'one'), false);
  }
});
test('Aadhaar requires OTP, consent and enrollment identity match', () => {
  const result = { status: 'verified', subject: 'ss-1', sessionId: 'one', authenticationMethod: 'aadhaar_otp', consentRecorded: true, identityMatched: true };
  assert.equal(policy.verifiedResult('aadhaar', result, 'ss-1', 'one'), true);
  for (const change of [{ authenticationMethod: 'document' }, { consentRecorded: false }, { identityMatched: false }]) {
    assert.equal(policy.verifiedResult('aadhaar', { ...result, ...change }, 'ss-1', 'one'), false);
  }
});
test('hosted URL accepts only exact approved HTTPS origins', () => {
  process.env.IDENTITY_HOSTED_ORIGINS = 'https://verify.example.com';
  assert.equal(policy.verificationUrl('https://verify.example.com/session/one'), 'https://verify.example.com/session/one');
  for (const url of ['http://verify.example.com', 'https://verify.example.com.attacker.test', 'javascript:alert(1)', 'https://user:pass@verify.example.com', '//verify.example.com', null]) {
    assert.throws(() => policy.verificationUrl(url));
  }
});

function clockFixture(proofFound = true) {
  let claimed = false;
  let writes = 0;
  let claimFilter;
  const employee = { profileUrl: 'https://photos.example.com/one.jpg', workLocation: '', aadhaarVerification: { verifiedAt: new Date() } };
  const collections = {
    employees: { findOne: async () => employee },
    identitySessions: { findOneAndUpdate: async filter => {
      claimFilter = filter;
      if (claimed || !proofFound) return null;
      claimed = true; return { id: 'one' };
    } },
    attendance: { findOne: async () => null, updateOne: async () => { writes++; } },
  };
  const route = load('app/api/attendance/clock/route.ts', {
    '@/app/lib/apiAuth': { requirePermission: async () => ({ ok: true, user: { id: 'account-1', employeeId: 'ss-1' } }) },
    '@/app/lib/db': { getCollection: async name => collections[name] },
    '@/app/lib/identityPolicy': policy,
    '@/app/lib/attendance': load('app/lib/attendance.ts'),
  });
  return { route, employee, writes: () => writes, filter: () => claimFilter };
}
const punchRequest = extra => new Request('https://hrms.example.com/api/attendance/clock', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'in', lat: 20, lng: 72, ...extra }),
});
test('face enforcement rejects missing and replayed proof; proof is account/photo/expiry bound', async () => {
  process.env.FACE_ATTENDANCE_REQUIRED = 'true';
  process.env.AADHAAR_ATTENDANCE_REQUIRED = 'false';
  const f = clockFixture();
  assert.equal((await f.route.POST(punchRequest({}))).status, 403);
  assert.equal(f.writes(), 0);
  assert.equal((await f.route.POST(punchRequest({ faceVerificationId: 'one' }))).status, 200);
  assert.equal(f.writes(), 1);
  assert.equal((await f.route.POST(punchRequest({ faceVerificationId: 'one' }))).status, 403);
  assert.equal(f.writes(), 1);
  const filter = f.filter();
  assert.equal(filter.employeeId, 'ss-1');
  assert.equal(filter.userId, 'account-1');
  assert.equal(filter.photoVersion, policy.photoVersion(f.employee.profileUrl));
  assert.equal(filter.status, 'verified');
  assert.ok(filter.expiresAt.$gt instanceof Date);
  assert.deepEqual(filter.consumedAt, { $exists: false });
  assert.deepEqual(filter.revokedAt, { $exists: false });
  assert.equal(filter.consentVersion, load('app/lib/facePrivacy.ts').getFacePrivacyNotice().version);
});

test('face consent is explicit, bound to the current notice, and required before any data access', async () => {
  const privacy = load('app/lib/facePrivacy.ts');
  const notice = privacy.getFacePrivacyNotice();
  assert.equal(privacy.acceptsFaceNotice({ accepted: true, noticeVersion: notice.version }, notice), true);
  for (const consent of [undefined, { accepted: false, noticeVersion: notice.version }, { accepted: 'true', noticeVersion: notice.version }, { accepted: true, noticeVersion: 'old-version' }]) {
    assert.equal(privacy.acceptsFaceNotice(consent, notice), false);
  }
  assert.equal(privacy.acceptsFaceNotice({ accepted: true, noticeVersion: notice.version }, null), false);
  let serviceCalls = 0;
  const route = load('app/api/identity/route.ts', {
    '@/app/lib/apiAuth': { requirePermission: async () => ({ ok: true, user: { id: 'account-1', employeeId: 'ss-1' } }) },
    '@/app/lib/db': { getCollection: async () => { serviceCalls++; throw new Error('No database call should occur'); } },
    '@/app/lib/identityPolicy': policy,
    '@/app/lib/identityProvider': { identityProvider: async () => { serviceCalls++; } },
  });
  const res = await route.POST(new Request('https://hrms.example.com/api/identity', {
    method: 'POST', headers: { origin: 'https://hrms.example.com', 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'start', kind: 'face' }),
  }));
  assert.equal(res.status, 403); assert.equal(serviceCalls, 0);
});

test('changing processor or retention invalidates earlier face consent', () => {
  const privacy = load('app/lib/facePrivacy.ts');
  const first = privacy.getFacePrivacyNotice();
  const previous = process.env.FACE_RETENTION_NOTICE;
  process.env.FACE_RETENTION_NOTICE = 'Changed retention policy';
  const changed = privacy.getFacePrivacyNotice();
  assert.notEqual(first.version, changed.version);
  assert.equal(privacy.acceptsFaceNotice({ accepted: true, noticeVersion: first.version }, changed), false);
  process.env.FACE_RETENTION_NOTICE = previous;
});

test('withdrawal revokes the face proof before contacting an unavailable processor', async () => {
  const events = [];
  const receipt = { _id: 'receipt-1', id: 'one', providerSessionId: 'provider-one' };
  const route = load('app/api/identity/route.ts', {
    '@/app/lib/apiAuth': { requirePermission: async () => ({ ok: true, user: { id: 'account-1', employeeId: 'ss-1' } }) },
    '@/app/lib/db': { getCollection: async name => ({
      findOne: async () => name === 'employees' ? { employeeId: 'ss-1' } : receipt,
      createIndex: async () => {},
      updateOne: async (_filter, update) => { events.push({ name, update }); return { matchedCount: 1 }; },
    }) },
    '@/app/lib/identityPolicy': policy,
    '@/app/lib/identityProvider': { identityProvider: async () => { events.push({ name: 'provider' }); throw new Error('Unavailable'); } },
  });
  const response = await route.POST(new Request('https://hrms.example.com/api/identity', {
    method: 'POST', headers: { origin: 'https://hrms.example.com', 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'withdraw', kind: 'face', id: 'one' }),
  }));
  assert.equal(response.status, 503);
  assert.equal(events[0].name, 'identitySessions');
  assert.ok(events[0].update.$set.revokedAt instanceof Date);
  assert.equal(events[1].name, 'faceConsentReceipts');
  assert.ok(events[1].update.$set.withdrawnAt instanceof Date);
  assert.equal(events[2].name, 'provider');
});
test('Aadhaar gate blocks unverified employees before attendance writes', async () => {
  process.env.AADHAAR_ATTENDANCE_REQUIRED = 'true';
  const f = clockFixture();
  delete f.employee.aadhaarVerification;
  assert.equal((await f.route.POST(punchRequest({ faceVerificationId: 'one' }))).status, 403);
  assert.equal(f.writes(), 0);
});
test('GPS remains mandatory and legacy attendance works with gates off', async () => {
  process.env.AADHAAR_ATTENDANCE_REQUIRED = 'false';
  process.env.FACE_ATTENDANCE_REQUIRED = 'false';
  const f = clockFixture();
  assert.equal((await f.route.POST(punchRequest({ lat: null }))).status, 400);
  assert.equal((await f.route.POST(punchRequest({}))).status, 200);
  assert.equal(f.writes(), 1);
});

test('identity check rejects another account or expired session before contacting provider', async () => {
  let providerCalls = 0;
  let lookup;
  const route = load('app/api/identity/route.ts', {
    '@/app/lib/apiAuth': { requirePermission: async () => ({ ok: true, user: { id: 'account-1', employeeId: 'ss-1' } }) },
    '@/app/lib/db': { getCollection: async name => name === 'employees' ? {
      findOne: async () => ({ profileUrl: 'https://photos.example.com/one.jpg' }),
    } : { createIndex: async () => {}, findOne: async filter => { lookup = filter; return null; } } },
    '@/app/lib/identityPolicy': policy,
    '@/app/lib/identityProvider': { identityProvider: async () => { providerCalls++; } },
  });
  const request = () => new Request('https://hrms.example.com/api/identity', {
    method: 'POST', headers: { origin: 'https://hrms.example.com', 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'check', kind: 'face', id: 'someone-elses-session' }),
  });
  assert.equal((await route.POST(request())).status, 400);
  assert.equal(providerCalls, 0);
  assert.equal(lookup.employeeId, 'ss-1');
  assert.equal(lookup.userId, 'account-1');
  assert.ok(lookup.expiresAt.$gt instanceof Date);
  const forgedOrigin = new Request('https://hrms.example.com/api/identity', {
    method: 'POST', headers: { origin: 'https://attacker.example.com', 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'start', kind: 'face' }),
  });
  assert.equal((await route.POST(forgedOrigin)).status, 403);
});

test('employee edits cannot forge verification and changing Aadhaar clears status', async () => {
  let update;
  const fields = load('app/lib/employeeFields.ts');
  const route = load('app/api/employees/[employeeId]/route.ts', {
    '@/app/lib/apiAuth': { requirePermission: async () => ({ ok: true, user: { id: 'hr' } }) },
    '@/app/lib/db': { getCollection: async () => ({ findOne: async () => ({ aadharNumber: 'old' }),
      updateOne: async (_filter, value) => { update = value; return { matchedCount: 1 }; } }) },
    '@/app/lib/employeeFields': fields,
  });
  const response = await route.PUT(new Request('https://hrms.example.com/api/employees/ss-1', {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aadharNumber: 'changed', aadhaarVerification: { verifiedAt: 'fake' }, 'aadhaarVerification.verifiedAt': 'fake', profileUrl: 'https://photos.example.com/new.jpg' }),
  }), { params: Promise.resolve({ employeeId: 'ss-1' }) });
  assert.equal(response.status, 200);
  assert.equal(update.$set.aadhaarVerification, undefined);
  assert.equal(update.$set['aadhaarVerification.verifiedAt'], undefined);
  assert.deepEqual(update.$unset, { aadhaarVerification: '' });
  assert.equal(update.$set.profileUrl, 'https://photos.example.com/new.jpg');
});

function awsFixture(overrides = {}) {
  const calls = [];
  const sessionId = '11111111-1111-4111-8111-111111111111';
  class Rekognition {
    async send(command) {
      const name = command.constructor.name;
      calls.push({ name, input: command.input });
      if (Object.hasOwn(overrides, name)) return overrides[name];
      if (name === 'CreateFaceLivenessSessionCommand') return { SessionId: sessionId };
      if (name === 'GetFaceLivenessSessionResultsCommand') return { SessionId: sessionId, Status: 'SUCCEEDED', Confidence: 99, ReferenceImage: { Bytes: new Uint8Array([1]) } };
      if (name === 'DetectFacesCommand') return { FaceDetails: [{}] };
      if (name === 'CompareFacesCommand') return { FaceMatches: [{ Similarity: 99.8 }], UnmatchedFaces: [] };
    }
  }
  const sdk = require('@aws-sdk/client-rekognition');
  const mod = load('app/lib/awsFace.ts', {
    '@aws-sdk/client-rekognition': { ...sdk, RekognitionClient: Rekognition },
    '@/app/lib/r2': { getR2Object: async key => { calls.push({ name: 'R2', key }); return { bytes: new Uint8Array([2]) }; } },
  });
  return { mod, calls, sessionId };
}
function setupAwsTestEnv() {
  process.env.FACE_VERIFICATION_PROVIDER = 'aws';
  process.env.FACE_AWS_DATA_USE_REVIEWED = 'true';
  process.env.FACE_AWS_REGION = 'test-region';
  process.env.FACE_AWS_ACCESS_KEY_ID = 'synthetic-key';
  process.env.FACE_AWS_SECRET_ACCESS_KEY = 'synthetic-secret';
  process.env.FACE_AWS_BROWSER_ROLE_ARN = 'arn:aws:iam::123456789012:role/Test';
}
test('AWS creates no audit-image or S3 output and refuses arbitrary reference URLs/keys', async () => {
  setupAwsTestEnv();
  const f = awsFixture();
  const result = await f.mod.awsFaceProvider('sessions/start', { sessionId: 'app-id', referencePhotoKey: 'profiles/enrolled-1.jpg' });
  assert.equal(result.captureMode, 'aws');
  assert.equal(f.calls[0].input.Settings.AuditImagesLimit, 0);
  assert.equal(f.calls[0].input.Settings.OutputConfig, undefined);
  for (const key of ['https://internal.test/photo.jpg', '../secret.jpg', 'documents/private.png']) {
    await assert.rejects(() => f.mod.awsFaceProvider('sessions/start', { sessionId: 'app-id', referencePhotoKey: key }));
  }
  assert.equal(f.calls.length, 1);
});
test('AWS validates liveness and enrolled face on the server', async () => {
  setupAwsTestEnv();
  const f = awsFixture();
  const result = await f.mod.awsFaceProvider('sessions/check', { sessionId: 'app-id', subject: 'ss-1', providerSessionId: f.sessionId, referencePhotoKey: 'profiles/enrolled-1.jpg' });
  assert.equal(result.status, 'verified');
  assert.equal(result.faceMatched, true);
  assert.deepEqual(f.calls.map(x => x.name), ['GetFaceLivenessSessionResultsCommand', 'R2', 'DetectFacesCommand', 'CompareFacesCommand']);
  const compare = f.calls[3].input;
  assert.deepEqual(compare.SourceImage.Bytes, new Uint8Array([2]));
  assert.deepEqual(compare.TargetImage.Bytes, new Uint8Array([1]));
});
test('AWS rejects failed/low liveness without reading enrollment and rejects wrong or multiple faces', async () => {
  setupAwsTestEnv();
  for (const response of [{ Status: 'FAILED', Confidence: 100 }, { Status: 'SUCCEEDED', Confidence: 94 }]) {
    const f = awsFixture({ GetFaceLivenessSessionResultsCommand: { ...response, SessionId: '11111111-1111-4111-8111-111111111111', ReferenceImage: { Bytes: new Uint8Array([1]) } } });
    const r = await f.mod.awsFaceProvider('sessions/check', { sessionId: 'app-id', providerSessionId: f.sessionId, referencePhotoKey: 'profiles/enrolled-1.jpg' });
    assert.equal(r.status, 'failed'); assert.equal(f.calls.length, 1);
  }
  const wrong = awsFixture({ CompareFacesCommand: { FaceMatches: [], UnmatchedFaces: [{}] } });
  assert.equal((await wrong.mod.awsFaceProvider('sessions/check', { sessionId: 'app-id', providerSessionId: wrong.sessionId, referencePhotoKey: 'profiles/enrolled-1.jpg' })).faceMatched, false);
  const multiple = awsFixture({ DetectFacesCommand: { FaceDetails: [{}, {}] } });
  assert.equal((await multiple.mod.awsFaceProvider('sessions/check', { sessionId: 'app-id', providerSessionId: multiple.sessionId, referencePhotoKey: 'profiles/enrolled-1.jpg' })).reason, 'enrollment_face_invalid');
});
test('AWS withdrawal never claims unavailable remote deletion and thresholds fail closed', async () => {
  setupAwsTestEnv();
  const f = awsFixture();
  assert.deepEqual(await f.mod.awsFaceProvider('sessions/withdraw', {}), { processingStopped: false, deletionCompleted: false });
  assert.equal(f.calls.length, 0);
  const p = load('app/lib/awsFacePolicy.ts');
  for (const score of ['NaN', '89', '101', '-1']) assert.throws(() => p.threshold(score, 95));
  assert.equal(p.livenessPassed('SUCCEEDED', '99', 95), false);
  assert.equal(p.livenessPassed('SUCCEEDED', Infinity, 95), false);
  process.env.FACE_AWS_DATA_USE_REVIEWED = 'false';
  assert.equal(p.awsFaceConfigured(), false);
});

test('AWS distinguishes processing, expiry, liveness and mismatch without approving a failed face', async () => {
  setupAwsTestEnv();
  for (const [status, confidence, reason, expectedStatus] of [
    ['CREATED', 99, 'processing', 'pending'], ['IN_PROGRESS', 99, 'processing', 'pending'],
    ['EXPIRED', 99, 'expired', 'failed'], ['FAILED', 99, 'liveness_failed', 'failed'],
    ['SUCCEEDED', 94, 'liveness_failed', 'failed'],
  ]) {
    const f = awsFixture({ GetFaceLivenessSessionResultsCommand: { SessionId: '11111111-1111-4111-8111-111111111111', Status: status, Confidence: confidence } });
    const r = await f.mod.awsFaceProvider('sessions/check', { sessionId: 'app-id', subject: 'ss-1', providerSessionId: f.sessionId, referencePhotoKey: 'profiles/enrolled-1.jpg' });
    assert.equal(r.reason, reason); assert.equal(r.status, expectedStatus);
    assert.equal(policy.verifiedResult('face', r, 'ss-1', 'app-id'), false);
    assert.equal(f.calls.length, 1);
  }
  const f = awsFixture({ CompareFacesCommand: { FaceMatches: [], UnmatchedFaces: [{}] } });
  const r = await f.mod.awsFaceProvider('sessions/check', { sessionId: 'app-id', subject: 'ss-1', providerSessionId: f.sessionId, referencePhotoKey: 'profiles/enrolled-1.jpg' });
  assert.equal(r.reason, 'face_mismatch'); assert.equal(r.livenessPassed, true);
  assert.equal(policy.verifiedResult('face', r, 'ss-1', 'app-id'), false);
});

test('simplified AWS challenge keeps liveness, face matching and no image storage', async () => {
  setupAwsTestEnv();
  const f = awsFixture();
  await f.mod.awsFaceProvider('sessions/start', { sessionId: 'app-id', referencePhotoKey: 'profiles/enrolled-1.jpg' });
  assert.deepEqual(f.calls[0].input.Settings.ChallengePreferences, [{ Type: 'FaceMovementChallenge' }]);
  assert.equal(f.calls[0].input.Settings.AuditImagesLimit, 0);
  assert.equal(f.calls[0].input.Settings.OutputConfig, undefined);
  const low = awsFixture({ GetFaceLivenessSessionResultsCommand: {
    SessionId: f.sessionId, Status: 'SUCCEEDED', Confidence: 94,
    Feedback: [{ Code: 'HIGH_LIGHTING_DETECTED' }], ReferenceImage: { Bytes: new Uint8Array([1]) },
  } });
  const r = await low.mod.awsFaceProvider('sessions/check', { sessionId: 'app-id', subject: 'ss-1', providerSessionId: f.sessionId, referencePhotoKey: 'profiles/enrolled-1.jpg' });
  assert.equal(r.reason, 'lighting_high'); assert.equal(r.livenessPassed, false);
  assert.equal(policy.verifiedResult('face', r, 'ss-1', 'app-id'), false);
  assert.equal(low.calls.length, 1);
});

test('automatic result checking waits only for pending and never approves a failure or cancelled check', async () => {
  const { checkFaceResult } = load('app/lib/faceCheck.ts');
  let calls = 0, waits = 0;
  const id = await checkFaceResult(async () => ++calls < 3 ? { pending: true, error: 'processing' } : { verified: true, id: 'one' }, new AbortController().signal, async () => { waits++; });
  assert.equal(id, 'one'); assert.equal(calls, 3); assert.equal(waits, 2);
  calls = 0;
  await assert.rejects(() => checkFaceResult(async () => { calls++; return { verified: false, error: 'face mismatch' }; }, new AbortController().signal), /face mismatch/);
  assert.equal(calls, 1);
  calls = 0;
  await assert.rejects(() => checkFaceResult(async () => { calls++; return { pending: true }; }, new AbortController().signal, async () => {}), /taking too long/);
  assert.equal(calls, 8);
  const controller = new AbortController();
  await assert.rejects(() => checkFaceResult(async () => { controller.abort(); return { verified: true, id: 'one' }; }, controller.signal));
  const stopped = new AbortController(); stopped.abort(); calls = 0;
  await assert.rejects(() => checkFaceResult(async () => { calls++; return { verified: true, id: 'one' }; }, stopped.signal));
  assert.equal(calls, 0);
});
