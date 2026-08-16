"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Settings, BookOpen, Target, FileText, Sparkles, CreditCard, Map, Search, Calculator, ClipboardList, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [managingBilling, setManagingBilling] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Get subscription data
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setSubscription(sub);
      }
      
      setLoading(false);
    };

    getUser();

    // Show success message if redirected from checkout
    if (searchParams.get('success')) {
      alert('🎉 Welcome to ClavisPrep Pro! Your subscription is now active.');
      router.replace('/dashboard');
    }
    if (searchParams.get('canceled')) {
      alert('Checkout canceled. No charges were made.');
      router.replace('/dashboard');
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session');
        setUpgrading(false);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Error upgrading to Pro');
      setUpgrading(false);
    }
  };

  const handleManageBilling = async () => {
    setManagingBilling(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error opening billing portal');
        setManagingBilling(false);
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      alert('Error opening billing portal');
      setManagingBilling(false);
    }
  };

  const handleSyncSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/sync', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Subscription synced successfully!');
        window.location.reload();
      } else {
        alert('No active subscription found in Stripe');
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Error syncing subscription');
    }
  };

  const isPro = subscription?.status === 'active' || subscription?.status === 'trialing';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#c88c24] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ClavisPrep Logo" className="h-12 w-auto" />
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-slate-600 hover:text-[#0a1628]">Home</Link>
              {!isPro && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUpgrade}
                    className="px-4 py-2 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Upgrade to Pro
                  </button>
                  <button
                    onClick={handleSyncSubscription}
                    className="px-4 py-2 border-2 border-[#c88c24] text-[#c88c24] text-sm font-semibold rounded-lg hover:bg-[#c88c24] hover:text-white transition-all"
                  >
                    Sync
                  </button>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-4xl font-bold text-[#0a1628]">
              Welcome back, {user?.user_metadata?.full_name || "Student"}!
            </h1>
            {isPro && (
              <span className="px-3 py-1 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                PRO
              </span>
            )}
          </div>
          <p className="text-lg text-slate-600">Let's continue your college prep journey</p>
        </div>

        {/* Upgrade Banner for Free Users */}
        {!isPro && (
          <div className="mb-8 p-5 bg-gradient-to-r from-[#c88c24] to-[#91682b] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="font-serif text-xl font-bold">Unlock all tools with Pro</h3>
              <p className="text-white/80 text-sm">Get your full college list, local activity roadmap, scholarship database, financial-aid calculator, and AI essay reviewer for $19.99/month</p>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="shrink-0 px-6 py-3 bg-white text-[#0a1628] font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {upgrading ? "Loading..." : "Upgrade to Pro"}
              {!upgrading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          {/* College Organizer */}
          <Link href="/organizer" className="group bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Your Home Base</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">College Organizer</h3>
            <p className="text-slate-600 mb-4">Colleges, deadlines, essays, scholarships, aid offers, accomplishments, and family progress</p>
            <span className="text-blue-700 font-semibold group-hover:text-blue-900 transition-colors">Open Organizer →</span>
          </Link>

          {/* 1. 5-Year Roadmap */}
          <Link href="/roadmap" className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#c88c24] to-[#91682b] flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Start Here</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">5-Year Roadmap</h3>
            <p className="text-slate-600 mb-4">Personalized extracurricular and activity planning</p>
            <span className="text-[#c88c24] font-semibold group-hover:text-[#91682b] transition-colors">
              Build Roadmap →
            </span>
          </Link>

          {/* 2. Scholarship Finder */}
          <Link href="/scholarships" className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#c88c24] to-[#91682b] flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">New</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Scholarship Finder</h3>
            <p className="text-slate-600 mb-4">AI-powered scholarship discovery for your profile</p>
            <span className="text-[#c88c24] font-semibold group-hover:text-[#91682b] transition-colors">Find Scholarships →</span>
          </Link>

          {/* 3. College Match */}
          <Link href="/college-match" className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#c88c24] to-[#91682b] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Free</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">College Match</h3>
            <p className="text-slate-600 mb-4">Find colleges that fit your profile and goals</p>
            <span className="text-[#c88c24] font-semibold group-hover:text-[#91682b] transition-colors">
              Start Matching →
            </span>
          </Link>

          {/* 4. Essay Coach (Pro) */}
          {isPro ? (
            <Link href="/essay-coach" className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#c88c24] to-[#91682b] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Pro
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Essay Coach</h3>
              <p className="text-slate-600 mb-4">Get AI feedback on your personal statement</p>
              <span className="text-[#c88c24] font-semibold group-hover:text-[#91682b] transition-colors">
                Write Essay →
              </span>
            </Link>
          ) : (
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Pro
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Essay Coach</h3>
              <p className="text-slate-600 mb-4">Get AI feedback on your personal statement</p>
              <button onClick={handleUpgrade} className="text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors">
                Upgrade to Unlock →
              </button>
            </div>
          )}

          {/* 5. Net Price Calculator (Pro) */}
          {isPro ? (
            <Link href="/calculator" className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#c88c24] to-[#91682b] flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Pro
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Net Price Calculator</h3>
              <p className="text-slate-600 mb-4">Estimate your real cost of attendance</p>
              <span className="text-[#c88c24] font-semibold group-hover:text-[#91682b] transition-colors">
                Calculate Cost →
              </span>
            </Link>
          ) : (
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-slate-400" />
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Pro
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Net Price Calculator</h3>
              <p className="text-slate-600 mb-4">Estimate your real cost of attendance</p>
              <button onClick={handleUpgrade} className="text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors">
                Upgrade to Unlock →
              </button>
            </div>
          )}

          {/* 6. Application Tracker */}
          <Link href="/dashboard/applications" className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#c88c24] to-[#91682b] flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Free</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2">Application Tracker</h3>
            <p className="text-slate-600 mb-4">Track deadlines, requirements, and submissions</p>
            <span className="text-[#c88c24] font-semibold group-hover:text-[#91682b] transition-colors">
              View Tracker →
            </span>
          </Link>

        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#c88c24] to-[#91682b] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0a1628]">Your Account</h2>
              <p className="text-slate-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#f5f0e8] rounded-xl">
              <h3 className="font-semibold text-[#0a1628] mb-1">Plan</h3>
              {isPro ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-slate-600 font-bold">Pro Plan</p>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">Active</span>
                  </div>
                  {subscription?.current_period_end && (
                    <p className="text-xs text-slate-500">
                      Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    onClick={handleManageBilling}
                    disabled={managingBilling}
                    className="mt-3 flex items-center gap-2 text-sm text-[#c88c24] font-semibold hover:text-[#91682b]"
                  >
                    <CreditCard className="w-4 h-4" />
                    {managingBilling ? 'Loading...' : 'Manage Billing'}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-slate-600">Free Plan</p>
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="mt-2 text-sm text-[#c88c24] font-semibold hover:text-[#91682b] inline-block"
                  >
                    {upgrading ? 'Loading...' : 'Upgrade to Pro →'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#f5f0e8] rounded-xl">
              <h3 className="font-semibold text-[#0a1628] mb-1">Member Since</h3>
              <p className="text-slate-600">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button className="flex items-center gap-2 text-slate-600 hover:text-[#0a1628] transition-colors">
              <Settings className="w-5 h-5" />
              Account Settings
            </button>
          </div>
        </div>


      </main>

    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center"><p className="text-slate-600">Loading dashboard...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
