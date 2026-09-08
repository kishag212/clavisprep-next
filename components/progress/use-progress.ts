'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProgressPayload } from '@/lib/progress';
import { createClient } from '@/utils/supabase/client';

export function useProgress() {
  const [data, setData] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const latest = useRef<ProgressPayload | null>(null);
  const busy = useRef(false);
  const generation = useRef(0);
  const reload = useCallback(async () => {
    if (busy.current) return;
    const started = ++generation.current;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/progress', { cache: 'no-store', signal: AbortSignal.timeout(20000) });
      const payload = await response.json();
      if (started !== generation.current) return;
      setSignedOut(response.status === 401);
      if (response.status === 401) { latest.current = null; setData(null); }
      if (!response.ok) throw new Error(payload.error);
      latest.current = payload; setData(payload);
    } catch (e) { if (started === generation.current) setError(e instanceof Error ? e.message : 'Unable to load your plan.'); }
    finally { if (started === generation.current) setLoading(false); }
  }, []);
  useEffect(() => {
    void reload();
    const { data: { subscription } } = createClient().auth.onAuthStateChange((event, session) => {
      const owner = latest.current?.ownerId;
      if (event === 'SIGNED_OUT' || (owner && session?.user.id !== owner)) {
        ++generation.current; latest.current = null; setData(null); setLoading(false);
        setSignedOut(true); setError('Your account session changed. Sign in again to continue.');
      }
    });
    // This is a request-generation counter, not a DOM ref; invalidate in-flight responses on cleanup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { ++generation.current; subscription.unsubscribe(); };
  }, [reload]);
  async function save(action: Record<string, unknown>) {
    if (!latest.current || busy.current) return false;
    const started = ++generation.current;
    const ownerId = latest.current.ownerId;
    busy.current = true; setSaving(true); setError('');
    try {
      const response = await fetch('/api/progress', { method: 'POST', signal: AbortSignal.timeout(20000), headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...action, ownerId, version: latest.current.state.version }) });
      const payload = await response.json();
      if (started !== generation.current) return false;
      setSignedOut(response.status === 401);
      if (response.status === 401) { latest.current = null; setData(null); }
      if (!response.ok) throw new Error(payload.error);
      latest.current = payload; setData(payload); return true;
    } catch (e) { if (started === generation.current) setError(e instanceof Error ? e.message : 'Unable to save. Please try again.'); return false; }
    finally { busy.current = false; setSaving(false); }
  }
  return { data, error, loading, saving, signedOut, reload, save };
}
