"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, X, Sparkles, ChevronDown, Zap, Shield, Users, Target } from "lucide-react";

const FEATURES_COMPARISON = [
  { category: "College Matching", features: [
    { name: "Profile quiz (16 questions)", free: true, pro: true },
    { name: "College recommendations", free: "3 schools", pro: "Full 9-school list" },
    { name: "Reach/Match/Safety categories", free: true, pro: true },
    { name: "Acceptance probability", free: true, pro: true },
    { name: "Detailed match reasoning", free: false, pro: true },
    { name: "Custom filters & sorting", free: false, pro: true },
  ]},
  { category: "Application Tracking", features: [
    { name: "Deadline tracker", free: true, pro: true },
    { name: "Email reminders", free: true, pro: true },
    { name: "Document checklist", free: "Basic", pro: "Advanced" },
    { name: "Progress dashboard", free: false, pro: true },
    { name: "Share with counselors/parents", free: false, pro: true },
  ]},
  { category: "Essay Coach", features: [
    { name: "Essay uploads", free: false, pro: true },
    { name: "AI feedback & scoring", free: false, pro: true },
    { name: "Rewrite suggestions", free: false, pro: true },
    { name: "Before/after comparisons", free: false, pro: true },
    { name: "Unlimited revisions", free: false, pro: true },
    { name: "Grammar & style checks", free: false, pro: true },
  ]},
  { category: "Financial Planning", features: [
    { name: "Basic cost estimates", free: true, pro: true },
    { name: "EFC calculator", free: false, pro: true },
    { name: "School-by-school comparison", free: false, pro: true },
    { name: "Merit aid estimator", free: false, pro: true },
    { name: "Net price calculator", free: false, pro: true },
  ]},
  { category: "Scholarships", features: [
    { name: "Verified scholarship database", free: false, pro: true },
    { name: "Profile-based scholarship matches", free: false, pro: true },
    { name: "Official application links", free: false, pro: true },
    { name: "Deadline and eligibility tracking", free: false, pro: true },
  ]},
  { category: "Activity Planning", features: [
    { name: "Activity suggestions", free: false, pro: true },
    { name: "Year-by-year roadmap", free: false, pro: true },
    { name: "Leadership opportunities", free: false, pro: true },
    { name: "Summer program ideas", free: false, pro: true },
    { name: "Nearby programs with official links", free: false, pro: true },
  ]},
  { category: "Support", features: [
    { name: "Email support", free: "Standard", pro: "Priority" },
    { name: "Response time", free: "48 hours", pro: "24 hours" },
    { name: "Video tutorials", free: true, pro: true },
    { name: "Live chat support", free: false, pro: true },
  ]},
];

const FAQ = [
  {
    q: "Can I start with Free and upgrade later?",
    a: "Absolutely! Start with our free plan to explore the platform. When you're ready for advanced features like Essay Coach and Financial Aid Calculator, upgrade to Pro anytime. Your college list and data carry over seamlessly.",
  },
  {
    q: "Is there a long-term commitment?",
    a: "No contracts or commitments. Pro is month-to-month at $19.99. Cancel anytime with one click. If you cancel, you'll keep Pro access until the end of your billing period, then automatically switch to Free.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and debit cards. Payment is processed securely through Stripe.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes! If you're not satisfied within the first 7 days of upgrading to Pro, we'll issue a full refund — no questions asked. Just email support@clavisprep.com.",
  },
  {
    q: "Can multiple students use one Pro account?",
    a: "Each Pro subscription is for one student. However, we offer family discounts for siblings! Contact us at support@clavisprep.com for details.",
  },
  {
    q: "Do counselors or schools get discounts?",
    a: "Yes! We offer special pricing for school counselors and educational institutions. Email partnerships@clavisprep.com for institutional pricing.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data stays safe. If you cancel Pro, you'll automatically switch to the Free plan. Your college list and profile remain accessible. Essay feedback and advanced features will be locked but not deleted.",
  },
  {
    q: "How does ClavisPrep compare to hiring a private counselor?",
    a: "Private college counselors typically cost $3,000-$10,000. ClavisPrep Pro gives you many of the same tools (college matching, essay feedback, deadline tracking) for just $19.99/month. While we can't replace personalized human guidance, we make expert-level tools accessible to every student.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. We never store your credit card details. All payments are processed through Stripe, a PCI-compliant payment processor trusted by millions of businesses worldwide.",
  },
  {
    q: "Can I switch from monthly to annual billing?",
    a: "We currently only offer monthly billing at $19.99/month. Annual billing may be introduced in the future — we'll notify all users if this becomes available.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Pro was worth every penny. The Essay Coach alone saved me hundreds on editing services.",
    author: "Marcus T.",
    role: "Stanford '28",
    plan: "Pro",
  },
  {
    quote: "Started with Free to test it out. Upgraded to Pro after a week — couldn't live without the financial aid calculator.",
    author: "Priya K.",
    role: "UC Berkeley '27",
    plan: "Pro",
  },
  {
    quote: "The free plan gave me a great college list. Upgrading to Pro helped me stay organized through the entire application season.",
    author: "Jordan L.",
    role: "Duke '28",
    plan: "Pro",
  },
];

