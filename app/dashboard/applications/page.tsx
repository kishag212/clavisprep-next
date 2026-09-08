"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

type Application = { id: number; college: string; deadline: string; type: string; status: string };
const STORAGE_KEY = "clavisprep-applications-v1";

export default function ApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState(0);
  const [form, setForm] = useState({ college: "", deadline: "", type: "Regular Decision", status: "Researching" });
  // Hydrate browser-only draft data after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { setItems([]); } setToday(Date.now()); setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items, ready]);
  const completed = useMemo(() => items.filter(item => item.status === "Submitted" || item.status === "Accepted").length, [items]);
  const add = (event: FormEvent) => { event.preventDefault(); setItems(current => [...current, { ...form, id: Date.now() }]); setForm({ college: "", deadline: "", type: "Regular Decision", status: "Researching" }); };
  const update = (id: number, field: keyof Application, value: string) => setItems(current => current.map(item => item.id === id ? { ...item, [field]: value } : item));
  return <main className="min-h-screen bg-[#f5f0e8] px-5 py-10"><div className="max-w-6xl mx-auto">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0a1628] mb-6"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
    <div className="bg-[#0a1628] text-white rounded-3xl p-8 mb-7"><h1 className="font-serif text-3xl font-bold mb-2">Application Tracker</h1><p className="text-slate-300">Keep deadlines and submission progress in one place. {items.length ? `${completed} of ${items.length} applications submitted.` : "Add your first college below."}</p></div>
    <form onSubmit={add} className="bg-white rounded-2xl shadow border border-slate-200 p-5 mb-6 grid md:grid-cols-5 gap-3"><input required value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} placeholder="College name" className="border rounded-lg px-3 py-2 md:col-span-2" /><input required type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="border rounded-lg px-3 py-2" /><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-3 py-2"><option>Early Action</option><option>Early Decision</option><option>Regular Decision</option><option>Rolling</option></select><button className="bg-[#c88c24] text-white font-bold rounded-lg px-4 py-2 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add</button></form>
    <div className="space-y-3">{[...items].sort((a,b) => a.deadline.localeCompare(b.deadline)).map(item => <article key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 grid md:grid-cols-[2fr_1fr_1fr_auto] items-center gap-4"><div><h2 className="font-bold text-[#0a1628]">{item.college}</h2><p className="text-sm text-slate-500">{item.type} · Due {new Date(`${item.deadline}T12:00:00`).toLocaleDateString()}</p></div><select value={item.status} onChange={e => update(item.id, "status", e.target.value)} className="border rounded-lg px-3 py-2"><option>Researching</option><option>In progress</option><option>Ready to submit</option><option>Submitted</option><option>Accepted</option><option>Waitlisted</option><option>Denied</option></select><span className={`text-sm font-bold ${new Date(item.deadline).getTime() < today && item.status !== "Submitted" ? "text-red-600" : "text-slate-600"}`}>{today ? `${Math.ceil((new Date(item.deadline).getTime() - today) / 86400000)} days` : ""}</span><button onClick={() => setItems(current => current.filter(row => row.id !== item.id))} aria-label={`Delete ${item.college}`} className="text-slate-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button></article>)}</div>
    {ready && items.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-slate-600">No applications yet.</div>}
  </div></main>;
}
