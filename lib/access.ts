// Tester grants belong in app_metadata, which only administrators can edit.
export type Access = { isPro: boolean; source: 'paid' | 'tester' | 'free'; expiresAt: string | null };
export function resolveAccess(status: string | null | undefined, metadata: Record<string, unknown> | undefined, now = Date.now()): Access {
  if (status === 'active' || status === 'trialing') return { isPro: true, source: 'paid', expiresAt: null };
  const expiry = metadata?.tester_access_expires_at;
  const timestamp = typeof expiry === 'string' ? Date.parse(expiry) : NaN;
  if (Number.isFinite(timestamp) && timestamp > now) {
    return { isPro: true, source: 'tester', expiresAt: new Date(timestamp).toISOString() };
  }
  return { isPro: false, source: 'free', expiresAt: null };
}
