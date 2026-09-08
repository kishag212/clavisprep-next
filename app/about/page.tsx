"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Target, Users, Lightbulb, TrendingUp, ChevronDown, Sparkles } from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    title: "Access for All",
    description: "Every student deserves expert college guidance, regardless of their financial situation. We're democratizing college prep.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Target,
    title: "Data-Driven Insights",
    description: "We use real admissions data and proven strategies to give students personalized, actionable advice that works.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Lightbulb,
    title: "Student-First Design",
    description: "We built ClavisPrep with students, for students. Every feature is designed to reduce stress and increase clarity.",
    gradient: "from-[#c88c24] to-[#91682b]",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    description: "College admissions evolve, and so do we. We constantly update our platform with the latest data and best practices.",
    gradient: "from-violet-500 to-purple-600",
  },
];

const TEAM = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Former college counselor with 15+ years helping students get into their dream schools.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Product",
    bio: "Built education tech products at Google and Khan Academy. Stanford alum.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Jennifer Park",
    role: "Lead Data Scientist",
    bio: "PhD in Statistics. Former admissions officer at UC Berkeley.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    name: "David Martinez",
    role: "Head of Content",
    bio: "Former college essay coach. Helped 500+ students get accepted to top schools.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
];

export default function About() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("🚀 Coming Soon!\n\nClavisPrep launches April 2026.");
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-40">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="ClavisPrep Logo" className="h-40 w-auto group-hover:scale-105 transition-transform" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">How It Works</Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Pricing</Link>
              <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Blog</Link>
              <a href="#" onClick={handleComingSoon} className="px-5 py-2 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1.5">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:text-[#0a1628]">
              <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Features</Link>
                <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">How It Works</Link>
                <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Pricing</Link>
                <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Blog</Link>
                <a href="#" onClick={handleComingSoon} className="mx-4 px-5 py-2.5 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg text-center">Get Started Free</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative pt-48 pb-20 lg:pt-56 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c88c24]/20 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-[#c88c24]/30 rounded-full mb-8">
            <Heart className="w-4 h-4 text-[#e7bf69]" />
            <span className="text-xs font-semibold text-[#e7bf69] tracking-wide uppercase">Our Mission</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">Making College Prep Accessible to Everyone</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">We believe every student deserves expert guidance on their journey to college — not just those who can afford expensive private counselors.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Our Story</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-6">Built by People Who've Been There</h2>
              <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                <p>ClavisPrep started in 2020 when our founder, Sarah Chen, saw firsthand how the college admissions process was creating an unfair advantage for wealthy families.</p>
                <p>As a college counselor, Sarah watched talented students miss out on opportunities simply because they couldn't afford the $5,000-$10,000 price tag for private counseling.</p>
                <p>She knew there had to be a better way — a way to give every student access to the same expert guidance, personalized strategies, and proven tools that private counselors provide.</p>
                <p>Today, ClavisPrep serves thousands of students from all backgrounds, helping them build balanced college lists, write compelling essays, and navigate the financial aid process with confidence.</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" alt="Students collaborating" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white p-8 rounded-2xl shadow-xl max-w-xs">
                <p className="text-4xl font-bold mb-2">3.8M</p>
                <p className="text-sm">Students apply to college each year in the US</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Our Values</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">What We Stand For</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">These principles guide every decision we make and every feature we build.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-all">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0a1628] mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#c88c24]/10 to-[#91682b]/10 border border-[#c88c24]/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#c88c24]" />
            <span className="text-xs font-semibold text-[#c88c24] tracking-wide uppercase">Launching April 2026</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-6">Join Us in Building Something Special</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            We're building a platform that will help thousands of students navigate the college admissions process with confidence. Be part of our founding community and help shape the future of college prep.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-[#f5f0e8] to-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">For Students</h3>
              <p className="text-slate-600">Expert guidance at a fraction of the cost of private counseling</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-[#f5f0e8] to-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-3">👨‍👩‍👧</div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">For Families</h3>
              <p className="text-slate-600">Transparent pricing and tools to support your student's journey</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-[#f5f0e8] to-white rounded-2xl border border-slate-200">
              <div className="text-5xl mb-3">🏫</div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">For Schools</h3>
              <p className="text-slate-600">Scalable tools to help counselors serve more students effectively</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Meet the Team</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">The People Behind ClavisPrep</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We're educators, technologists, and former college counselors united by one mission: making college prep accessible.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all">
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-[#c88c24] mb-3">{member.role}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90 rounded-3xl p-12 lg:p-16 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c88c24]/10 to-transparent" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center shadow-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">Join Thousands of Students</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Start building your college list today — for free. No credit card required.</p>
              <a href="#" onClick={handleComingSoon} className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-sm text-slate-400 mt-6">Takes 5 minutes · Free forever plan available</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0a1628] border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ClavisPrep Logo" className="h-12 w-auto" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/#features" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">How It Works</Link>
              <Link href="/pricing" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Pricing</Link>
              <Link href="/blog" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Blog</Link>
              <Link href="/about" className="text-sm text-[#e7bf69]">About</Link>
              <a href="#terms" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Terms</a>
              <a href="#privacy" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Privacy</a>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-8">© 2026 ClavisPrep · The key to your college future</div>
        </div>
      </footer>

    </div>
  );
}