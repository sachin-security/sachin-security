const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
function load(file, mocks = {}) {
  const filename = path.resolve(__dirname, '..', file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const mod = new Module(filename, module); mod.filename = filename; mod.paths = module.paths;
  const original = mod.require.bind(mod);
  mod.require = name => Object.hasOwn(mocks, name) ? mocks[name] : name === '@/app/lib/guardOperations' ? load('app/lib/guardOperations.ts') : name === '@/app/lib/attendance' ? { istDateString: () => '2026-10-21' } : original(name);
  mod._compile(compiled, filename); return mod.exports;
}
const rules = load('app/lib/guardOperations.ts');
const user = { id: 'user-1', employeeId: 'ss-1', role: 'employee' };
const request = (method, body, url = 'https://hrms.example.com/api/guard-operations', origin = 'https://hrms.example.com') => new Request(url, { method, headers: { origin, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
function mocks(who, db) { return { '@/app/lib/apiAuth': { getSessionUser: async () => who }, '@/app/lib/db': db || { getCollection: async () => { throw new Error('Database must not be accessed'); } }, '@/app/lib/mongodb': { __esModule: true, default: async () => { throw new Error('Client must not be accessed'); } }, '@/app/lib/settingsServer': { getCompanySettings: async () => ({ companyName: 'Test company', phone: '+911234567890', email: 'hr@example.com' }) } }; }
test('duty validation handles IST overnight times and rejects invalid dates, oversized and unsafe inputs', () => {
  const duty = rules.dutyTimes('2026-10-21', '20:00', '08:00');
  assert.equal(duty.startsAt.toISOString(), '2026-10-21T14:30:00.000Z'); assert.equal(duty.endsAt.toISOString(), '2026-10-22T02:30:00.000Z');
  for (const date of ['2026-02-30', '2026-13-01', 'invalid']) assert.throws(() => rules.dutyTimes(date, '08:00', '20:00'));
  assert.throws(() => rules.dutyTimes('2026-10-21', '08:00', '08:00'));
  assert.throws(() => rules.dutyTimes('2026-10-21', '24:00', '08:00'));
  assert.throws(() => rules.guardText({ $ne: null }, 100, 'employee', true));
  assert.equal(rules.phoneHref('javascript:alert(1)'), null);
  assert.equal(rules.phoneHref('+91 12345 67890'), 'tel:+911234567890');
});
test('employees and managers cannot view all duties, assign, cancel, read all reports or respond to reports', async () => {
  for (const role of ['employee', 'manager']) {
    const own = { ...user, role };
    const duty = load('app/api/guard-operations/route.ts', mocks(own));
    const incidents = load('app/api/guard-incidents/route.ts', mocks(own));
    assert.equal((await duty.GET(request('GET', null, 'https://hrms.example.com/api/guard-operations?scope=all'))).status, 403);
    assert.equal((await duty.POST(request('POST', {}))).status, 403);
    assert.equal((await duty.PATCH(request('PATCH', { id: 'x', action: 'cancel' }))).status, 403);
    assert.equal((await incidents.GET(request('GET', null, 'https://hrms.example.com/api/guard-incidents?scope=all'))).status, 403);
    assert.equal((await incidents.PATCH(request('PATCH', { id: 'x', status: 'Resolved' }))).status, 403);
  }
});
test('all operations reject unauthenticated users and staff writes reject foreign origins', async () => {
  for (const file of ['app/api/guard-operations/route.ts', 'app/api/guard-incidents/route.ts']) {
    const unauth = load(file, mocks(null));
    for (const method of ['GET', 'POST', 'PATCH']) assert.equal((await unauth[method](request(method, method === 'GET' ? null : {}))).status, 401);
    const staff = load(file, mocks({ ...user, role: 'hr' }));
    for (const method of ['POST', 'PATCH']) assert.equal((await staff[method](request(method, {}, undefined, 'https://attacker.example.com'))).status, 403);
  }
});
test('guard report ignores forged employee, site and approval fields and writes only their saved employee identity', async () => {
  let inserted, lookup;
  const reports = { createIndex: async () => {}, findOne: async () => null, countDocuments: async () => 0, insertOne: async value => { inserted = value; } };
  const route = load('app/api/guard-incidents/route.ts', mocks(user, { getCollection: async name => name === 'employees' ? { findOne: async filter => { lookup = filter; return { fullName: 'Synthetic guard', workLocation: 'Test site' }; } } : reports }));
  const res = await route.POST(request('POST', { title: 'Test issue', details: 'Synthetic test only', priority: 'Routine', requestId: '11111111-1111-4111-8111-111111111111', employeeId: 'ss-2', workLocation: 'Forged site', status: 'Resolved', response: 'Forged approval' }));
  assert.equal(res.status, 200); assert.equal(lookup.employeeId, 'ss-1'); assert.equal(inserted.employeeId, 'ss-1'); assert.equal(inserted.workLocation, 'Test site'); assert.equal(inserted.status, 'Open'); assert.equal(inserted.response, '');
});
test('guard report listing stays scoped to signed-in employee despite forged filters', async () => {
  let filter;
  const cursor = { sort: () => cursor, skip: () => cursor, limit: () => cursor, toArray: async () => [] };
  const route = load('app/api/guard-incidents/route.ts', mocks(user, { getCollection: async () => ({ find: query => { filter = query; return cursor; }, countDocuments: async () => 0 }) }));
  const res = await route.GET(request('GET', null, 'https://hrms.example.com/api/guard-incidents?employeeId=ss-2'));
  assert.equal(res.status, 200); assert.equal(filter.employeeId, 'ss-1');
});
test('duty scheduling locks the existing employee and rejects overnight conflicts in a transaction', async () => {
  let inserted = false, lock = false, ended = false;
  const session = { withTransaction: async action => action(), endSession: async () => { ended = true; } };
  const db = { collection: name => name === 'employees' ? { findOneAndUpdate: async (_filter, update, options) => { assert.equal(options.session, session); assert.equal(update.$inc.guardRosterVersion, 1); lock = true; return { fullName: 'Test guard', workLocation: 'Existing site' }; } } : { createIndex: async () => {}, findOne: async (filter, options) => { assert.equal(lock, true); assert.equal(options.session, session); assert.ok(filter.startsAt.$lt instanceof Date); assert.ok(filter.endsAt.$gt instanceof Date); return { id: 'overlap' }; }, insertOne: async () => { inserted = true; } } };
  const dependencies = mocks({ ...user, role: 'hr' }, { getDatabase: async () => db });
  dependencies['@/app/lib/mongodb'] = { __esModule: true, default: async () => ({ startSession: () => session }) };
  const route = load('app/api/guard-operations/route.ts', dependencies);
  const res = await route.POST(request('POST', { employeeId: 'ss-1', date: '2026-10-21', start: '20:00', end: '08:00', workLocation: 'Forged site' }));
  assert.equal(res.status, 400); assert.equal(inserted, false); assert.equal(ended, true);
});

test('guard duty read uses only signed-in profile and returns the existing company contact', async () => {
  let employeeFilter, dutyFilter;
  const cursor = { sort: () => cursor, limit: () => cursor, toArray: async () => [] };
  const route = load('app/api/guard-operations/route.ts', mocks(user, { getCollection: async name => name === 'employees' ? { findOne: async filter => { employeeFilter = filter; return { employeeId: 'ss-1', workLocation: 'Existing site', fullName: 'Test guard' }; } } : { find: filter => { dutyFilter = filter; return cursor; } } }));
  const res = await route.GET(request('GET', null, 'https://hrms.example.com/api/guard-operations?employeeId=ss-2'));
  const data = await res.json(); assert.equal(res.status, 200); assert.equal(employeeFilter.employeeId, 'ss-1'); assert.equal(dutyFilter.employeeId, 'ss-1'); assert.equal(data.data.company.phone, '+911234567890');
});
test('staff scheduling uses the existing site rather than accepting a forged site from the browser', async () => {
  let inserted;
  const session = { withTransaction: async action => action(), endSession: async () => {} };
  const db = { collection: name => name === 'employees' ? { findOneAndUpdate: async () => ({ fullName: 'Test guard', workLocation: 'Existing site' }) } : { createIndex: async () => {}, findOne: async () => null, insertOne: async value => { inserted = value; } } };
  const dependencies = mocks({ ...user, role: 'admin' }, { getDatabase: async () => db });
  dependencies['@/app/lib/mongodb'] = { __esModule: true, default: async () => ({ startSession: () => session }) };
  const route = load('app/api/guard-operations/route.ts', dependencies);
  const res = await route.POST(request('POST', { employeeId: 'ss-1', date: '2026-10-21', start: '08:00', end: '20:00', workLocation: 'Forged site', fullName: 'Forged name' }));
  assert.equal(res.status, 200); assert.equal(inserted.workLocation, 'Existing site'); assert.equal(inserted.fullName, 'Test guard'); assert.equal(inserted.createdBy, 'user-1');
});
test('employee directory and enrollment cannot be accessed by ordinary guard accounts', async () => {
  const route = load('app/api/employees/route.ts', { '@/app/lib/apiAuth': { requirePermission: async () => ({ ok: false, status: 403, error: 'Forbidden' }) }, '@/app/lib/db': { getCollection: async () => { throw new Error('Must not reach directory'); } }, '@/app/lib/idcrypto': { encryptId: () => '' }, '@/app/lib/users': { createEmployeeUser: async () => {} }, '@/app/lib/employeeFields': {} });
  assert.equal((await route.GET(request('GET'))).status, 403);
  assert.equal((await route.POST(request('POST', {}))).status, 403);
});
