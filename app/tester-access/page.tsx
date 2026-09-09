'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function TesterAccess() {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  async function redeem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/tester-access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
      const result = await response.json();
      if (!response.ok) setMessage(result.error || 'Unable to activate access.');
      else { setExpiresAt(result.expiresAt); setCode(''); }
    } catch { setMessage('Unable to connect. Please try again.'); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-[#f5f0e8] px-6 py-20 text-[#0a1628]">
    <section className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-sm">
      <Link href="/" className="font-bold">ClavisPrep</Link>
      <h1 className="mt-8 text-3xl font-bold">Welcome, testers</h1>
      <p className="mt-4">Your invitation gives you 30 days of free Pro access. No card required. Access ends automatically without a charge.</p>
      <p className="mt-4"><Link className="underline" href="/login?next=/tester-access">Sign in</Link> or <Link className="underline" href="/signup?next=/tester-access">create an account</Link> first, then enter your private invitation code here.</p>
      {expiresAt ? <div role="status" className="mt-6 rounded-xl bg-green-50 p-4">
        <p>Your tester access is active through {new Date(expiresAt).toLocaleDateString()}.</p>
        <Link href="/dashboard" className="mt-3 inline-block font-bold underline">Start exploring ClavisPrep →</Link>
      </div> : <form onSubmit={redeem} className="mt-6">
        <label htmlFor="invite" className="block font-semibold">Invitation code</label>
        <input id="invite" value={code} onChange={event => setCode(event.target.value)} required maxLength={200} autoComplete="off" spellCheck={false} className="mt-2 w-full rounded-lg border border-slate-300 p-3" />
        <button disabled={busy} className="mt-4 w-full rounded-lg bg-[#173b3c] p-3 font-semibold text-white disabled:opacity-60">{busy ? 'Activating…' : 'Activate 30 days free'}</button>
        {message && <p role="alert" className="mt-4 text-red-700">{message}</p>}
      </form>}
    </section>
  </main>;
}
