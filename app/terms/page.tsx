"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Shield } from "lucide-react";

export default function Terms() {
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
            <Shield className="w-4 h-4 text-[#e7bf69]" />
            <span className="text-xs font-semibold text-[#e7bf69] tracking-wide uppercase">Legal</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">Terms of Service</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">Last updated: April 11, 2026</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-[#c88c24]/10 to-[#91682b]/10 border border-[#c88c24]/20 rounded-2xl p-8 mb-12">
            <p className="text-lg text-slate-700 leading-relaxed">
              Welcome to ClavisPrep. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            
            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                By creating an account or using ClavisPrep's services, you confirm that you are at least 13 years old (or the age of majority in your jurisdiction) and have the legal capacity to enter into these Terms. If you are under 18, you represent that you have obtained consent from a parent or legal guardian.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective upon posting to our website. Your continued use of ClavisPrep after any changes constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">2. Description of Service</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                ClavisPrep is a college preparation platform that provides tools, resources, and guidance to help students navigate the college admissions process. Our services include but are not limited to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>College search and match tools</li>
                <li>Application tracking and management</li>
                <li>Essay guidance and review tools</li>
                <li>Financial aid calculators</li>
                <li>Activity planning and organization</li>
                <li>Document storage and management</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                We offer both free and paid subscription plans. Features and limitations vary by plan type. We reserve the right to modify, suspend, or discontinue any aspect of our service at any time.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">3. User Accounts and Responsibilities</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                You may not share your account credentials, create multiple accounts, or use another person's account without permission.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">4. Acceptable Use Policy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You agree not to use ClavisPrep to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Upload or transmit viruses, malware, or harmful code</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Submit false or misleading information in college applications</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated systems or bots to access the service</li>
                <li>Resell or redistribute our content or services</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">5. Intellectual Property</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                All content on ClavisPrep, including text, graphics, logos, software, and design, is owned by ClavisPrep or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                You retain ownership of content you submit to ClavisPrep (such as essays or personal information). By submitting content, you grant us a limited license to use, store, and display that content solely to provide our services to you.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You may not copy, modify, distribute, or create derivative works from our content without express written permission.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">6. Payment and Subscriptions</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Paid subscriptions are billed in advance on a monthly or annual basis. By subscribing, you authorize us to charge your payment method on a recurring basis until you cancel.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. We do not provide refunds for partial months or unused portions of annual subscriptions.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to modify pricing with 30 days' notice. Price changes will not affect your current billing period.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">7. Educational Guidance Disclaimer</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                ClavisPrep provides educational tools and general guidance. We are not a substitute for professional college counseling or admissions consulting services. Our recommendations are based on publicly available data and algorithms and should not be considered guarantees of admission to any institution.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You are solely responsible for the accuracy of information you submit in college applications. ClavisPrep is not responsible for application outcomes or admissions decisions.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, ClavisPrep shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Your use or inability to use the service</li>
                <li>Unauthorized access to your data or account</li>
                <li>Service interruptions or errors</li>
                <li>College admission outcomes</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Our total liability shall not exceed the amount you paid to ClavisPrep in the 12 months preceding the claim.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">9. Termination</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You may terminate your account at any time by contacting us. Upon termination, your right to access the service will immediately cease. We may retain certain information as required by law or for legitimate business purposes.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">10. Dispute Resolution</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                These Terms shall be governed by the laws of the State of California, without regard to conflict of law principles.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Any disputes arising from these Terms or your use of ClavisPrep shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">11. Contact Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-[#f5f0e8] rounded-xl p-6 border border-slate-200">
                <p className="text-slate-700 mb-2">
                  <strong className="text-[#0a1628]">Email:</strong> legal@clavisprep.com
                </p>
                <p className="text-slate-700 mb-2">
                  <strong className="text-[#0a1628]">Mail:</strong> ClavisPrep Legal Department<br />
                  123 Market Street, Suite 400<br />
                  San Francisco, CA 94103
                </p>
              </div>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href="/privacy" className="text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors flex items-center gap-2">
                Questions? Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
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
              <Link href="/terms" className="text-sm text-[#e7bf69]">Terms</Link>
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Privacy</Link>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-8">© 2026 ClavisPrep · The key to your college future</div>
        </div>
      </footer>

    </div>
  );
}