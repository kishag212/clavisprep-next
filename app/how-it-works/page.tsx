"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Target, PenTool, Calendar, DollarSign, MapPin, FileText, CheckCircle, Clock, Sparkles, ChevronDown } from "lucide-react";

const DETAILED_STEPS = [
  {
    number: "01",
    title: "Tell Us About Yourself",
    subtitle: "Quick 15-question quiz (5 minutes)",
    icon: Target,
    gradient: "from-violet-500 to-purple-600",
    description: "We start by getting to know you as a student. Our smart questionnaire covers everything college admissions officers care about.",
    features: [
      "Academic profile (GPA, test scores, course rigor)",
      "Extracurricular activities and leadership",
      "Geographic and financial preferences",
      "Intended major and career interests",
      "Campus culture and environment preferences",
    ],
    details: [
      { label: "Time to Complete", value: "5 minutes" },
      { label: "Questions", value: "15 targeted questions" },
      { label: "Updates", value: "Update anytime as you grow" },
    ],
  },
  {
    number: "02",
    title: "Get Your College List",
    subtitle: "Personalized recommendations in seconds",
    icon: Target,
    gradient: "from-blue-500 to-cyan-600",
    description: "Our smart matching algorithm analyzes 300+ colleges and ranks them based on your unique profile. You'll see reach, match, and safety schools tailored to you.",
    features: [
      "Reach schools (ambitious targets)",
      "Match schools (strong fit)",
      "Safety schools (likely acceptance)",
      "Detailed acceptance probability for each school",
      "Why each school matches your profile",
    ],
    details: [
      { label: "Schools in Database", value: "300+" },
      { label: "Ranking Factors", value: "20+ data points" },
      { label: "Updates", value: "Real-time as admissions data changes" },
    ],
  },
  {
    number: "03",
    title: "Plan Your Applications",
    subtitle: "Stay organized from start to finish",
    icon: Calendar,
    gradient: "from-[#c88c24] to-[#91682b]",
    description: "Track every deadline, requirement, and document across all your schools. Never miss an important date or submission.",
    features: [
      "Application deadline tracker",
      "Essay prompts and requirements",
      "Document checklist (transcripts, letters, etc.)",
      "Automated reminders via email",
      "Progress tracking for each school",
    ],
    details: [
      { label: "Tracked Items", value: "Unlimited" },
      { label: "Reminders", value: "Email + in-app" },
      { label: "Collaboration", value: "Share with counselors/parents" },
    ],
  },
  {
    number: "04",
    title: "Write Better Essays",
    subtitle: "Get expert feedback in seconds",
    icon: PenTool,
    gradient: "from-emerald-500 to-green-600",
    description: "Upload your essays and get instant feedback on structure, clarity, grammar, and impact. See before/after comparisons and specific improvement suggestions.",
    features: [
      "Essay scoring (0-100 scale)",
      "Specific rewrite suggestions",
      "Grammar and style recommendations",
      "Before/after comparison",
      "Unlimited revisions (Pro plan)",
    ],
    details: [
      { label: "Feedback Time", value: "Under 10 seconds" },
      { label: "Essay Types", value: "Common App, supplements, UC PIQs" },
      { label: "Revisions", value: "Unlimited (Pro)" },
    ],
  },
  {
    number: "05",
    title: "Calculate Real Costs",
    subtitle: "Understand your financial aid options",
    icon: DollarSign,
    gradient: "from-pink-500 to-rose-600",
    description: "Estimate your Expected Family Contribution (EFC) and compare real costs across schools. See merit aid, need-based aid, and out-of-pocket expenses.",
    features: [
      "EFC calculator",
      "School-by-school cost comparison",
      "Merit aid estimator",
      "Need-based aid breakdown",
      "Net price calculator",
    ],
    details: [
      { label: "Accuracy", value: "Based on federal methodology" },
      { label: "Comparison", value: "Side-by-side for all schools" },
      { label: "Updates", value: "Reflects current aid policies" },
    ],
  },
  {
    number: "06",
    title: "Build Your Activity Roadmap",
    subtitle: "Plan your high school journey",
    icon: MapPin,
    gradient: "from-indigo-500 to-purple-600",
    description: "Get a personalized year-by-year roadmap for building a strong college application from freshman year through senior year.",
    features: [
      "Year-by-year activity suggestions",
      "Leadership opportunity recommendations",
      "Summer program ideas",
      "Standardized test timeline",
      "Course selection guidance",
    ],
    details: [
      { label: "Planning Horizon", value: "4 years" },
      { label: "Personalization", value: "Based on your interests & goals" },
      { label: "Updates", value: "Adjust as your goals evolve" },
    ],
  },
];

