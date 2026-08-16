"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Mail, ArrowLeft, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ResetPassword() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
        setIsSubmitting(false);
        return;
      }

      setEmailSent(true);
      setIsSubmitting(false);
      
    } catch (error: any) {
      setError(error.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setEmailSent(false);
    setEmail("");
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#c88c24] to-[#91682b] flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">Check Your Email</h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We've sent password reset instructions to <strong className="text-[#0a1628]">{email}</strong>
            </p>
            <p className="text-sm text-slate-500 mb-8">
              If you don't see the email, check your spam folder or request a new link below.
            </p>

            <div className="space-y-4">
              <Link
                href="/login"
                className="block w-full px-8 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Back to Login
              </Link>
              
              <button
                onClick={handleResend}
                className="block w-full px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-[#f5f0e8] hover:border-[#c88c24] transition-all"
              >
                Resend Email
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-8">
              Didn't receive the email? Contact us at{" "}
              <a href="mailto:support@clavisprep.com" className="text-[#c88c24] hover:text-[#91682b]">
                support@clavisprep.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Log In</Link>
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
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Log In</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-48 pb-20 lg:pt-56 lg:pb-28">
        <div className="max-w-md mx-auto px-6 lg:px-8">
          
          <Link href="/login" className="inline-flex items-center gap-2 text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-4">Reset Your Password</h1>
            <p className="text-lg text-slate-600">Enter your email and we'll send you reset instructions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0a1628] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-[#f5f0e8] border ${error ? "border-red-500" : "border-slate-200"} rounded-lg text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent transition-all`}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>

            </form>

            <div className="mt-8 p-4 bg-[#f5f0e8] rounded-xl border border-slate-200">
              <h3 className="font-semibold text-[#0a1628] mb-2 flex items-center gap-2">
                <span className="text-lg">💡</span>
                Helpful Tips
              </h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Check your spam folder if you don't see the email</li>
                <li>• The reset link expires in 1 hour</li>
                <li>• Use a strong password with 8+ characters</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Remember your password?{" "}
                <Link href="/login" className="text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 mb-4">Need more help?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors">
              Contact Support
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
              <Link href="/contact" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Contact</Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Terms</Link>
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Privacy</Link>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-8">© 2026 ClavisPrep · The key to your college future</div>
        </div>
      </footer>

    </div>
  );
}