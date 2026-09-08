"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Sparkles, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function EssayCoach() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setSubscription(sub);
      setLoading(false);
    };

    getUser();
  }, []);

  const isPro = subscription?.status === 'active' || subscription?.status === 'trialing';

  const analyzeEssay = () => {
    setAnalyzing(true);
    
    // Simulate AI analysis (in production, you'd call Claude API here)
    setTimeout(() => {
      const wordCount = essay.trim().split(/\s+/).length;
      const hasHook = essay.toLowerCase().includes("always") || essay.toLowerCase().includes("never") || essay.toLowerCase().includes("everyone");
      const hasConclusion = essay.length > 500;
      
      setFeedback({
        overall: wordCount > 450 && wordCount < 650 ? "Strong" : wordCount < 450 ? "Needs Development" : "Too Long",
        wordCount,
        strengths: [
          wordCount >= 400 ? "Good length and depth" : null,
          hasHook ? "Engaging opening" : null,
          "Clear personal voice",
        ].filter(Boolean),
        improvements: [
          wordCount < 400 ? "Add more specific examples and details" : null,
          !hasHook ? "Consider a stronger opening hook" : null,
          wordCount > 650 ? "Condense to stay within typical limits (500-650 words)" : null,
          !hasConclusion ? "Add a reflective conclusion" : null,
        ].filter(Boolean),
        grammar: "No major issues detected",
        tone: "Authentic and personal",
      });
      
      setAnalyzing(false);
    }, 2000);
  };

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

  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#f5f0e8]">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/dashboard" className="flex items-center gap-2">
                <img src="/logo.png" alt="ClavisPrep Logo" className="h-12 w-auto" />
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12">
            <FileText className="w-16 h-16 mx-auto mb-6 text-[#c88c24]" />
            <h1 className="font-serif text-4xl font-bold text-[#0a1628] mb-4">
              Upgrade to Pro for Essay Coach
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Get AI-powered feedback on your college essays with detailed analysis of structure, tone, grammar, and impact.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Upgrade to Pro - $19.99/month
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img src="/logo.png" alt="ClavisPrep Logo" className="h-12 w-auto" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-[#0a1628]">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#0a1628] mb-2">Essay Coach</h1>
          <p className="text-lg text-slate-600">Get instant AI feedback on your college essay</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Essay Input */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-[#c88c24]" />
              <h2 className="font-serif text-2xl font-bold text-[#0a1628]">Your Essay</h2>
            </div>

            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Paste your college essay here... (Common App essays are typically 250-650 words)"
              className="w-full h-96 px-4 py-3 bg-[#f5f0e8] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c88c24] resize-none"
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-slate-600">
                {essay.trim().split(/\s+/).filter(word => word.length > 0).length} words
              </span>
              <button
                onClick={analyzeEssay}
                disabled={!essay.trim() || analyzing}
                className="px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? "Analyzing..." : "Get Feedback"}
              </button>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#c88c24]" />
              <h2 className="font-serif text-2xl font-bold text-[#0a1628]">AI Feedback</h2>
            </div>

            {!feedback && (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Paste your essay and click "Get Feedback" to receive detailed analysis</p>
              </div>
            )}

            {analyzing && (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#c88c24] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-600">Analyzing your essay...</p>
              </div>
            )}

            {feedback && !analyzing && (
              <div className="space-y-6">
                
                {/* Overall Assessment */}
                <div className="p-4 bg-gradient-to-r from-[#c88c24]/10 to-[#91682b]/10 rounded-xl border-l-4 border-[#c88c24]">
                  <h3 className="font-bold text-[#0a1628] mb-1">Overall Assessment</h3>
                  <p className="text-lg font-semibold text-[#c88c24]">{feedback.overall}</p>
                  <p className="text-sm text-slate-600 mt-1">{feedback.wordCount} words</p>
                </div>

                {/* Strengths */}
                <div>
                  <h3 className="font-bold text-[#0a1628] mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                {feedback.improvements.length > 0 && (
                  <div>
                    <h3 className="font-bold text-[#0a1628] mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {feedback.improvements.map((improvement: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <span className="text-amber-600 mt-1">→</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Grammar & Tone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#f5f0e8] rounded-xl">
                    <h4 className="font-semibold text-[#0a1628] mb-1">Grammar</h4>
                    <p className="text-sm text-slate-600">{feedback.grammar}</p>
                  </div>
                  <div className="p-4 bg-[#f5f0e8] rounded-xl">
                    <h4 className="font-semibold text-[#0a1628] mb-1">Tone</h4>
                    <p className="text-sm text-slate-600">{feedback.tone}</p>
                  </div>
                </div>

                <button
                  onClick={() => setFeedback(null)}
                  className="w-full px-6 py-3 bg-white border-2 border-[#c88c24] text-[#c88c24] font-bold rounded-xl hover:bg-[#c88c24] hover:text-white transition-all"
                >
                  Analyze Another Essay
                </button>

              </div>
            )}
          </div>

        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="font-serif text-2xl font-bold text-[#0a1628] mb-4">Essay Writing Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-[#0a1628] mb-2">📝 Be Specific</h3>
              <p className="text-sm text-slate-600">Use concrete examples and vivid details instead of general statements</p>
            </div>
            <div>
              <h3 className="font-bold text-[#0a1628] mb-2">💭 Show, Don't Tell</h3>
              <p className="text-sm text-slate-600">Demonstrate your qualities through stories rather than listing them</p>
            </div>
            <div>
              <h3 className="font-bold text-[#0a1628] mb-2">🎯 Stay Focused</h3>
              <p className="text-sm text-slate-600">Stick to one main theme or story rather than covering too much</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}