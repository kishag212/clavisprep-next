/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS Node entry point. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const crypto = require('node:crypto');
let user, writes, savedMetadata;
const load = (file) => {
 const mod = {exports:{}};
 const code = ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const req = id => {
  if(id==='@/utils/supabase/server') return {createClient:async()=>({auth:{getUser:async()=>({data:{user}})}})};
  if(id==='@/lib/tester-invite') return load('lib/tester-invite.ts');
  if(id==='@supabase/supabase-js') return {createClient:()=>({auth:{admin:{getUserById:async()=>({data:{user}}),updateUserById:async(id,data)=>{writes++;savedMetadata=data.app_metadata;return {error:null}}}}})};
  return require(id);
 };
 vm.runInThisContext(`(function(require,module,exports){${code}\n})`)(req,mod,mod.exports); return mod.exports;
};
const {validInvite}=load('lib/tester-invite.ts');
const code='synthetic-test-invitation';
const hash=crypto.createHash('sha256').update(code).digest('hex');
test('invitation hash and expiry fail closed',()=>{
 assert.equal(validInvite(code,hash,'2099-01-01'),true);
 for(const value of ['',null,{},'wrong']) assert.equal(validInvite(value,hash,'2099-01-01'),false);
 assert.equal(validInvite(code,hash,'2000-01-01'),false);
 assert.equal(validInvite(code,undefined,'2099-01-01'),false);
});
const {POST}=load('app/api/tester-access/route.ts');
const request=(origin='https://test.invalid',value=code)=>new Request('https://test.invalid/api/tester-access',{method:'POST',headers:{origin},body:JSON.stringify({code:value})});
test('redemption authenticates and verifies email/code before any write',async()=>{
 process.env.TESTER_INVITE_SHA256=hash;process.env.TESTER_INVITE_EXPIRES_AT='2099-01-01'; writes=0;user=null;
 assert.equal((await POST(request())).status,401);
 user={id:'test',app_metadata:{}};
 assert.equal((await POST(request())).status,403);
 user.email_confirmed_at='2026-01-01';
 assert.equal((await POST(request('https://evil.invalid'))).status,403);
 assert.equal((await POST(request(undefined,'wrong'))).status,400);
 assert.equal(writes,0);
});
test('grant lasts 30 days, preserves metadata, and cannot be renewed or reactivated',async()=>{
 user={id:'test',email_confirmed_at:'2026-01-01',app_metadata:{provider:'email'}};writes=0;
 const before=Date.now();const response=await POST(request());assert.equal(response.status,200);
 const {expiresAt}=await response.json();const duration=Date.parse(expiresAt)-before;
 assert.ok(duration>=30*86400000 && duration<30*86400000+5000);assert.equal(savedMetadata.provider,'email');assert.equal(writes,1);
 user.app_metadata=savedMetadata;
 assert.equal((await (await POST(request())).json()).expiresAt,expiresAt);assert.equal(writes,1);
 user.app_metadata.tester_access_expires_at='2000-01-01';assert.equal((await POST(request())).status,409);assert.equal(writes,1);
 delete user.app_metadata.tester_access_expires_at;assert.equal((await POST(request())).status,409);assert.equal(writes,1);
});
