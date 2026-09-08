import Link from 'next/link';
export default function AuthCodeError() {
  return <main className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-6"><section className="max-w-lg bg-white p-8 rounded-2xl border border-slate-200"><h1 className="font-serif text-3xl text-slate-900 mb-4">Let’s try signing in again.</h1><p className="text-slate-600 mb-6">This sign-in link may have expired, already been used, or opened in a different browser. Return to the same browser where you started and sign in again.</p><Link href="/login?next=/progress" className="inline-block bg-[#173b3c] text-white rounded-lg px-5 py-3">Return to sign in</Link></section></main>;
}
