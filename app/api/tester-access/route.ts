import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { validInvite } from '@/lib/tester-invite';

export async function POST(request: Request) {
  const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'Please use the invitation form on this site.' }, 403);
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return reply({ error: 'Please sign in first.' }, 401);
  if (!user.email_confirmed_at) return reply({ error: 'Please confirm your email first.' }, 403);
  let body;
  try {
    const text = await request.text();
    if (text.length > 1024) return reply({ error: 'Invalid invitation code.' }, 400);
    body = JSON.parse(text);
  } catch { return reply({ error: 'Invalid invitation code.' }, 400); }
  if (!validInvite(body?.code, process.env.TESTER_INVITE_SHA256, process.env.TESTER_INVITE_EXPIRES_AT)) return reply({ error: 'This invitation code is invalid or has expired.' }, 400);
  try {
    const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: current, error: readError } = await admin.auth.admin.getUserById(user.id);
    if (readError || !current.user) throw new Error('Account unavailable');
    const metadata = current.user.app_metadata;
    // Never renew a previously issued grant, including a grant revoked by an admin.
    if (metadata.tester_invite_redeemed_at || metadata.tester_access_expires_at) {
      const expiresAt = metadata.tester_access_expires_at;
      if (typeof expiresAt === 'string' && Date.parse(expiresAt) > Date.now()) return reply({ expiresAt });
      return reply({ error: 'Your tester access has ended. Contact the pilot organizer for help.' }, 409);
    }
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 86400000).toISOString();
    const { error: saveError } = await admin.auth.admin.updateUserById(user.id, { app_metadata: {
      ...metadata, tester_access_expires_at: expiresAt, tester_invite_redeemed_at: now.toISOString(),
    } });
    if (saveError) throw new Error('Grant unavailable');
    return reply({ expiresAt });
  } catch { return reply({ error: 'Unable to activate access right now. Please try again.' }, 503); }
}