const FAQ = [
  {
    q: "How accurate are the college recommendations?",
    a: "Our algorithm uses the same data points college admissions officers consider: GPA, test scores, course rigor, extracurriculars, and more. We analyze 300+ schools and provide probability-based recommendations. While no tool can guarantee admission, thousands of students have successfully used ClavisPrep to build balanced college lists.",
  },
  {
    q: "Can I update my profile as things change?",
    a: "Absolutely! Your profile is never locked. Update your GPA, test scores, activities, or preferences anytime. Your college recommendations will automatically update to reflect your current profile.",
  },
  {
    q: "How does the Essay Coach work?",
    a: "Upload your essay (Common App, UC PIQs, or supplements) and our tool analyzes structure, clarity, grammar, impact, and authenticity. You'll get a 0-100 score, specific suggestions, and before/after examples. Pro users get unlimited revisions.",
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. We never sell your data. Your essays, profile, and college list are private and encrypted. Only you (and people you explicitly share with) can see your information.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "Free gives you basic college matching (up to 20 schools) and a simple application tracker. Pro unlocks unlimited schools, Essay Coach, Financial Aid Calculator, Activity Roadmap, and priority support for $19.99/month.",
  },
  {
    q: "Can counselors or parents access my account?",
    a: "You control who sees your information. You can share your college list and application tracker with counselors or parents, but your essays and personal profile remain private unless you choose to share them.",
  },
];

