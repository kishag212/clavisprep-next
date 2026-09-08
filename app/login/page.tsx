"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Login() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [nextPath, setNextPath] = useState("/dashboard");
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  useEffect(() => {
    const requestedPath = new URLSearchParams(window.location.search).get("next");
    if (requestedPath?.startsWith("/") && !requestedPath.startsWith("//")) {
      setNextPath(requestedPath);
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "", general: "" });
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrors({ ...errors, general: error.message });
        setIsSubmitting(false);
        return;
      }

      router.replace(nextPath);
      
    } catch (error: any) {
      setErrors({ ...errors, general: error.message || "An error occurred" });
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (error) {
        alert(`Google Sign-In error: ${error.message}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      
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
              <Link href="/signup" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1.5">
                Sign Up Free
                <ArrowRight className="w-4 h-4" />
              </Link>
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
                <Link href="/signup" className="mx-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg text-center">Sign Up Free</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-48 pb-20 lg:pt-56 lg:pb-28">
        <div className="max-w-md mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-200">✓</div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a2458] mb-4">Welcome back</h1>
            <p className="text-lg text-slate-600">Sign in to continue your personalized college plan.</p>
            {nextPath === "/roadmap" && <p className="mt-3 text-sm font-semibold text-blue-700">Your Activity Roadmap is ready when you sign in.</p>}
          </div>

          <div className="bg-white/95 rounded-3xl shadow-2xl shadow-blue-100 border border-blue-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.general}</p>
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
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-blue-50/50 border ${errors.email ? "border-red-500" : "border-blue-100"} rounded-xl text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#0a1628] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 bg-blue-50/50 border ${errors.password ? "border-red-500" : "border-blue-100"} rounded-xl text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#0a1628] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border-2 border-slate-300 rounded bg-[#f5f0e8] checked:bg-gradient-to-r checked:from-[#c88c24] checked:to-[#91682b] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:ring-offset-2 cursor-pointer transition-all"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>

                <Link href="/reset-password" className="text-sm text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Logging In..." : "Log In"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>

            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-blue-100 rounded-xl font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-400 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors">
                  Sign up for free
                </Link>
              </p>
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
