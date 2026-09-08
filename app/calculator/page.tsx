"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Calculator, Plus, Trash2 } from "lucide-react";

type CollegeCost = { id: number; name: string; tuition: number; housing: number; fees: number; grants: number; scholarships: number; familyContribution: number };

const blankCollege = (id: number): CollegeCost => ({ id, name: "", tuition: 0, housing: 0, fees: 0, grants: 0, scholarships: 0, familyContribution: 0 });
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function CalculatorPage() {
  const [colleges, setColleges] = useState<CollegeCost[]>([blankCollege(1)]);
  const results = useMemo(() => colleges.map(college => ({
    ...college,
    sticker: college.tuition + college.housing + college.fees,
    net: Math.max(0, college.tuition + college.housing + college.fees - college.grants - college.scholarships),
  })), [colleges]);

  const update = (id: number, field: keyof CollegeCost, value: string) => setColleges(current => current.map(college => college.id === id ? { ...college, [field]: field === "name" ? value : Math.max(0, Number(value) || 0) } : college));

  return <main className="min-h-screen bg-[#f5f0e8] px-5 py-10">
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0a1628] mb-6"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
      <div className="bg-[#0a1628] text-white rounded-3xl p-8 mb-7"><div className="flex items-center gap-3 mb-2"><Calculator className="text-[#e7bf69]" /><h1 className="font-serif text-3xl font-bold">Net Price Calculator</h1></div><p className="text-slate-300">Compare annual college costs after grants and scholarships. Estimates are for planning only; confirm figures with each college.</p></div>
      <div className="space-y-5">
        {results.map((college, index) => <section key={college.id} className="bg-white rounded-2xl shadow border border-slate-200 p-6">
          <div className="flex justify-between gap-4 mb-5"><input value={college.name} onChange={e => update(college.id, "name", e.target.value)} placeholder={`College ${index + 1} name`} className="font-serif text-xl font-bold border-b border-slate-300 focus:border-[#c88c24] outline-none flex-1" />{colleges.length > 1 && <button onClick={() => setColleges(items => items.filter(item => item.id !== college.id))} aria-label="Remove college" className="text-slate-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>}</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{([
            ["tuition", "Tuition"], ["housing", "Housing & meals"], ["fees", "Fees & books"], ["grants", "Grants / need-based aid"], ["scholarships", "Scholarships"], ["familyContribution", "Family contribution"]
          ] as [keyof CollegeCost, string][]).map(([field, label]) => <label key={field} className="text-sm font-medium text-slate-700">{label}<div className="mt-1 flex items-center border rounded-lg px-3 bg-white"><span className="text-slate-400">$</span><input type="number" min="0" value={college[field]} onChange={e => update(college.id, field, e.target.value)} className="w-full p-2 outline-none" /></div></label>)}</div>
          <div className="grid sm:grid-cols-3 gap-3 mt-5 text-center"><div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">Sticker price</p><p className="font-bold text-lg">{money.format(college.sticker)}</p></div><div className="bg-emerald-50 rounded-xl p-3"><p className="text-xs text-emerald-700">Estimated net price</p><p className="font-bold text-lg text-emerald-800">{money.format(college.net)}</p></div><div className="bg-amber-50 rounded-xl p-3"><p className="text-xs text-amber-700">Remaining gap</p><p className="font-bold text-lg text-amber-800">{money.format(Math.max(0, college.net - college.familyContribution))}</p></div></div>
        </section>)}
      </div>
      <button onClick={() => setColleges(items => [...items, blankCollege(Date.now())])} className="mt-5 inline-flex items-center gap-2 bg-[#c88c24] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#91682b]"><Plus className="w-4 h-4" /> Compare another college</button>
    </div>
  </main>;
}
