import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { resolveAccess } from '@/lib/access';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const { data: subscription } = await supabase.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle();
  return NextResponse.json(resolveAccess(subscription?.status, user.app_metadata), { headers: { 'Cache-Control': 'no-store' } });
}
