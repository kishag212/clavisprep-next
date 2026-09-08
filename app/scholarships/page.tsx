"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ExternalLink } from "lucide-react";

const SCHOLARSHIPS = [
  { name: "Coca-Cola Scholars Program", amount: 20000, grades: "12th", interest: "Leadership", url: "https://www.coca-colascholarsfoundation.org/apply/" },
  { name: "Jack Kent Cooke College Scholarship", amount: 55000, grades: "12th", interest: "Academic achievement", url: "https://www.jkcf.org/our-scholarships/college-scholarship-program/" },
  { name: "The Gates Scholarship", amount: 0, grades: "12th", interest: "Leadership", url: "https://www.thegatesscholarship.org/scholarship" },
  { name: "Horatio Alger National Scholarship", amount: 25000, grades: "11th", interest: "Community service", url: "https://scholars.horatioalger.org/horatio-alger-scholarship-applications/" },
  { name: "Doodle for Google", amount: 30000, grades: "8th-12th", interest: "Arts", url: "https://doodles.google.com/d4g/" },
  { name: "Society of Women Engineers Scholarships", amount: 10000, grades: "12th", interest: "STEM", url: "https://swe.org/scholarships/" },
];

export default function ScholarshipsPage() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const matches = useMemo(() => SCHOLARSHIPS.filter(item => (grade === "all" || item.grades.includes(grade)) && `${item.name} ${item.interest}`.toLowerCase().includes(query.toLowerCase())), [query, grade]);
  return <main className="min-h-screen bg-[#f5f0e8] px-5 py-10"><div className="max-w-5xl mx-auto">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0a1628] mb-6"><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
    <div className="bg-[#0a1628] text-white rounded-3xl p-8 mb-7"><h1 className="font-serif text-3xl font-bold mb-2">Scholarship Finder</h1><p className="text-slate-300">Start with trusted national opportunities, then verify deadlines and eligibility on the provider&apos;s website.</p></div>
    <div className="bg-white rounded-2xl shadow border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-3"><label className="flex items-center gap-2 flex-1 border rounded-xl px-3"><Search className="w-4 h-4 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or interest" className="w-full py-3 outline-none" /></label><select value={grade} onChange={e => setGrade(e.target.value)} className="border rounded-xl px-4 py-3"><option value="all">All grades</option>{["8th", "9th", "10th", "11th", "12th"].map(item => <option key={item}>{item}</option>)}</select></div>
    <div className="grid md:grid-cols-2 gap-5">{matches.map(item => <article key={item.name} className="bg-white rounded-2xl shadow border border-slate-200 p-6"><div className="flex justify-between gap-3 mb-3"><span className="text-xs font-bold uppercase tracking-wide text-[#91682b]">{item.interest}</span><span className="text-sm font-bold text-emerald-700">{item.amount ? `Up to $${item.amount.toLocaleString()}` : "Full unmet need"}</span></div><h2 className="font-serif text-xl font-bold text-[#0a1628]">{item.name}</h2><p className="text-sm text-slate-600 mt-2 mb-5">Eligible grade: {item.grades}. Award details and deadlines can change.</p><a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-[#c88c24] hover:text-[#91682b]">View official details <ExternalLink className="w-4 h-4" /></a></article>)}</div>
    {matches.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-slate-600">No matches yet. Try a broader search or another grade.</div>}
  </div></main>;
}
