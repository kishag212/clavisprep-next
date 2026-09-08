"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Target, PenTool, Calendar, DollarSign, Map, GraduationCap, Award, FileText, ChevronDown, Menu, X, Check, Clock } from "lucide-react";

/* ==========================================================================
   CLAVIS PREP - LANDING PAGE
   
   Positioning: "Start in 8th grade. Get accepted senior year."
   Differentiator: 5-year roadmap, not last-minute panic
   ========================================================================== */

const FEATURES = [
  {
    icon: Map,
    title: "5-Year Roadmap",
    desc: "A personalized plan from 8th grade through senior year. Know exactly what courses, activities, and milestones to hit each year.",
    gradient: "from-[#c88c24] to-[#91682b]",
    href: "/roadmap",
    badge: "What sets us apart",
  },
  {
    icon: Award,
    title: "Scholarship Finder",
    desc: "Get matched with scholarships you actually qualify for based on your state, grades, background, and interests.",
    gradient: "from-emerald-500 to-green-600",
    href: "/scholarships",
    badge: "Coming soon",
  },
  {
    icon: Target,
    title: "College Match Quiz",
    desc: "Answer 15 questions. Get a personalized list of reach, match, and safety schools ranked for your profile.",
    gradient: "from-violet-500 to-purple-600",
    href: "/college-match",
    badge: null,
  },
  {
    icon: PenTool,
    title: "Essay Coach",
    desc: "Unlimited AI feedback on your college essays. Scores, rewrite suggestions, and before/after comparisons.",
    gradient: "from-blue-500 to-cyan-600",
    href: "/essay-coach",
    badge: null,
  },
  {
    icon: DollarSign,
    title: "Net Price Calculator",
    desc: "See what YOU will actually pay at each school after financial aid. Compare true costs side by side.",
    gradient: "from-pink-500 to-rose-600",
    href: "/calculator",
    badge: null,
  },
  {
    icon: Calendar,
    title: "Deadline Tracker",
    desc: "Never miss an application deadline. Track every school, requirement, and due date in one dashboard.",
    gradient: "from-indigo-500 to-purple-600",
    href: "/dashboard",
    badge: null,
  },
];

const TIMELINE = [
  { grade: "8th", title: "Explore & Plan", desc: "Discover interests, set GPA goals, start building your activity foundation" },
  { grade: "9th", title: "Build Foundation", desc: "Join clubs, try activities, establish study habits, take challenging courses" },
  { grade: "10th", title: "Deepen Involvement", desc: "Take leadership roles, start test prep, narrow down interests" },
  { grade: "11th", title: "Execute & Test", desc: "Take SAT/ACT, visit colleges, build your list, start essays" },
  { grade: "12th", title: "Apply & Win", desc: "Submit applications, apply for scholarships, get accepted" },
];

const COMPETITORS = [
  { name: "Other prep services", when: "Junior/Senior year", status: "too late" },
  { name: "School counselors", when: "Senior year", status: "overwhelmed" },
  { name: "Private counselors", when: "Varies", status: "$5,000+" },
  { name: "ClavisPrep", when: "8th grade →", status: "perfect timing" },
];

