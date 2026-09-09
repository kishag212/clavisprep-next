/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS Node entry point. */
// Run with: node --env-file=.env.local scripts/grant-tester-access.cjs email [email ...]
// Credentials stay local. Only app_metadata is updated; Stripe is never called.
const { createClient } = require('@supabase/supabase-js');
const emails = [...new Set(process.argv.slice(2).map(value => value.trim().toLowerCase()))];
if (!emails.length || emails.some(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
  throw new Error('Supply the existing tester account emails.');
}
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
(async () => {
  const users = new Map();
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw new Error('Unable to look up tester accounts.');
    for (const user of data.users) {
      if (emails.includes(user.email?.toLowerCase())) users.set(user.email.toLowerCase(), user);
    }
    if (data.users.length < 100) break;
  }
  // Validate every account before granting any access.
  for (const email of emails) {
    if (!users.has(email)) throw new Error(`Account not found: ${email}. Ask this tester to sign up first.`);
    if (!users.get(email).email_confirmed_at) throw new Error(`Email not confirmed: ${email}.`);
  }
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  for (const email of emails) {
    const user = users.get(email);
    const { data, error } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, tester_access_expires_at: expiresAt },
    });
    if (error || data.user.app_metadata.tester_access_expires_at !== expiresAt) {
      throw new Error(`Grant failed for ${email}; earlier grants, if reported, remain active.`);
    }
    console.log(`${email}: free tester access expires ${expiresAt}`);
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
