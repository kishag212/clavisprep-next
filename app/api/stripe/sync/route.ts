import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/lib/stripe';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Test route (so browser doesn't 404)
export async function GET() {
  return NextResponse.json({ message: 'Sync route is working' });
}

// Real sync logic
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: sub.stripe_customer_id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 });
    }

    const subscription = subscriptions.data[0] as any;
    const periodStart = subscription.current_period_start;
    const periodEnd = subscription.current_period_end;
    const priceId = subscription.items?.data?.[0]?.price?.id;

    if (!priceId) {
      return NextResponse.json({ error: 'No price found' }, { status: 500 });
    }

    await supabaseAdmin.from('subscriptions').upsert(
      {
        user_id: user.id,
        stripe_customer_id: sub.stripe_customer_id,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        status: subscription.status,
        current_period_start: new Date(periodStart * 1000).toISOString(),
        current_period_end: new Date(periodEnd * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      },
      { onConflict: 'user_id' }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}