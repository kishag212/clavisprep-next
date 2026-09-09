import Stripe from 'stripe';

let client: Stripe | undefined;

// Initialize during a request, so previews can build without payment credentials.
export function getStripe(): Stripe | null {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return null;
  client ??= new Stripe(apiKey, {
    apiVersion: '2026-03-25.dahlia',
    typescript: true,
  });
  return client;
}
