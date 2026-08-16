"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Lock, Sparkles, MapPin, DollarSign, Users, GraduationCap, Crown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

/* ==========================================================================
   CLAVIS PREP - 15 QUESTION COLLEGE MATCH QUIZ
   
   Flow:
   1. Full-screen quiz (15 questions, one at a time)
   2. Email capture
   3. Show 3 schools FREE (teaser)
   4. Paywall for full 20+ school list
   ========================================================================== */

const QUESTIONS = [
  {
    id: "gpa",
    question: "What's your current GPA?",
    subtitle: "Use your unweighted GPA on a 4.0 scale",
    type: "choice",
    options: ["3.9 – 4.0", "3.7 – 3.8", "3.5 – 3.6", "3.2 – 3.4", "3.0 – 3.1", "Below 3.0"],
  },
  {
    id: "testScore",
    question: "What's your SAT or ACT score?",
    subtitle: "Pick your best score, or your target if you haven't tested yet",
    type: "choice",
    options: ["SAT 1500+ / ACT 34+", "SAT 1400–1490 / ACT 31–33", "SAT 1300–1390 / ACT 28–30", "SAT 1200–1290 / ACT 24–27", "SAT below 1200 / ACT below 24", "Test optional / Haven't tested"],
  },
  {
    id: "state",
    question: "What state do you live in?",
    subtitle: "This affects in-state tuition and admission odds",
    type: "dropdown",
    options: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
  },
  {
    id: "major",
    question: "What do you want to study?",
    subtitle: "Pick the area that excites you most",
    type: "choice",
    options: ["Engineering / Computer Science", "Business / Finance / Economics", "Pre-Med / Biology / Health Sciences", "Liberal Arts / Humanities / Social Sciences", "Arts / Design / Music / Film", "Undecided — still exploring"],
  },
  {
    id: "cityZip",
    question: "What city or ZIP code do you live in?",
    subtitle: "We use this to find real programs and activities close to home",
    type: "text",
    options: [],
  },
  {
    id: "size",
    question: "What size school feels right?",
    subtitle: "Think about where you'd thrive",
    type: "choice",
    options: ["Small (under 5,000 students)", "Medium (5,000 – 15,000)", "Large (15,000 – 30,000)", "Very large (30,000+)", "No preference"],
  },
  {
    id: "region",
    question: "Where do you want to go to college?",
    subtitle: "Be honest — location matters more than people admit",
    type: "choice",
    options: ["Stay in my state", "Northeast (NY, MA, PA, CT...)", "Southeast (FL, GA, NC, VA...)", "Midwest (IL, OH, MI, WI...)", "Southwest (TX, AZ, CO...)", "West Coast (CA, OR, WA)", "Anywhere — I'm flexible"],
  },
  {
    id: "setting",
    question: "What campus setting do you prefer?",
    subtitle: "Where would you be happiest living for 4 years?",
    type: "choice",
    options: ["Big city (NYC, LA, Chicago...)", "College town (Ann Arbor, Chapel Hill...)", "Suburban campus", "Rural / small town", "No preference"],
  },
  {
    id: "cost",
    question: "How important is cost?",
    subtitle: "Be realistic about your family's situation",
    type: "choice",
    options: ["Critical — need maximum financial aid", "Very important — looking for value", "Somewhat important — willing to pay for the right fit", "Not a major concern — can pay full tuition"],
  },
  {
    id: "aidType",
    question: "What type of financial aid do you expect?",
    subtitle: "This helps us find schools that match your financial situation",
    type: "choice",
    options: ["Need-based aid (FAFSA)", "Merit scholarships (based on grades/scores)", "Athletic scholarship", "Both need-based and merit", "Not expecting aid / paying out of pocket"],
  },
  {
    id: "activities",
    question: "What activities are most important to you?",
    subtitle: "Pick the one that matters most",
    type: "choice",
    options: ["Sports (varsity, club, or intramural)", "Greek life / social organizations", "Research opportunities", "Arts / music / theater", "Volunteering / community service", "Just focused on academics"],
  },
  {
    id: "learning",
    question: "How do you learn best?",
    subtitle: "Think about your ideal classroom experience",
    type: "choice",
    options: ["Small classes, lots of discussion", "Large lectures with TAs for support", "Hands-on / project-based learning", "Independent study / research", "Mix of everything"],
  },
  {
    id: "career",
    question: "What's your career goal?",
    subtitle: "Where do you see yourself after graduation?",
    type: "choice",
    options: ["Tech / Engineering / Software", "Medicine / Healthcare", "Law / Politics / Government", "Finance / Consulting / Business", "Creative / Arts / Entertainment", "Education / Nonprofit", "Still figuring it out"],
  },
  {
    id: "prestige",
    question: "How important are rankings and prestige?",
    subtitle: "Be honest — there's no wrong answer",
    type: "choice",
    options: ["Very important — want a top-ranked school", "Somewhat important — it's one factor", "Not very important — fit matters more", "Don't care at all about rankings"],
  },
  {
    id: "vibe",
    question: "What social vibe are you looking for?",
    subtitle: "Think about your ideal weekend",
    type: "choice",
    options: ["Big sports / party scene", "Balanced — study hard, play hard", "More academic / intellectual focus", "Outdoorsy / adventure culture", "Diverse / urban / cosmopolitan"],
  },
  {
    id: "priority",
    question: "What's the #1 most important factor for you?",
    subtitle: "If you could only pick one thing",
    type: "choice",
    options: ["Academic reputation / rankings", "Location and campus vibe", "Cost and financial aid", "Specific program or major strength", "Career outcomes and job placement", "Social life and community"],
  },
];

