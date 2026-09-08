"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Target, PenTool, Calendar, DollarSign, MapPin, FileText, Check, ChevronDown } from "lucide-react";

export default function FeaturesPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SCROLL TO HASH - SIMPLE AND RELIABLE
  useEffect(() => {
    const scrollToSection = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    setTimeout(scrollToSection, 100);
    setTimeout(scrollToSection, 300);
    setTimeout(scrollToSection, 600);
  }, []);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("🚀 Coming Soon!\n\nClavisPrep launches April 2026.\nSign up will be available soon!");
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-40">
            
            <a href="/" className="flex items-center gap-2 group">
              <img 
                src="/logo.png" 
                alt="ClavisPrep Logo" 
                className="h-40 w-auto group-hover:scale-105 transition-transform"
              />
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="/#features" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Features</a>
              <a href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">How It Works</a>
              <a href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Pricing</a>
              <a href="/#testimonials" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Testimonials</a>
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
                <a href="/#features" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Features</a>
                <a href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">How It Works</a>
                <a href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Pricing</a>
                <a href="/#testimonials" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Testimonials</a>
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

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c88c24]/10 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-4">
            Everything You Need to Get Accepted
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Six powerful tools designed to replace expensive college counselors — at a fraction of the cost.
          </p>
        </div>
      </section>

      <section id="college-match" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-4xl font-bold text-[#0a1628] mb-4">Smart College Match</h2>
              <p className="text-lg text-[#c88c24] mb-6">Find your perfect fit in 5 minutes</p>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Our 15-question quiz analyzes your GPA, test scores, interests, budget, and location preferences to build a personalized list of reach, match, and safety schools. No more endless Googling or overwhelming spreadsheets.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">300+ colleges ranked by fit score</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Reach, match, and safety categories</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Instant results — no waiting</span>
                </div>
              </div>

              <a 
                href="#" 
                onClick={handleComingSoon}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Try College Match
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#f5f0e8] to-white p-8 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-4">Perfect For:</h3>
              <ul className="space-y-3 text-slate-600">
                <li>• Juniors starting their college search</li>
                <li>• Students overwhelmed by too many options</li>
                <li>• Families without access to college counselors</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section id="essay-coach" className="py-20 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 lg:order-1 bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-4">Perfect For:</h3>
              <ul className="space-y-3 text-slate-600">
                <li>• Students without access to essay tutors</li>
                <li>• Anyone struggling with writer's block</li>
                <li>• Seniors polishing their Common App essays</li>
              </ul>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-4xl font-bold text-[#0a1628] mb-4">Essay Coach</h2>
              <p className="text-lg text-[#c88c24] mb-6">Get expert feedback in seconds</p>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Paste your essay and get instant scores on clarity, originality, voice, and structure. Our Essay Coach analyzes thousands of successful college essays to give you specific, actionable feedback — not generic advice.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Instant feedback on tone, structure, and voice</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Before/after comparisons with rewrite suggestions</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Unlimited revisions (Pro)</span>
                </div>
              </div>

              <a 
                href="#" 
                onClick={handleComingSoon}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Try Essay Coach
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      <section id="application-tracker" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-4xl font-bold text-[#0a1628] mb-4">Application Tracker</h2>
              <p className="text-lg text-[#c88c24] mb-6">Never miss a deadline again</p>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Track every school, essay, recommendation, and deadline in one organized dashboard. Get reminders 2 weeks, 1 week, and 3 days before each deadline. See your progress at a glance with visual timelines.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Visual timeline for each application</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Automatic deadline reminders via email & SMS</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Track recommendations and test scores</span>
                </div>
              </div>

              <a 
                href="#" 
                onClick={handleComingSoon}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Try Application Tracker
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#f5f0e8] to-white p-8 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-4">Perfect For:</h3>
              <ul className="space-y-3 text-slate-600">
                <li>• Seniors applying to 10+ colleges</li>
                <li>• Students juggling school, sports, and apps</li>
                <li>• Anyone stressed about missing deadlines</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section id="financial-aid" className="py-20 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 lg:order-1 bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-4">Perfect For:</h3>
              <ul className="space-y-3 text-slate-600">
                <li>• Families comparing financial aid packages</li>
                <li>• Students choosing between acceptance letters</li>
                <li>• Anyone trying to understand true college costs</li>
              </ul>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-4xl font-bold text-[#0a1628] mb-4">Financial Aid Calculator</h2>
              <p className="text-lg text-[#c88c24] mb-6">See your real cost at every school</p>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Input your family income once and instantly see your estimated Expected Family Contribution (EFC) and net price at every college on your list. Compare real costs side-by-side — not just sticker prices.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Estimate your EFC using federal formulas</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Compare net prices across all schools</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">See which schools offer best value</span>
                </div>
              </div>

              <a 
                href="#" 
                onClick={handleComingSoon}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Try Financial Aid Calculator
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      <section id="activity-roadmap" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-4xl font-bold text-[#0a1628] mb-4">Activity Roadmap</h2>
              <p className="text-lg text-[#c88c24] mb-6">Build your application from freshman year</p>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Get a personalized 4-year plan based on your interests and target schools. Know exactly which clubs, leadership roles, summer programs, and experiences to pursue each year to build a compelling application.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Year-by-year activity suggestions (9th-12th grade)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Summer program recommendations</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Leadership and service opportunities</span>
                </div>
              </div>

              <a 
                href="#" 
                onClick={handleComingSoon}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Try Activity Roadmap
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#f5f0e8] to-white p-8 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-4">Perfect For:</h3>
              <ul className="space-y-3 text-slate-600">
                <li>• Freshmen and sophomores planning ahead</li>
                <li>• Students unsure what activities to join</li>
                <li>• Parents helping kids build strong profiles</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section id="document-storage" className="py-20 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 lg:order-1 bg-white p-8 rounded-2xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-4">Perfect For:</h3>
              <ul className="space-y-3 text-slate-600">
                <li>• Students managing multiple essay drafts</li>
                <li>• Families keeping transcripts organized</li>
                <li>• Anyone tired of searching through email</li>
              </ul>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-4xl font-bold text-[#0a1628] mb-4">Document Storage</h2>
              <p className="text-lg text-[#c88c24] mb-6">Keep everything organized in one place</p>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Upload and organize all your application materials — essays, transcripts, test scores, recommendation letters, and financial documents. Access everything from any device with automatic cloud backup and version control.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Secure cloud storage for all documents</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Version control for essay drafts</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] mt-0.5" />
                  <span className="text-slate-700">Access from any device</span>
                </div>
              </div>

              <a 
                href="#" 
                onClick={handleComingSoon}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Try Document Storage
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90 rounded-3xl p-12 lg:p-16 text-center overflow-hidden shadow-2xl">
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#c88c24]/10 to-transparent" />
            
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center shadow-xl">
                <span className="text-3xl">🗝</span>
              </div>
              
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to start your college journey?
              </h2>
              
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Get access to all 6 features — from college matching to essay feedback to application tracking.
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
              <a href="/#features" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Features</a>
              <a href="/#blog" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Blog</a>
              <a href="/#colleges" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Colleges</a>
              <a href="/#terms" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Terms</a>
              <a href="/#privacy" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Privacy</a>
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