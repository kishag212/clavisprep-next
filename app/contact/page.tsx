"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MessageSquare, Send, MapPin, Clock, Phone, ChevronDown } from "lucide-react";

export default function Contact() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("🚀 Coming Soon!\n\nClavisPrep launches April 2026.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      alert("✅ Message Received!\n\nThank you for contacting ClavisPrep. We'll get back to you within 24 hours.\n\nLaunch: April 2026");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
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
            <MessageSquare className="w-4 h-4 text-[#e7bf69]" />
            <span className="text-xs font-semibold text-[#e7bf69] tracking-wide uppercase">Get in Touch</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">We'd Love to Hear From You</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">Have questions about ClavisPrep? Want to partner with us? We're here to help.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-[#f5f0e8] to-white p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center mb-6 shadow-lg">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Email Us</h3>
              <p className="text-slate-600 mb-4">For general inquiries and support</p>
              <a href="mailto:hello@clavisprep.com" className="text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors">hello@clavisprep.com</a>
            </div>

            <div className="bg-gradient-to-br from-[#f5f0e8] to-white p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Response Time</h3>
              <p className="text-slate-600 mb-4">We typically respond within</p>
              <p className="text-[#0a1628] font-bold text-lg">24 hours</p>
            </div>

            <div className="bg-gradient-to-br from-[#f5f0e8] to-white p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Location</h3>
              <p className="text-slate-600 mb-4">Based in</p>
              <p className="text-[#0a1628] font-semibold">San Francisco, CA</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-sm font-semibold text-[#c88c24] uppercase tracking-wide mb-3">Send a Message</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-6">Let's Start a Conversation</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">Whether you're a student, parent, educator, or potential partner, we want to hear from you. Fill out the form and we'll get back to you as soon as possible.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#c88c24]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a1628] mb-1">General Inquiries</h4>
                    <p className="text-sm text-slate-600">Questions about our platform, features, or pricing</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#c88c24]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a1628] mb-1">Partnerships</h4>
                    <p className="text-sm text-slate-600">School districts, counseling organizations, or education partners</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#c88c24]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-2xl">📰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a1628] mb-1">Press & Media</h4>
                    <p className="text-sm text-slate-600">Media inquiries and press kit requests</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#c88c24]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-2xl">🛠️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a1628] mb-1">Technical Support</h4>
                    <p className="text-sm text-slate-600">Account issues, bugs, or technical questions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#0a1628] mb-2">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f0e8] border border-slate-200 rounded-lg text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#0a1628] mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f0e8] border border-slate-200 rounded-lg text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-[#0a1628] mb-2">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#f5f0e8] border border-slate-200 rounded-lg text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="press">Press & Media</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#0a1628] mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-[#f5f0e8] border border-slate-200 rounded-lg text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center">We'll respond within 24 hours during business days</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5f0e8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#0a1628] mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600 mb-12">Quick answers to common questions</p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-2">When does ClavisPrep launch?</h3>
              <p className="text-sm text-slate-600">We're launching in April 2026. Sign up to be notified!</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-2">Is there a free plan?</h3>
              <p className="text-sm text-slate-600">Yes! Our Free plan includes college search and basic tools.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-2">Do you offer school partnerships?</h3>
              <p className="text-sm text-slate-600">Absolutely! Contact us to discuss bulk licensing for schools.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-2">How is this different from other platforms?</h3>
              <p className="text-sm text-slate-600">We combine AI tools with proven college counseling strategies at an affordable price.</p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors">
              Visit our blog
              <ArrowRight className="w-4 h-4" />
            </Link>
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
              <Link href="/about" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">About</Link>
              <Link href="/contact" className="text-sm text-[#e7bf69]">Contact</Link>
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