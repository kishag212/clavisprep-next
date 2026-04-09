"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const NAV_LINKS = ["Features", "How It Works", "Pricing", "Blog"];

const FEATURES = [
  { icon: "🗝", title: "AI College Match", desc: "Answer 15 questions. Get a personalized list of reach, match, and safety schools ranked for your exact profile." },
  { icon: "✍️", title: "Essay Coach", desc: "AI feedback on your college essays in seconds. Score, rewrite suggestions, and before/after comparisons." },
  { icon: "📋", title: "Application Tracker", desc: "Never miss a deadline. Track every school, requirement, and deadline in one organized dashboard." },
  { icon: "💰", title: "Financial Aid Calculator", desc: "See your real cost at every school. Estimate your Expected Family Contribution and compare aid packages." },
  { icon: "🗺️", title: "Activity Roadmap", desc: "A personalized year-by-year plan from freshman year through application season." },
  { icon: "📁", title: "Document Storage", desc: "Keep essays, transcripts, and recommendations organized and accessible in one secure place." },
];

const STATS = [
  { value: "3.8M", label: "Students apply to college each year" },
  { value: "5 min", label: "To get your personalized college list" },
  { value: "300+", label: "Colleges in our database" },
  { value: "Free", label: "To start — no credit card needed" },
];

