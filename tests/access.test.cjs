/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS Node entry point. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const mod = { exports: {} };
const code = ts.transpileModule(fs.readFileSync('lib/access.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
vm.runInThisContext(`(function(exports){${code}\n})`)(mod.exports);
const { resolveAccess } = mod.exports;
const now = Date.parse('2026-09-08T12:00:00Z');
test('paid customers retain access independently of tester expiry', () => {
  for (const status of ['active', 'trialing']) assert.equal(resolveAccess(status, {}, now).source, 'paid');
});
test('tester grant unlocks access only before expiry', () => {
  const metadata = { tester_access_expires_at: '2026-10-08T12:00:00Z' };
  assert.equal(resolveAccess(null, metadata, now).source, 'tester');
  assert.equal(resolveAccess(null, metadata, Date.parse(metadata.tester_access_expires_at)).isPro, false);
});
test('missing, malformed, and expired grants fail closed', () => {
  for (const value of [undefined, null, true, {}, 'bad', '2020-01-01T00:00:00Z']) {
    assert.equal(resolveAccess('canceled', { tester_access_expires_at: value }, now).isPro, false);
  }
  assert.equal(resolveAccess(undefined, undefined, now).isPro, false);
});
test('a user-editable nested grant is not accepted', () => {
  assert.equal(resolveAccess(null, { user_metadata: { tester_access_expires_at: '2099-01-01' } }, now).isPro, false);
});
