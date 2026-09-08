const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const cache = new Map();
let database;
function loadTs(file) {
  file = path.resolve(root, file);
  if (cache.has(file)) return cache.get(file);
  const module = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const localRequire = id => {
    if (id === '@/utils/supabase/server') return { createClient: async () => database };
    if (id.startsWith('@/')) return loadTs(id.slice(2) + '.ts');
    if (id.startsWith('.')) return loadTs(path.resolve(path.dirname(file), id) + '.ts');
    return require(id);
  };
  vm.runInThisContext(`(function(require,module,exports){${output}\n})`, { filename: file })(localRequire, module, module.exports);
  cache.set(file, module.exports);
  return module.exports;
}
const p = loadTs('lib/progress.ts');
const v = loadTs('lib/progress-validation.ts');
const api = loadTs('app/api/progress/route.ts');

test('roadmap completion reports success only after a confirmed database write', async () => {
  const source = fs.readFileSync(path.join(root, 'app/roadmap/page.jsx'), 'utf8');
  const start = source.indexOf('  async function saveTasks(');
  const end = source.indexOf('  async function toggleTaskComplete(', start);
  assert.ok(start >= 0 && end > start);
  const month = { id: 'month-a', user_id: 'student-a', tasks: [{ completed: false }] };
  const updated = [{ completed: true }];
  for (const outcome of [null, { data: false, error: null }, { data: null, error: { code: 'denied' } }, { data: true, error: null }]) {
    let rows = structuredClone([month]);
    let message = '';
    const client = { rpc: async (name, args) => {
      assert.equal(name, 'save_roadmap_tasks_if_current');
      assert.equal(args.p_month_id, month.id);
      assert.equal(args.p_owner_id, month.user_id);
      assert.deepEqual(args.p_expected_tasks, month.tasks);
      assert.deepEqual(args.p_tasks, updated);
      assert.deepEqual(rows, [month], 'UI must wait for the database');
      if (!outcome) throw new Error('Offline');
      return outcome;
    } };
    const context = vm.createContext({ supabase: client, setRoadmapData: update => { rows = update(rows); }, setErrorMessage: value => { message = value; } });
    vm.runInContext(source.slice(start, end), context);
    const success = await context.saveTasks(month, updated);
    assert.equal(success, outcome?.data === true);
    assert.equal(rows[0].tasks[0].completed, success);
    assert.equal(Boolean(message), !success);
  }
});

test('roadmap profile forms reject stale snapshots and changed accounts before writing', async () => {
  const source = fs.readFileSync(path.join(root, 'app/roadmap/page.jsx'), 'utf8');
  const start = source.indexOf('  async function saveProfile(');
  const end = source.indexOf('  // --- Roadmap generation ---', start);
  assert.ok(start >= 0 && end > start);
  const original = { updated_at: '2026-09-07T12:00:00Z', student_context: { progress_v1: { version: 4 } } };
  for (const scenario of [
    { loaded: original, current: { ...original, updated_at: '2026-09-07T12:01:00Z' }, owner: 'a', write: false },
    { loaded: original, current: original, owner: 'b', write: false },
    { loaded: null, current: original, owner: 'a', write: false },
    { loaded: original, current: null, owner: 'a', write: false },
    { loaded: original, current: original, owner: 'a', write: true },
    { loaded: null, current: null, owner: 'a', write: true },
  ]) {
    let written;
    let message = '';
    let loading = false;
    const filters = [];
    const query = {
      select() { return this; },
      eq(key, value) { filters.push([key, value]); return this; },
      is(key, value) { filters.push([key, value]); return this; },
      async maybeSingle() { return { data: scenario.current, error: null }; },
      update(values) { written = values; return this; },
      insert(values) { written = values; return this; },
      async single() { return { data: null, error: null }; },
    };
    const context = vm.createContext({
      supabase: { auth: { getUser: async () => ({ data: { user: { id: scenario.owner } } }) }, from: () => query },
      loadedOwnerId: 'a', userProfile: scenario.loaded, formData: { grade: '9th', interests: 'Art' },
      setLoading: value => { loading = value; }, setErrorMessage: value => { message = value; },
    });
    vm.runInContext(source.slice(start, end), context);
    await context.saveProfile({ preventDefault() {} });
    assert.equal(Boolean(written), scenario.write);
    assert.equal(loading, false);
    if (!scenario.write) assert.match(message, /changed.*Reload/);
    if (scenario.write && scenario.loaded) {
      assert.deepEqual(written.student_context.progress_v1, original.student_context.progress_v1);
      assert.ok(filters.some(([key, value]) => key === 'updated_at' && value === original.updated_at));
    }
  }
});