const STEPS = [
  { num: "01", title: "Tell us about yourself", desc: "Answer 15 quick questions about your GPA, interests, location, and goals." },
  { num: "02", title: "Get your college list", desc: "Our AI builds a personalized list of reach, match, and safety schools ranked for you." },
  { num: "03", title: "Plan your application", desc: "Track deadlines, polish essays, and calculate your real cost at every school." },
  { num: "04", title: "Get accepted", desc: "Submit confident applications knowing you've applied to the right schools." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-8 border-b transition-all duration-300 ${scrolled ? "bg-[#0A1628]/95 backdrop-blur-md" : "bg-[#0A1628]"} border-[rgba(200,140,36,0.2)]`}>
        <a href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="ClavisPrep" width={44} height={44} unoptimized className="rounded-lg" />
          <span className="font-display text-xl text-[#E7BF69] tracking-wide" style={{ fontFamily: "var(--font-display)" }}>ClavisPrep</span>
        </a>
        <div className="flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} className="text-[rgba(245,240,232,0.7)] text-sm hover:text-[#E7BF69] transition-colors">
              {link}
            </a>
          ))}
          <a href="/app">
            <Button className="bg-[#C88C24] hover:bg-[#E7BF69] text-[#0A1628] font-semibold px-6">
              Get Started Free →
            </Button>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-[#0A1628] pt-36 pb-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,140,36,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative">
          <Badge className="mb-8 bg-[rgba(200,140,36,0.12)] text-[#C88C24] border border-[rgba(200,140,36,0.3)] hover:bg-[rgba(200,140,36,0.12)] text-xs tracking-widest uppercase px-4 py-1.5">
            AI-Powered College Prep
          </Badge>
          <h1 className="text-5xl md:text-7xl text-[#F5F0E8] leading-tight mb-6 font-normal" style={{ fontFamily: "var(--font-display)" }}>
            The key to your<br />
            <span className="text-[#E7BF69]">college future</span>
          </h1>
          <p className="text-lg md:text-xl text-[rgba(245,240,232,0.65)] max-w-lg mx-auto mb-10 leading-relaxed">
            Answer 15 questions. Get your personalized list of reach, match, and safety schools — built by AI, tailored to you.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/app">
              <Button size="lg" className="bg-[#C88C24] hover:bg-[#E7BF69] text-[#0A1628] font-semibold px-10 py-6 text-base shadow-[0_4px_24px_rgba(200,140,36,0.3)] hover:-translate-y-0.5 transition-all">
                Build My College List — Free →
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-[rgba(200,140,36,0.4)] text-[#E7BF69] bg-transparent hover:bg-[rgba(200,140,36,0.08)] px-10 py-6 text-base">
                See How It Works
              </Button>
            </a>
          </div>
          <p className="text-[rgba(245,240,232,0.35)] text-sm mt-4">Free to start · No credit card · Takes 5 minutes</p>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#132240] border-y border-[rgba(200,140,36,0.2)] py-10 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(stat => (
            <div key={stat.value}>
              <div className="text-4xl text-[#E7BF69] mb-1.5" style={{ fontFamily: "var(--font-display)" }}>{stat.value}</div>
              <div className="text-xs text-[rgba(245,240,232,0.55)] leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#F5F0E8] py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-[#C88C24] mb-3">Everything you need</p>
            <h2 className="text-4xl md:text-5xl text-[#0A1628] mb-4" style={{ fontFamily: "var(--font-display)" }}>Your complete college prep toolkit</h2>
            <p className="text-lg text-[#4A4A4A] max-w-md mx-auto">Everything a private college counselor does — powered by AI, available to every student.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <Card key={f.title} className="bg-white border border-[#E0D9CE] hover:border-[#CBA354] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 rounded-2xl">
                <CardContent className="p-7">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-xl text-[#0A1628] mb-2" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#0A1628] py-24 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-[#C88C24] mb-3">Simple process</p>
            <h2 className="text-4xl md:text-5xl text-[#F5F0E8]" style={{ fontFamily: "var(--font-display)" }}>How ClavisPrep works</h2>
          </div>
          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`flex gap-8 items-start ${i < STEPS.length - 1 ? "pb-12" : ""}`}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-13 h-13 rounded-full bg-[rgba(200,140,36,0.15)] border border-[rgba(200,140,36,0.4)] flex items-center justify-center text-[#C88C24] w-[52px] h-[52px]" style={{ fontFamily: "var(--font-display)" }}>
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && <div className="w-px flex-1 bg-[rgba(200,140,36,0.2)] mt-2 min-h-[40px]" />}
                </div>
                <div className="pt-3">
                  <h3 className="text-2xl text-[#F5F0E8] mb-2 font-normal" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                  <p className="text-[rgba(245,240,232,0.6)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5F0E8] py-24 px-8 text-center">
        <div className="max-w-xl mx-auto">
          <div className="bg-[#0A1628] rounded-3xl p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(200,140,36,0.1)_0%,transparent_60%)] pointer-events-none" />
            <Image src="/images/logo.png" alt="ClavisPrep" width={64} height={64} unoptimized className="mx-auto mb-6 rounded-xl relative" />
            <h2 className="text-3xl md:text-4xl text-[#F5F0E8] mb-4 relative" style={{ fontFamily: "var(--font-display)" }}>Ready to find your perfect college?</h2>
            <p className="text-[rgba(245,240,232,0.6)] mb-9 relative">Join thousands of students who used ClavisPrep to build their college list, write better essays, and get accepted.</p>
            <a href="/app" className="relative">
              <Button size="lg" className="bg-[#C88C24] hover:bg-[#E7BF69] text-[#0A1628] font-semibold px-10 py-6 text-base shadow-[0_4px_24px_rgba(200,140,36,0.3)] hover:-translate-y-0.5 transition-all">
                Start Free — No Credit Card →
              </Button>
            </a>
            <p className="text-[rgba(245,240,232,0.3)] text-xs mt-4 relative">Takes 5 minutes · Free forever plan available</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A1628] border-t border-[rgba(200,140,36,0.2)] py-12 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image src="/images/logo.png" alt="ClavisPrep" width={32} height={32} unoptimized className="rounded-md" />
            <span className="text-lg text-[#E7BF69]" style={{ fontFamily: "var(--font-display)" }}>ClavisPrep</span>
          </div>
          <div className="flex gap-6 justify-center flex-wrap mb-6">
            {["Features", "Blog", "Colleges", "Terms", "Privacy"].map(link => (
              <a key={link} href={`/${link.toLowerCase()}`} className="text-sm text-[rgba(245,240,232,0.4)] hover:text-[#CBA354] transition-colors">
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs text-[rgba(245,240,232,0.25)]">© 2026 ClavisPrep · The key to your college future · Powered by Claude AI</p>
        </div>
      </footer>

    </div>
  );
}