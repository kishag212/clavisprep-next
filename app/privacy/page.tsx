"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Lock } from "lucide-react";

export default function Privacy() {
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
            <Lock className="w-4 h-4 text-[#e7bf69]" />
            <span className="text-xs font-semibold text-[#e7bf69] tracking-wide uppercase">Your Privacy Matters</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">Privacy Policy</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">Last updated: April 11, 2026</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-[#c88c24]/10 to-[#91682b]/10 border border-[#c88c24]/20 rounded-2xl p-8 mb-12">
            <p className="text-lg text-slate-700 leading-relaxed">
              At ClavisPrep, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            
            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">1. Information We Collect</h2>
              
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Information You Provide</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                When you create an account and use ClavisPrep, we collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Account information (name, email address, password)</li>
                <li>Profile information (grade level, school, academic interests)</li>
                <li>College application materials (essays, activity descriptions)</li>
                <li>Academic information (GPA, test scores, coursework)</li>
                <li>Payment information (processed securely through our payment processor)</li>
                <li>Communications with us (support inquiries, feedback)</li>
              </ul>

              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Information Collected Automatically</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                When you use ClavisPrep, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Device information (browser type, operating system, IP address)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log data (access times, error logs)</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and manage your account</li>
                <li>Personalize your experience and provide tailored recommendations</li>
                <li>Process payments and subscriptions</li>
                <li>Send you service updates, newsletters, and promotional materials (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">3. How We Share Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Service Providers</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We work with third-party service providers who perform services on our behalf, such as payment processing, data analytics, email delivery, hosting services, and customer support. These providers have access to your information only to perform specific tasks and are obligated to protect your data.
              </p>

              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Legal Requirements</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may disclose your information if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of ClavisPrep, our users, or others.
              </p>

              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Business Transfers</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                If ClavisPrep is involved in a merger, acquisition, or sale of assets, your information may be transferred. We will provide notice before your information is transferred and becomes subject to a different privacy policy.
              </p>

              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">With Your Consent</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may share your information with your explicit consent, such as when you choose to share your profile or application materials with colleges or counselors.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">4. Data Security</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure data centers with physical security measures</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">5. Your Rights and Choices</h2>
              
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Access and Correction</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                You can access and update most of your personal information by logging into your account. If you need assistance, contact us at privacy@clavisprep.com.
              </p>

              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Data Deletion</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                You may request deletion of your account and personal information at any time. We will delete your data within 30 days, except where we are required to retain it for legal or legitimate business purposes.
              </p>

              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Marketing Communications</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                You can opt out of promotional emails by clicking the "unsubscribe" link in any marketing email or by updating your account preferences. You will continue to receive transactional emails related to your account and services.
              </p>

              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">Cookies and Tracking</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Most web browsers are set to accept cookies by default. You can configure your browser to refuse cookies or alert you when cookies are being sent. Note that some features of ClavisPrep may not function properly without cookies.
              </p>

              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-3 mt-6">California Privacy Rights</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete personal information, and the right to opt-out of the sale of personal information (we do not sell personal information).
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">6. Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                ClavisPrep is designed for students aged 13 and older. We comply with the Children's Online Privacy Protection Act (COPPA). If we learn that we have collected personal information from a child under 13 without parental consent, we will delete that information promptly.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For users aged 13-17, we encourage parents and guardians to be involved in their child's use of ClavisPrep and to review this Privacy Policy with them.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">7. International Data Transfers</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                ClavisPrep is based in the United States. If you access our services from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
              </p>
              <p className="text-slate-700 leading-relaxed">
                By using ClavisPrep, you consent to the transfer of your information to the United States and other countries where we operate.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">8. Data Retention</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We retain your personal information for as long as your account is active or as needed to provide you services. We may retain certain information after account deletion for legitimate business purposes or as required by law, such as:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Completing transactions or fulfilling contracts</li>
                <li>Complying with legal obligations</li>
                <li>Resolving disputes and enforcing agreements</li>
                <li>Fraud prevention and security</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">9. Third-Party Links and Services</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                ClavisPrep may contain links to third-party websites or integrate with third-party services. This Privacy Policy does not apply to those external sites or services. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of ClavisPrep after changes are posted constitutes your acceptance of the updated Privacy Policy.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-4">11. Contact Us</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-[#f5f0e8] rounded-xl p-6 border border-slate-200">
                <p className="text-slate-700 mb-2">
                  <strong className="text-[#0a1628]">Privacy Team:</strong> privacy@clavisprep.com
                </p>
                <p className="text-slate-700 mb-2">
                  <strong className="text-[#0a1628]">Data Protection Officer:</strong> dpo@clavisprep.com
                </p>
                <p className="text-slate-700">
                  <strong className="text-[#0a1628]">Mail:</strong> ClavisPrep Privacy Team<br />
                  123 Market Street, Suite 400<br />
                  San Francisco, CA 94103
                </p>
              </div>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href="/terms" className="text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Terms of Service
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
              <Link href="/terms" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Terms</Link>
              <Link href="/privacy" className="text-sm text-[#e7bf69]">Privacy</Link>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-8">© 2026 ClavisPrep · The key to your college future</div>
        </div>
      </footer>

    </div>
  );
}