export default function HowItWorks() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("🚀 Coming Soon!\n\nClavisPrep launches April 2026.\nSign up will be available soon!");
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      
      {/* Navigation - Same as Homepage */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-40">
            
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src="/logo.png" 
                alt="ClavisPrep Logo" 
                className="h-40 w-auto group-hover:scale-105 transition-transform"
              />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-sm font-medium text-[#0a1628] border-b-2 border-[#c88c24]">How It Works</Link>
              <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Pricing</Link>
              <a 
                href="#" 
                onClick={handleComingSoon}
                className="px-5 py-2 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1.5"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-[#0a1628]"
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Features</Link>
                <Link href="/how-it-works" className="text-sm font-medium text-[#0a1628] px-4 py-2">How It Works</Link>
                <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Pricing</Link>
                <a 
                  href="#" 
                  onClick={handleComingSoon}
                  className="mx-4 px-5 py-2.5 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg text-center"
                >
                  Get Started Free
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 lg:pt-56 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c88c24]/20 via-transparent to-transparent" />
        
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-[#c88c24]/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#e7bf69]" />
            <span className="text-xs font-semibold text-[#e7bf69] tracking-wide uppercase">Complete Guide</span>
          </div>

          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            How ClavisPrep Works
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            From profile to acceptance — here's exactly how ClavisPrep helps you find your perfect college, stay organized, and submit confident applications.
          </p>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">The Complete Process</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">
              Six steps to your perfect college
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need, organized in a simple step-by-step process
            </p>
          </div>

          <div className="space-y-24">
            {DETAILED_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              
              return (
                <div key={i} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                  
                  {/* Icon & Number Side */}
                  <div className="flex-shrink-0 w-full lg:w-1/3 text-center lg:text-left">
                    <div className={`w-24 h-24 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-xl`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-6xl font-bold bg-gradient-to-br from-[#c88c24] to-[#91682b] bg-clip-text text-transparent mb-4">
                      {step.number}
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-[#0a1628] mb-2">{step.title}</h3>
                    <p className="text-[#c88c24] font-medium">{step.subtitle}</p>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1">
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    <div className="bg-[#f5f0e8] rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#c88c24]" />
                        What You'll Get
                      </h4>
                      <ul className="space-y-2">
                        {step.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-[#c88c24] mt-1">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="text-center p-4 bg-white border border-slate-200 rounded-lg">
                          <div className="text-2xl font-bold text-[#0a1628] mb-1">{detail.value}</div>
                          <div className="text-xs text-slate-600">{detail.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Visual */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90 text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#e7bf69] uppercase tracking-wide mb-3">Your Timeline</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">From start to acceptance</h2>
            <p className="text-lg text-slate-300">The typical ClavisPrep journey</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#c88c24] to-[#91682b] hidden lg:block" />

            <div className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="flex-1 text-right hidden lg:block">
                  <h3 className="font-semibold text-xl mb-1">Day 1</h3>
                  <p className="text-slate-300 text-sm">Create account & complete profile quiz</p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center font-bold shadow-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1 lg:hidden">
                  <h3 className="font-semibold text-xl mb-1">Day 1</h3>
                  <p className="text-slate-300 text-sm">Create account & complete profile quiz</p>
                </div>
                <div className="flex-1 hidden lg:block" />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1 hidden lg:block" />
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center font-bold shadow-xl">
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-1">Week 1</h3>
                  <p className="text-slate-300 text-sm">Build college list, research schools, track deadlines</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1 text-right hidden lg:block">
                  <h3 className="font-semibold text-xl mb-1">Months 1-3</h3>
                  <p className="text-slate-300 text-sm">Write essays, get feedback, refine applications</p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center font-bold shadow-xl">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="flex-1 lg:hidden">
                  <h3 className="font-semibold text-xl mb-1">Months 1-3</h3>
                  <p className="text-slate-300 text-sm">Write essays, get feedback, refine applications</p>
                </div>
                <div className="flex-1 hidden lg:block" />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1 hidden lg:block" />
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center font-bold shadow-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-1">Months 3-6</h3>
                  <p className="text-slate-300 text-sm">Submit applications, compare financial aid offers</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1 text-right hidden lg:block">
                  <h3 className="font-semibold text-xl mb-1">Spring Decision</h3>
                  <p className="text-slate-300 text-sm">Get accepted, choose your college, celebrate!</p>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center font-bold shadow-xl">
                  🎓
                </div>
                <div className="flex-1 lg:hidden">
                  <h3 className="font-semibold text-xl mb-1">Spring Decision</h3>
                  <p className="text-slate-300 text-sm">Get accepted, choose your college, celebrate!</p>
                </div>
                <div className="flex-1 hidden lg:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Questions?</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#f5f0e8] transition-colors"
                >
                  <span className="font-semibold text-[#0a1628] pr-8">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#c88c24] flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-700 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-[#f5f0e8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90 rounded-3xl p-12 lg:p-16 text-center overflow-hidden shadow-2xl">
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#c88c24]/10 to-transparent" />
            
            <div className="relative">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Take the 5-minute quiz and get your personalized college list today — completely free.
              </p>
              
              <a 
                href="#"
                onClick={handleComingSoon}
                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Start Free — No Credit Card
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <p className="text-sm text-slate-400 mt-6">Takes 5 minutes · Free forever plan available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="ClavisPrep Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/#features" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-sm text-[#e7bf69]">How It Works</Link>
              <a href="#pricing" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Pricing</a>
              <a href="#blog" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Blog</a>
              <a href="#colleges" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Colleges</a>
              <a href="#terms" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Terms</a>
              <a href="#privacy" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Privacy</a>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-8">
            © 2026 ClavisPrep · The key to your college future
          </div>
        </div>
      </footer>

    </div>
  );
}