// Results will be fetched from API based on quiz answers
type CollegeResult = {
  name: string;
  location: string;
  acceptance: string;
  avgGPA: string;
  avgSAT: string;
  size: string;
  tuition: string;
  category: string;
  whyGoodFit?: string;
  url?: string;
};

type CollegeResults = {
  reach: CollegeResult[];
  match: CollegeResult[];
  safety: CollegeResult[];
  activityPlan: Array<{
    title: string;
    description: string;
    category: string;
    priority: string;
    estimatedTime: string;
    estimatedCost: string;
    whyItHelps: string;
    targetSchools: string[];
    location?: string;
    distance?: string;
    format?: string;
    url?: string;
  }>;
};

export default function CollegeMatchQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collegeResults, setCollegeResults] = useState<CollegeResults | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [importingPlan, setImportingPlan] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setHasUser(Boolean(user));
      if (!user) return;
      const { data: subscription } = await supabase.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle();
      setIsPro(subscription?.status === 'active' || subscription?.status === 'trialing');
    };
    checkAccess();
  }, []);

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const q = QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;
  const hasAnswer = answers[q?.id];

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [q.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Show email capture
      setCurrentQuestion(-1); // Special state for email screen
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setLoadingResults(true);
    
    try {
      // Call the API with quiz answers
      const response = await fetch('/api/college-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, email }),
      });

      const results = await response.json();
      if (!response.ok) throw new Error(results.error || 'Failed to get recommendations');
      setCollegeResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error getting matches:', error);
      alert(error instanceof Error ? error.message : 'Error getting college recommendations. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoadingResults(false);
    }
  };

  const handleUnlockAll = () => {
    setShowPaywall(true);
  };

  const addPlanToRoadmap = async () => {
    if (!collegeResults) return;
    setImportingPlan(true);
    try {
      const response = await fetch('/api/roadmap/import-goals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activities: collegeResults.activityPlan }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to add activities');
      window.location.href = '/roadmap';
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to add activities to your roadmap.');
      setImportingPlan(false);
    }
  };

  // Email capture screen
  if (currentQuestion === -1 && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-3">
              Your college list is ready!
            </h1>
            <p className="text-lg text-slate-300">
              Enter your email to see your personalized reach, match, and safety schools.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-5 py-4 bg-white text-[#0a1628] rounded-xl text-lg placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#c88c24]/50 mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
            />
            <button
              onClick={handleEmailSubmit}
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding your schools...
                </>
              ) : (
                <>
                  See My College List
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 text-center mt-4">
              We'll also send you college tips and deadline reminders. Unsubscribe anytime.
            </p>
          </div>

          <button
            onClick={() => setCurrentQuestion(QUESTIONS.length - 1)}
            className="mt-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to quiz
          </button>
        </div>
      </div>
    );
  }

  // Loading results screen
  if (loadingResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 border-4 border-[#c88c24] border-t-transparent rounded-full animate-spin" />
          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-white mb-3">
            Finding your perfect colleges...
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            We're analyzing your profile and matching you with schools where you'll thrive. This takes about 10 seconds.
          </p>
        </div>
      </div>
    );
  }

  // Results screen (with paywall)
  if (showResults && collegeResults) {
    const freeResults = [
      collegeResults.reach[0],
      collegeResults.match[0],
      collegeResults.safety[0],
    ].filter(Boolean);
    const allResults = [...collegeResults.reach, ...collegeResults.match, ...collegeResults.safety];
    const visibleResults = isPro ? allResults : freeResults;
    
    const lockedCount = 
      (collegeResults.reach?.length || 0) + 
      (collegeResults.match?.length || 0) + 
      (collegeResults.safety?.length || 0) - freeResults.length;

    return (
      <div className="min-h-screen bg-[#f5f0e8]">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="ClavisPrep Logo" className="h-12 w-auto" />
              </Link>
              <Link 
                href="/login"
                className="text-sm font-semibold text-slate-600 hover:text-[#0a1628]"
              >
                Log In
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4">
              <Check className="w-4 h-4" />
              <span className="text-sm font-semibold">Quiz Complete!</span>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-3">
              Your College Matches
            </h1>
            <p className="text-lg text-slate-600">
              Based on your answers, here are your top reach, match, and safety schools.
            </p>
          </div>

          {/* Free Results */}
          <div className="space-y-6 mb-8">
            {visibleResults.map((college, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#0a1628] mb-1">{college.name}</h3>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{college.location}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                    college.category === 'reach' ? 'bg-orange-100 text-orange-700' :
                    college.category === 'match' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {college.category.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-[#f5f0e8] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-[#c88c24]" />
                      <span className="text-xs font-semibold text-slate-600">Avg GPA</span>
                    </div>
                    <p className="text-lg font-bold text-[#0a1628]">{college.avgGPA}</p>
                  </div>
                  <div className="p-3 bg-[#f5f0e8] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-[#c88c24]" />
                      <span className="text-xs font-semibold text-slate-600">Avg SAT</span>
                    </div>
                    <p className="text-lg font-bold text-[#0a1628]">{college.avgSAT}</p>
                  </div>
                  <div className="p-3 bg-[#f5f0e8] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-[#c88c24]" />
                      <span className="text-xs font-semibold text-slate-600">Students</span>
                    </div>
                    <p className="text-lg font-bold text-[#0a1628]">{college.size}</p>
                  </div>
                  <div className="p-3 bg-[#f5f0e8] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-[#c88c24]" />
                      <span className="text-xs font-semibold text-slate-600">Tuition</span>
                    </div>
                    <p className="text-lg font-bold text-[#0a1628]">{college.tuition}</p>
                  </div>
                </div>

                {college.whyGoodFit && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#c88c24]/10 to-[#91682b]/10 border-l-4 border-[#c88c24] rounded-r-lg">
                    <h4 className="font-semibold text-[#0a1628] mb-1 text-sm">Why this is a great fit for you:</h4>
                    <p className="text-sm text-slate-700">{college.whyGoodFit}</p>
                  </div>
                )}
                {college.url && <a href={college.url} target="_blank" rel="noopener noreferrer" className="inline-flex mt-4 text-sm font-semibold text-blue-700 hover:underline">Visit official college website →</a>}
              </div>
            ))}
          </div>

          {/* Locked Results Preview */}
          {!isPro && <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5f0e8]/80 to-[#f5f0e8] z-10 pointer-events-none" />
            <div className="space-y-4 opacity-50 blur-[2px]">
              {[...(collegeResults.reach?.slice(1) || []), ...(collegeResults.match?.slice(1) || [])].slice(0, 3).map((college, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#0a1628]">{college.name}</h3>
                      <p className="text-slate-600">{college.location}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                      college.category === 'reach' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {college.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {isPro && (
            <section className="mb-8">
              <div className="text-center mb-7">
                <span className="inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">Your Pro Action Plan</span>
                <h2 className="font-serif text-3xl font-bold text-[#0a1628] mt-3">Activities to move you toward your goals</h2>
                <p className="text-slate-600 mt-2">Built from your profile and the colleges recommended above.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {collegeResults.activityPlan.map((activity, index) => (
                  <article key={`${activity.title}-${index}`} className="bg-white rounded-2xl border border-slate-200 shadow p-6">
                    <div className="flex justify-between gap-3"><span className="text-xs uppercase tracking-wide font-bold text-blue-700">{activity.category}</span><span className={`text-xs font-bold px-2 py-1 rounded ${activity.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{activity.priority} priority</span></div>
                    <h3 className="font-serif text-xl font-bold text-[#0a1628] mt-3">{activity.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{activity.description}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500"><span>{activity.estimatedTime}</span><span>•</span><span>{activity.estimatedCost}</span>{activity.location && <><span>•</span><span>{activity.location}</span></>}{activity.distance && <span>({activity.distance})</span>}{activity.format && <span className="font-semibold text-blue-700">{activity.format}</span>}</div>
                    <p className="text-sm text-indigo-700 mt-4"><strong>Why it helps:</strong> {activity.whyItHelps}</p>
                    <p className="text-xs text-slate-500 mt-3"><strong>Supports:</strong> {(activity.targetSchools || []).join(', ')}</p>
                    {activity.url && <a href={activity.url} target="_blank" rel="noopener noreferrer" className="inline-flex mt-4 text-sm font-semibold text-blue-700 hover:underline">Open real resource →</a>}
                  </article>
                ))}
              </div>
              <button onClick={addPlanToRoadmap} disabled={importingPlan} className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl px-6 py-4 font-bold hover:bg-blue-700 disabled:opacity-60">{importingPlan ? 'Adding activities...' : 'Add these goals to my roadmap'} {!importingPlan && <ArrowRight className="w-5 h-5" />}</button>
            </section>
          )}

          {/* Upgrade CTA */}
          {!isPro && <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c88c24]/10 to-transparent" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#c88c24] to-[#91682b] flex items-center justify-center shadow-xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-3">
                Unlock {lockedCount} More Schools
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                Your full list includes {collegeResults.reach?.length || 0} reach, {collegeResults.match?.length || 0} match, and {collegeResults.safety?.length || 0} safety schools — plus the tools to become a stronger candidate and make college affordable.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Link
                  href={hasUser ? "/dashboard" : "/signup"}
                  className="px-10 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  Unlock Schools + Action Plan — $19/mo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-400" /> Full 9-school list</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-400" /> Personalized activity plan</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-400" /> Scholarship database</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-400" /> Financial-aid calculator</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-400" /> AI essay reviewer</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-400" /> Deadline tracker</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-400" /> Cancel anytime</span>
              </div>
            </div>
          </div>}

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/signup"
              className="text-[#c88c24] font-semibold hover:underline"
            >
              Create free account to save results
            </Link>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
                setEmail("");
                setCollegeResults(null);
              }}
              className="text-slate-600 hover:text-[#0a1628]"
            >
              Retake quiz
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] flex flex-col">
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-[#c88c24] to-[#e7bf69] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="pt-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ClavisPrep" className="h-10 w-auto" />
          </Link>
          <span className="text-sm text-slate-400">
            {currentQuestion + 1} of {QUESTIONS.length}
          </span>
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          
          <div className="mb-8">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-3">
              {q.question}
            </h1>
            {q.subtitle && (
              <p className="text-lg text-slate-400">{q.subtitle}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-10">
            {q.type === "text" ? (
              <input value={answers[q.id] || ""} onChange={(e) => handleSelect(e.target.value)} placeholder="e.g., Orange, NJ or 07050" className="w-full px-5 py-4 bg-white text-[#0a1628] rounded-xl text-lg placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#c88c24]/50" />
            ) : q.type === "dropdown" ? (
              <select
                value={answers[q.id] || ""}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white text-lg focus:outline-none focus:border-[#c88c24] transition-colors"
              >
                <option value="" disabled className="text-slate-800">Select your state...</option>
                {q.options.map((opt) => (
                  <option key={opt} value={opt} className="text-slate-800">{opt}</option>
                ))}
              </select>
            ) : (
              q.options.map((opt) => {
                const isSelected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      isSelected
                        ? "bg-[#c88c24]/20 border-[#c88c24] text-white"
                        : "bg-white/5 border-white/20 text-slate-300 hover:bg-white/10 hover:border-white/40"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "border-[#c88c24] bg-[#c88c24]" : "border-white/40"
                    }`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-lg">{opt}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors ${
                currentQuestion === 0
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                hasAnswer
                  ? "bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white hover:shadow-xl hover:scale-105"
                  : "bg-white/10 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isLastQuestion ? "See My Results" : "Continue"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center">
        <p className="text-xs text-slate-500">
          Your answers are private and secure. We never share your information.
        </p>
      </footer>

    </div>
  );
}