const TESTIMONIALS = [
  {
    quote: "We started with ClavisPrep in 8th grade. By junior year, my daughter had the perfect activities and GPA. Zero stress.",
    author: "Michelle T.",
    role: "Parent, Austin TX",
    avatar: "MT",
  },
  {
    quote: "The roadmap told us exactly what to do each year. It's like having a private counselor for $19/month.",
    author: "James L.",
    role: "Parent, Chicago IL",
    avatar: "JL",
  },
  {
    quote: "Found $12,000 in scholarships I never would have known about. The scholarship finder paid for itself 600x over.",
    author: "Aisha R.",
    role: "Student, Georgia",
    avatar: "AR",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      
      {/* ===== NAVIGATION ===== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm" 
          : "bg-white/50 backdrop-blur-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="ClavisPrep Logo" 
                className="h-40 w-auto group-hover:scale-105 transition-transform"
              />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" onClick={(e) => scrollToSection(e, "features")} className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Features</a>
              <a href="#roadmap" onClick={(e) => scrollToSection(e, "roadmap")} className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Roadmap</a>
              <a href="#pricing" onClick={(e) => scrollToSection(e, "pricing")} className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Pricing</a>
              <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Blog</Link>
              
              <div className="w-px h-6 bg-slate-300" />
              
              <Link href="/login" className="text-sm font-semibold text-[#0a1628] hover:text-[#c88c24] transition-colors">Log In</Link>
              <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1.5">
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:text-[#0a1628]">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 bg-white/95 backdrop-blur-xl absolute left-0 right-0 top-full shadow-lg">
              <div className="flex flex-col gap-1 px-6">
                <a href="#features" onClick={(e) => scrollToSection(e, "features")} className="text-sm font-medium text-slate-600 hover:text-[#0a1628] py-3">Features</a>
                <a href="#roadmap" onClick={(e) => scrollToSection(e, "roadmap")} className="text-sm font-medium text-slate-600 hover:text-[#0a1628] py-3">Roadmap</a>
                <a href="#pricing" onClick={(e) => scrollToSection(e, "pricing")} className="text-sm font-medium text-slate-600 hover:text-[#0a1628] py-3">Pricing</a>
                <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] py-3">Blog</Link>
                <div className="border-t border-slate-200 my-2" />
                <Link href="/login" className="text-sm font-semibold text-[#0a1628] py-3">Log In</Link>
                <Link href="/signup" className="mt-2 px-5 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg text-center">Start Free</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f0e8] via-white to-[#e7bf69]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#e7bf69]/30 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#c88c24] rounded-full mb-8 shadow-sm">
              <Clock className="w-4 h-4 text-[#c88c24]" />
              <span className="text-xs font-semibold text-[#91682b] tracking-wide uppercase">Start early. Stress less.</span>
            </div>

            <h1 className="font-serif text-5xl lg:text-7xl font-bold text-[#0a1628] leading-tight mb-6">
              Start in <span className="bg-gradient-to-r from-[#c88c24] to-[#91682b] bg-clip-text text-transparent">8th grade.</span><br/>
              Get accepted senior year.
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              The 5-year college roadmap that tells your student exactly what to do — from middle school through acceptance letter. No more senior year panic.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/college-match" className="px-8 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 group">
                Take the College Match Quiz
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#roadmap" onClick={(e) => scrollToSection(e, "roadmap")} className="px-8 py-4 bg-white text-[#0a1628] font-semibold rounded-xl border-2 border-slate-200 hover:border-[#c88c24] hover:shadow-md transition-all duration-200">
                See the 5-Year Plan
              </a>
            </div>

            <p className="text-sm text-slate-500">Free quiz · No credit card · Results in 5 minutes</p>
          </div>

          {/* Competitor comparison mini */}
          <div className="max-w-2xl mx-auto mt-16 bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
            <p className="text-xs font-semibold text-[#c88c24] uppercase tracking-wide mb-4 text-center">Why starting early matters</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {COMPETITORS.map((c, i) => (
                <div key={i} className={`text-center p-3 rounded-xl ${c.name === "ClavisPrep" ? "bg-gradient-to-br from-[#c88c24]/10 to-[#91682b]/10 border-2 border-[#c88c24]" : "bg-slate-50"}`}>
                  <p className="font-semibold text-[#0a1628] text-sm mb-1">{c.name}</p>
                  <p className={`text-xs ${c.name === "ClavisPrep" ? "text-[#c88c24] font-bold" : "text-slate-500"}`}>{c.when}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5-YEAR ROADMAP ===== */}
      <section id="roadmap" className="py-20 lg:py-28 bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] text-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#e7bf69] uppercase tracking-wide mb-3">Your Student's Roadmap</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">5 years. One clear plan.</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Every grade has specific goals. ClavisPrep tells you exactly what to focus on — no guessing.</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#c88c24]/20 via-[#c88c24] to-[#c88c24]/20 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center font-bold text-lg shadow-lg mb-4 mx-auto lg:mx-0">
                      {item.grade}
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-center lg:text-left">{item.title}</h3>
                    <p className="text-sm text-slate-300 text-center lg:text-left">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/college-match" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200">
              Get Your Personalized Roadmap
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 lg:py-28 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Everything You Need</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">
              What a $5,000 counselor does.<br/>For $19/month.
            </h2>
            <p className="text-lg text-slate-600">Every tool your student needs from 8th grade through acceptance.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={i}
                  href={feature.href}
                  className="group relative p-8 bg-gradient-to-br from-[#f5f0e8] to-white border border-slate-200 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-[#c88c24] cursor-pointer block"
                >
                  {feature.badge && (
                    <span className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full ${
                      feature.badge === "What sets us apart" 
                        ? "bg-[#c88c24] text-white" 
                        : "bg-slate-200 text-slate-600"
                    }`}>
                      {feature.badge}
                    </span>
                  )}
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-md group-hover:shadow-lg transition-shadow`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-serif text-xl font-semibold text-[#0a1628] mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                  
                  <div className="mt-4 text-[#c88c24] text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 lg:py-28 bg-[#f5f0e8] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Simple Pricing</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">Start free. Upgrade when ready.</h2>
            <p className="text-lg text-slate-600">Take the quiz free. Get your roadmap when you upgrade.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200">
              <h3 className="font-serif text-2xl font-bold text-[#0a1628] mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#0a1628]">$0</span>
                <span className="text-slate-600">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["College Match Quiz (15 questions)", "3 college recommendations", "Basic deadline reminders", "Email tips & resources"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#c88c24] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/college-match" className="block w-full px-6 py-3 bg-white border-2 border-[#c88c24] text-[#0a1628] font-semibold rounded-lg text-center hover:bg-[#f5f0e8] transition-colors">
                Take Free Quiz
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] p-8 rounded-2xl border-2 border-[#c88c24] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold px-4 py-1 rounded-full">BEST VALUE</span>
              </div>
              
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-slate-300">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free, plus:",
                  "Full 5-year personalized roadmap",
                  "Unlimited college matches",
                  "Scholarship Finder (coming soon)",
                  "Essay Coach with unlimited feedback",
                  "Net Price Calculator",
                  "Priority support"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#e7bf69] mt-0.5 flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <a href="/stripe/checkout" className="block w-full px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all">
                Start Pro — $19/mo
              </a>
              <p className="text-xs text-slate-400 text-center mt-3">Cancel anytime. No commitment.</p>
            </div>
          </div>

          {/* Value prop */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <p className="text-slate-600">
              <span className="font-semibold text-[#0a1628]">Private counselors charge $5,000+.</span> ClavisPrep gives you the same roadmap, essay help, and college matching for less than the cost of a pizza night.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Success Stories</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628]">Families love the early start</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#f5f0e8] p-8 rounded-2xl border border-slate-200">
                <p className="text-slate-700 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e7bf69] to-[#c88c24] flex items-center justify-center font-bold text-[#0a1628] text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0a1628]">{t.author}</div>
                    <div className="text-sm text-slate-600">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 lg:py-28 bg-[#f5f0e8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] rounded-3xl p-12 lg:p-16 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c88c24]/10 to-transparent" />
            
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center shadow-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">
                Don't wait until junior year.
              </h2>
              
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                The students who get into their dream schools started planning early. Give your family the same advantage — start today.
              </p>
              
              <Link href="/college-match" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
                Take the Free Quiz
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="text-sm text-slate-400 mt-6">Takes 5 minutes · Free forever plan available</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0a1628] border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ClavisPrep Logo" className="h-12 w-auto" />
            </Link>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="#features" onClick={(e) => scrollToSection(e, "features")} className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Features</a>
              <a href="#roadmap" onClick={(e) => scrollToSection(e, "roadmap")} className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Roadmap</a>
              <a href="#pricing" onClick={(e) => scrollToSection(e, "pricing")} className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Pricing</a>
              <Link href="/blog" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Blog</Link>
              <Link href="/about" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">About</Link>
              <Link href="/contact" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Contact</Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Terms</Link>
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Privacy</Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 border-t border-slate-800 pt-8">
            <p>© 2026 ClavisPrep · The key to your college future</p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-[#e7bf69] transition-colors">Log In</Link>
              <Link href="/signup" className="hover:text-[#e7bf69] transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