export default function Pricing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

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
      
      {/* Navigation */}
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
              <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">How It Works</Link>
              <Link href="/pricing" className="text-sm font-medium text-[#0a1628] border-b-2 border-[#c88c24]">Pricing</Link>
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
                <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">How It Works</Link>
                <Link href="/pricing" className="text-sm font-medium text-[#0a1628] px-4 py-2">Pricing</Link>
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f0e8] via-white to-[#e7bf69]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#e7bf69]/30 via-transparent to-transparent" />
        
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#c88c24] rounded-full mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#c88c24]" />
            <span className="text-xs font-semibold text-[#91682b] tracking-wide uppercase">Simple Pricing</span>
          </div>

          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-[#0a1628] leading-tight mb-6">
            Start free, upgrade anytime
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Get started with our free plan. Upgrade to Pro when you're ready for advanced features like Essay Coach and Financial Aid Calculator.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#c88c24]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#c88c24]" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#c88c24]" />
              <span>Trusted by 10,000+ students</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Free Plan */}
            <div className="bg-[#f5f0e8] p-8 lg:p-10 rounded-3xl border-2 border-slate-200 hover:border-[#c88c24] transition-all hover:shadow-xl">
              <div className="mb-6">
                <h3 className="font-serif text-3xl font-bold text-[#0a1628] mb-2">Free</h3>
                <p className="text-slate-600">Perfect for getting started</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-[#0a1628]">$0</span>
                <span className="text-slate-600 text-lg">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Profile quiz & college matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Up to 20 college recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Basic application tracker</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Email deadline reminders</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Basic cost estimates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#c88c24] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Standard email support</span>
                </li>
              </ul>

              <a 
                href="#"
                onClick={handleComingSoon}
                className="block w-full px-6 py-4 bg-white border-2 border-[#c88c24] text-[#0a1628] font-semibold rounded-xl text-center hover:bg-[#f5f0e8] transition-all hover:shadow-md"
              >
                Get Started Free
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90 p-8 lg:p-10 rounded-3xl border-2 border-[#c88c24] relative shadow-2xl transform lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-serif text-3xl font-bold text-white mb-2">Pro</h3>
                <p className="text-slate-300">Everything you need to succeed</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$19.99</span>
                <span className="text-slate-300 text-lg">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Everything in Free, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white">Unlimited college recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white">Essay Coach with AI feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white">Unlimited essay revisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white">Financial aid calculator & comparison</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white">Personalized activity roadmap</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white">Advanced application dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white">Priority support (24hr response)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#e7bf69] flex-shrink-0 mt-0.5" />
                  <span className="text-white">Share with counselors & parents</span>
                </li>
              </ul>

              <a 
                href="#"
                onClick={handleComingSoon}
                className="block w-full px-6 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold rounded-xl text-center hover:shadow-2xl transition-all hover:scale-105"
              >
                Start Pro Trial
              </a>

              <p className="text-center text-sm text-slate-400 mt-4">7-day money-back guarantee</p>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 lg:py-28 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">
              Compare plans in detail
            </h2>
            <p className="text-lg text-slate-600">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-[#0a1628] text-white">
              <div className="font-semibold">Features</div>
              <div className="text-center font-semibold">Free</div>
              <div className="text-center font-semibold">Pro</div>
            </div>

            {/* Table Body */}
            {FEATURES_COMPARISON.map((category, catIdx) => (
              <div key={catIdx}>
                <div className="px-6 py-4 bg-gradient-to-r from-[#e7bf69]/20 to-transparent border-t border-slate-200">
                  <h3 className="font-bold text-[#0a1628]">{category.category}</h3>
                </div>
                {category.features.map((feature, featIdx) => (
                  <div key={featIdx} className="grid grid-cols-3 gap-4 px-6 py-4 border-t border-slate-200 hover:bg-[#f5f0e8] transition-colors">
                    <div className="text-slate-700">{feature.name}</div>
                    <div className="text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-[#c88c24] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-slate-600">{feature.free}</span>
                      )}
                    </div>
                    <div className="text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-[#c88c24] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-slate-600">{feature.pro}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Student Reviews</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628]">
              What Pro users are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-[#f5f0e8] p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold rounded-full">
                    {testimonial.plan}
                  </span>
                </div>
                
                <p className="text-slate-700 leading-relaxed mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                
                <div>
                  <div className="font-semibold text-[#0a1628]">{testimonial.author}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-[#f5f0e8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Questions?</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">
              Pricing FAQ
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-4">
            {FAQ.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#f5f0e8] transition-colors"
                >
                  <span className="font-semibold text-[#0a1628] pr-8">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#c88c24] flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-700 leading-relaxed border-t border-slate-100">
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90 rounded-3xl p-12 lg:p-16 text-center overflow-hidden shadow-2xl">
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#c88c24]/10 to-transparent" />
            
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center shadow-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Start with our free plan today. No credit card required. Upgrade to Pro anytime.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="#"
                  onClick={handleComingSoon}
                  className="px-10 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  Start Free
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="#"
                  onClick={handleComingSoon}
                  className="px-10 py-4 bg-white text-[#0a1628] font-bold text-lg rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Try Pro Free
                </a>
              </div>
              
              <p className="text-sm text-slate-400 mt-6">Takes 5 minutes · Cancel anytime · 7-day money-back guarantee</p>
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
              <Link href="/how-it-works" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">How It Works</Link>
              <Link href="/pricing" className="text-sm text-[#e7bf69]">Pricing</Link>
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