test('grade plans change without deleting earlier completed work', () => {
  const state = p.initialProgress('8th');
  state.completions['grade:8th:0'] = { title: 'Explore interests', reflection: 'Art and biology', at: '2026-09-07T12:00:00Z' };
  state.grade = '12th';
  assert.ok(p.weeklySteps(state, [], '2026-09-07').some(t => t.title.includes('deadline')));
  assert.ok(state.completions['grade:8th:0']);
});
test('completed weekly plan stays visible; following week offers new work', () => {
  const state = p.initialProgress('9th');
  const steps = p.weeklySteps(state, [], '2026-09-07');
  assert.equal(steps.length, 3);
  for (const t of steps) state.completions[t.id] = { title: t.title, reflection: 'Saved evidence', at: '2026-09-08T12:00:00Z' };
  assert.deepEqual(p.weeklySteps(state, [], '2026-09-09').map(t => t.id), steps.map(t => t.id));
  assert.ok(p.weeklySteps(state, [], '2026-09-14').every(t => !t.completedAt));
  assert.ok(p.weeklySteps(state, [], '2026-09-14').some(t => t.id === 'journal:2026-09-14'));
});
test('15-minute budget, deferred dates, and month/year boundaries', () => {
  const state = p.initialProgress('11th'); state.weeklyMinutes = 15;
  assert.ok(p.weeklySteps(state, [], '2026-09-07').reduce((n,t) => n+t.minutes,0) <= 15);
  const task = p.weeklySteps(state, [], '2026-09-07')[0];
  state.deferred[task.id] = '2026-09-14';
  assert.ok(!p.weeklySteps(state, [], '2026-09-13').some(t => t.id === task.id));
  assert.ok(p.weeklySteps(state, [], '2026-09-14').some(t => t.id === task.id));
  assert.equal(p.plusDays('2026-12-31', 1), '2027-01-01');
  assert.equal(p.weekKey(new Date('2027-01-01T12:00:00')), '2026-12-28');
});
test('roadmap excludes future and skipped work and preserves canonical completion', () => {
  const state = p.initialProgress();
  const roadmap = [{ id: 1, month_key: '2026-09', tasks: [{ title: 'Real task' }, { title: 'Skipped', status: 'skipped' }, { title: 'Old win', completed: true }, { title: 'New win', completed: true, outcome: { recorded_at: '2026-09-08T12:00:00Z', reflection: 'Private' } }] }, { id: 2, month_key: '2026-10', tasks: [{ title: 'Later' }] }];
  const tasks = p.allSteps(state, roadmap, '2026-09-09');
  assert.ok(tasks.some(t => t.title === 'Real task'));
  assert.ok(tasks.find(t => t.title === 'New win').completedAt);
  assert.ok(!tasks.some(t => ['Later', 'Old win', 'Skipped'].includes(t.title)));
});
test('weekly completion uses the student timezone around UTC midnight', () => {
  const state = p.initialProgress();
  state.completions['grade:9th:0'] = { title: 'Clubs', at: '2026-09-08T02:00:00Z', reflection: 'A Monday evening win' };
  assert.ok(p.weeklySteps(state, [], '2026-09-07').find(t => t.id === 'grade:9th:0').completedAt);
  assert.equal(p.dateInZone(new Date('2026-09-08T02:00:00Z'), state.timeZone), '2026-09-07');
});
test('family digest excludes all private details and unselected journal entries', () => {
  const state = p.initialProgress();
  state.completions.x = { title: 'Shared task title', reflection: 'SECRET reflection', at: '2026-09-07T12:00:00Z' };
  state.reviews = [{ at: '2026-09-07T12:00:00Z', grade: '9th', interests: '', weeklyMinutes: 45, challenge: 'SECRET challenge', win: 'SECRET win' }];
  state.organizer.accomplishments = [{ id: 1, title: 'SECRET title', category: 'Activity', date: '2026-09-07', impact: 'SECRET impact', evidence: 'SECRET evidence', shareWithFamily: false }, { id: 2, title: 'Selected highlight', category: 'Activity', date: '2026-09-07', impact: 'SECRET details', evidence: '', shareWithFamily: true }];
  const digest = p.familyDigest(state, [], '2026-09-08');
  assert.ok(digest.includes('Shared task title'));
  assert.ok(digest.includes('Selected highlight'));
  assert.ok(!digest.includes('SECRET'));
});
test('organizer validation rejects unsafe links, duplicate IDs, invalid dates and oversized data', () => {
  const state = p.initialProgress();
  state.organizer.scholarships = [{ id: 1, name: 'Grant', amount: 1, deadline: '2026-09-20', status: 'Considering', url: 'javascript:alert(1)', requirements: '' }];
  assert.throws(() => v.organizer(state.organizer), /links/);
  state.organizer.scholarships[0].url = 'https://example.org';
  state.organizer.scholarships.push({ ...state.organizer.scholarships[0] });
  assert.throws(() => v.organizer(state.organizer), /duplicate/);
  assert.throws(() => v.date('2026-02-30'));
  assert.throws(() => v.number(Infinity));
  assert.throws(() => v.text('x'.repeat(2001)));
  assert.throws(() => v.grade('7th'));
});

