"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type QuizAnswers = Record<string, string>;

const GRADE_ROADMAPS: Record<string, { title: string; desc: string }[]> = {
  Freshman: [
    { title: "Explore broadly", desc: "Join 2–3 clubs or activities to find what you actually enjoy." },
    { title: "Build study habits", desc: "Focus on grades now — freshman year GPA sets your baseline." },
    { title: "Meet your counselor", desc: "Introduce yourself so they know your interests early." },
    { title: "Start a reading habit", desc: "Strong reading comprehension pays off on the SAT/ACT later." },
  ],
  Sophomore: [
    { title: "Go deeper on 1–2 activities", desc: "Colleges value depth over a long list of clubs." },
    { title: "Take a practice PSAT", desc: "Get a baseline score to plan your test prep timeline." },
    { title: "Look into summer programs", desc: "Pre-college programs can sharpen your academic interests." },
    { title: "Keep your GPA trending up", desc: "Admissions officers love an upward grade trend." },
  ],
  Junior: [
    { title: "Take the SAT/ACT", desc: "Aim to test by spring so you have room to retake if needed." },
    { title: "Build your college list", desc: "Start balancing reach, match, and safety schools." },
    { title: "Ask for recommendation letters", desc: "Junior year teachers know your work best — ask early." },
    { title: "Draft your personal essay", desc: "Start brainstorming over the summer before senior year." },
  ],
  Senior: [
    { title: "Finalize your college list", desc: "Lock in reach, match, and safety schools by early fall." },
    { title: "Submit applications early", desc: "Early action/decision deadlines often hit in November." },
    { title: "Polish every essay", desc: "Get feedback and revise before each submission." },
    { title: "Apply for financial aid", desc: "File the FAFSA/CSS Profile as soon as it opens." },
  ],
};

export default function RoadmapPage() {
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("clavisprep_quiz");
    setAnswers(raw ? JSON.parse(raw) : {});
  }, []);

  if (answers === null) {
    return <div className="min-h-screen bg-[#0A1628]" />;
  }

  const grade = answers.grade && GRADE_ROADMAPS[answers.grade] ? answers.grade : "Junior";
  const steps = GRADE_ROADMAPS[grade];

  return (
    <div className="min-h-screen">
      <nav className="h-[68px] flex items-center justify-between px-8 border-b border-[rgba(200,140,36,0.2)] bg-[#0A1628]">
        <a href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="ClavisPrep" width={40} height={40} unoptimized className="rounded-lg" />
          <span className="font-display text-lg text-[#E7BF69] tracking-wide" style={{ fontFamily: "var(--font-display)" }}>ClavisPrep</span>
        </a>
        <a href="/app">
          <Button variant="outline" className="border-[rgba(200,140,36,0.4)] text-[#E7BF69] bg-transparent hover:bg-[rgba(200,140,36,0.08)]">
            Retake Quiz
          </Button>
        </a>
      </nav>

      <section className="bg-[#0A1628] pt-20 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,140,36,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 relative">
          <Badge className="mb-6 bg-[rgba(200,140,36,0.12)] text-[#C88C24] border border-[rgba(200,140,36,0.3)] hover:bg-[rgba(200,140,36,0.12)] text-xs tracking-widest uppercase px-4 py-1.5">
            Your personalized plan
          </Badge>
          <h1 className="text-4xl md:text-5xl text-[#F5F0E8] leading-tight mb-4 font-normal" style={{ fontFamily: "var(--font-display)" }}>
            Your {grade} year <span className="text-[#E7BF69]">roadmap</span>
          </h1>
          <p className="text-lg text-[rgba(245,240,232,0.65)] max-w-lg mx-auto">
            Based on your answers, here's what to focus on next to build the strongest possible application.
          </p>
        </div>
      </section>

      <section className="bg-[#F5F0E8] py-20 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div key={step.title} className={`flex gap-8 items-start ${i < steps.length - 1 ? "pb-12" : ""}`}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-[52px] h-[52px] rounded-full bg-[rgba(200,140,36,0.12)] border border-[rgba(200,140,36,0.4)] flex items-center justify-center text-[#C88C24]" style={{ fontFamily: "var(--font-display)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-[rgba(200,140,36,0.3)] mt-2 min-h-[40px]" />}
                </div>
                <div className="pt-3">
                  <h3 className="text-2xl text-[#0A1628] mb-2 font-normal" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                  <p className="text-[#4A4A4A] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F0E8] pb-24 px-8 text-center">
        <div className="max-w-xl mx-auto">
          <div className="bg-[#0A1628] rounded-3xl p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(200,140,36,0.1)_0%,transparent_60%)] pointer-events-none" />
            <h2 className="text-3xl md:text-4xl text-[#F5F0E8] mb-4 relative" style={{ fontFamily: "var(--font-display)" }}>Ready to go deeper?</h2>
            <p className="text-[rgba(245,240,232,0.6)] mb-9 relative">Create your free account to save this roadmap, track deadlines, and get your full college list.</p>
            <a href="/" className="relative">
              <Button size="lg" className="bg-[#C88C24] hover:bg-[#E7BF69] text-[#0A1628] font-semibold px-10 py-6 text-base shadow-[0_4px_24px_rgba(200,140,36,0.3)] hover:-translate-y-0.5 transition-all">
                Create My Free Account →
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