// Exercise route authorization, persistence and compare-and-swap against a stateful
// query double. No real accounts, database writes, or third-party requests are used.
function fakeDb({ user = 'student-a', profile = null, failWrite = false, conflict = false } = {}) {
  const store = { profile: structuredClone(profile), queries: [] };
  const db = {
    store, auth: { getUser: async () => ({ data: { user: user ? { id: user } : null } }) },
    from(table) {
      let operation = 'read', values, filters = [];
      const query = {
        select() { return query; }, eq(k,val) { filters.push([k,val]); return query; }, is(k,val) { filters.push([k,val]); return query; }, order() { return query; },
        update(v) { operation='update'; values=v; return query; }, insert(v) { operation='insert'; values=v; return query; },
        maybeSingle() { return query; },
        then(resolve,reject) {
          store.queries.push({ table, operation, filters });
          if (table === 'roadmap_activities') return Promise.resolve({ data: [], error: null }).then(resolve,reject);
          if (operation === 'read') return Promise.resolve({ data: store.profile, error: null }).then(resolve,reject);
          if (failWrite) return Promise.resolve({ data: null, error: { code: 'server_error' } }).then(resolve,reject);
          if (operation === 'insert') {
            for (const field of ['user_id', 'grade', 'location', 'gpa', 'interests', 'target_schools', 'extracurriculars']) {
              assert.notEqual(values[field], undefined, `Production profile requires ${field}`);
              assert.notEqual(values[field], null, `Production profile requires non-null ${field}`);
            }
          }
          if (operation === 'update') {
            assert.ok(filters.some(([k,v]) => k === 'user_id' && v === user));
            const previous = filters.find(([k]) => k === 'updated_at');
            assert.ok(previous, 'write must compare profile timestamp');
            assert.ok(filters.some(([k]) => k.startsWith('student_context->progress_v1')), 'write must compare planner version');
            if (conflict || previous[1] !== (store.profile.updated_at || null)) return Promise.resolve({ data: [], error: null }).then(resolve,reject);
          }
          store.profile = { ...store.profile, ...structuredClone(values) };
          return Promise.resolve({ data: [{ user_id: user }], error: null }).then(resolve,reject);
        },
      }; return query;
    },
  }; return db;
}
function request(body, origin = 'https://clavisprep.com') { return new Request('https://clavisprep.com/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify({ ownerId: 'student-a', ...body }) }); }
const review = { action: 'review', version: 0, grade: '10th', interests: 'Biology', weeklyMinutes: 30, win: '', challenge: '', timeZone: 'America/New_York' };
test('API requires authentication and rejects cross-origin writes', async () => {
  database = fakeDb({ user: null });
  assert.equal((await api.GET()).status, 401);
  assert.equal((await api.POST(request(review))).status, 401);
  assert.equal((await api.POST(request(review, 'https://unrelated.example'))).status, 403);
});
test('new profile setup persists, returns on reload, and queries only the current user', async () => {
  database = fakeDb();
  const response = await api.POST(request(review));
  assert.equal(response.status, 200);
  const saved = await response.json();
  assert.equal(saved.state.grade, '10th'); assert.equal(saved.configured, true);
  const loaded = await (await api.GET()).json();
  assert.equal(loaded.state.version, 1); assert.equal(loaded.state.interests, 'Biology');
  for (const query of database.store.queries.filter(q => q.operation === 'read')) assert.ok(query.filters.some(([k,v]) => k === 'user_id' && v === 'student-a'));
});
test('profile context is preserved; stale clients and concurrent writes cannot overwrite it', async () => {
  const profile = { user_id: 'student-a', grade: '9th', interests: '', student_context: { favorite_activities: 'Robotics', progress_v1: p.initialProgress() } };
  database = fakeDb({ profile });
  assert.equal((await api.POST(request(review))).status, 200);
  assert.equal(database.store.profile.student_context.favorite_activities, 'Robotics');
  assert.equal((await api.POST(request(review))).status, 409);
  database = fakeDb({ profile, conflict: true });
  assert.equal((await api.POST(request(review))).status, 409);
  assert.deepEqual(database.store.profile, profile);
});
test('failed writes and invalid payloads never report success or change saved state', async () => {
  const profile = { user_id: 'student-a', grade: '9th', interests: '', student_context: {} };
  database = fakeDb({ profile, failWrite: true });
  assert.equal((await api.POST(request(review))).status, 503);
  assert.deepEqual(database.store.profile, profile);
  assert.equal((await api.POST(request({ ...review, weeklyMinutes: 0 }))).status, 400);
  assert.equal((await api.POST(request({ ...review, timeZone: 'Invalid/Zone' }))).status, 400);
  assert.equal((await api.POST(request({ action: 'complete', version: 0, id: 'invented', reflection: 'No' }))).status, 400);
});
test('organizer saves do not skip weekly-plan setup', async () => {
  database = fakeDb();
  const response = await api.POST(request({ action: 'organizer', version: 0, organizer: p.initialProgress().organizer }));
  assert.equal(response.status, 200); assert.equal((await response.json()).configured, false);
  for (const field of ['location', 'gpa', 'target_schools', 'extracurriculars']) assert.equal(database.store.profile[field], '');
});

test('postponed weekly steps return after week rollover and can be completed', () => {
  const state = p.initialProgress();
  state.deferred['journal:2026-09-07'] = '2026-09-14';
  assert.ok(p.allSteps(state, [], '2026-09-14').some(t => t.id === 'journal:2026-09-07'));
  assert.ok(!p.weeklySteps(state, [], '2026-09-13').some(t => t.id === 'journal:2026-09-07'));
  assert.ok(p.weeklySteps(state, [], '2026-09-14').some(t => t.id === 'journal:2026-09-07'));
});
test('API rejects stale forms after account switching, even at the same version', async () => {
  database = fakeDb({ user: 'student-b' });
  assert.equal((await api.POST(request(review))).status, 409);
  assert.equal(database.store.profile, null);
});
test('authentication return paths cannot escape to an external origin', () => {
  const { safeNext } = loadTs('lib/auth-next.ts');
  for (const value of ['https://evil.example', '//evil.example', '/\\evil.example', '/\nevil.example']) assert.equal(safeNext(value), '/dashboard');
  assert.equal(safeNext('/progress#journal'), '/progress#journal');
});

test('zero recorded cost stays distinct from an unknown cost', () => {
  const o = p.initialProgress().organizer;
  o.colleges.push({ id:1,name:'Test',category:'match',interest:'High',applicationType:'Regular Decision',deadline:'',major:'',status:'Researching',netPrice:0,netPriceKnown:true,notes:'',essays:false,recommendations:false,transcript:false,fafsa:false });
  assert.equal(v.organizer(o).colleges[0].netPriceKnown, true);
  o.colleges[0].netPriceKnown=false;
  assert.equal(v.organizer(o).colleges[0].netPriceKnown, false);
});
test('planning time does not overwrite activity availability', async () => {
  database=fakeDb({profile:{user_id:'student-a',grade:'9th',interests:'',student_context:{weekly_hours:'6'}}});
  assert.equal((await api.POST(request(review))).status,200);
  assert.equal(database.store.profile.student_context.weekly_hours,'6');
  assert.equal(database.store.profile.student_context.planning_minutes_per_week,30);
});
