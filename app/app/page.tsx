"use client";
import Image from "next/image";
import { useState } from "react";

const QUESTIONS = [
  {
    id: "gpa",
    question: "What is your current GPA?",
    subtitle: "Use your unweighted GPA on a 4.0 scale",
    type: "choice",
    options: ["3.9 – 4.0", "3.7 – 3.8", "3.5 – 3.6", "3.2 – 3.4", "3.0 – 3.1", "Below 3.0"],
  },
  {
    id: "sat",
    question: "What is your SAT or ACT score?",
    subtitle: "Choose your best score, or your target score if you haven't tested yet",
    type: "choice",
    options: ["SAT 1500+", "SAT 1400–1499", "SAT 1300–1399", "SAT 1200–1299", "SAT below 1200", "Haven't tested yet"],
  },
  {
    id: "state",
    question: "What state are you applying from?",
    subtitle: "This affects in-state tuition and public university admissions",
    type: "text",
    options: [],
  },
  {
    id: "major",
    question: "What do you want to study?",
    subtitle: "Pick the area that excites you most",
    type: "choice",
    options: ["Engineering / CS", "Business / Finance", "Pre-med / Biology", "Liberal Arts / Humanities", "Arts / Design", "Undecided"],
  },
  {
    id: "size",
    question: "What size school feels right?",
    subtitle: "Think about the environment where you thrive",
    type: "choice",
    options: ["Small (under 5,000)", "Medium (5,000–15,000)", "Large (15,000–30,000)", "Very large (30,000+)", "No preference"],
  },
  {
    id: "location",
    question: "Where do you want to go to college?",
    subtitle: "Be honest — location matters more than people admit",
    type: "choice",
    options: ["Stay in my state", "Northeast (NY, MA, CT...)", "Southeast (NC, GA, FL...)", "Midwest (IL, OH, MI...)", "West Coast (CA, OR, WA...)", "Anywhere — open to all"],
  },
  {
    id: "cost",
    question: "What's your budget for college?",
    subtitle: "Include financial aid — we'll help you find schools that fit",
    type: "choice",
    options: ["Under $20K/year", "$20K–$35K/year", "$35K–$50K/year", "$50K+ (full cost is fine)", "Need maximum aid possible"],
  },
  {
    id: "vibe",
    question: "What's your ideal campus vibe?",
    subtitle: "Close your eyes and picture your perfect college weekend",
    type: "choice",
    options: ["Big sports / Greek life", "Academic / research focused", "Artsy / creative", "Tight-knit community", "Diverse / urban", "No preference"],
  },
  {
    id: "reach",
    question: "Which schools are on your dream list?",
    subtitle: "Select any that apply, or type ones not listed",
    type: "multi-text",
    options: ["Harvard / MIT / Stanford", "UT Austin / A&M", "UCLA / USC", "NYU / Boston U", "Georgetown / Vanderbilt", "Ivy League schools", "None yet — help me find some"],
  },
  {
    id: "extracurricular",
    question: "What best describes your extracurriculars?",
    subtitle: "Colleges look for depth, not just breadth",
    type: "choice",
    options: ["Leadership roles in multiple clubs", "Deep focus in one activity (varsity sport, band, etc.)", "Work experience or internships", "Community service / volunteering", "Starting something (business, org, project)", "Still building my activities"],
  },
  {
    id: "priority",
    question: "What matters most to you in a college?",
    subtitle: "Pick your single most important factor",
    type: "choice",
    options: ["Academic reputation / rankings", "Career outcomes / job placement", "Cost / financial aid", "Social life and campus culture", "Location and city", "Program strength in my major"],
  },
  {
    id: "timeline",
    question: "When are you applying?",
    subtitle: "This helps us prioritize what to work on first",
    type: "choice",
    options: ["This fall (Class of 2026)", "Next fall (Class of 2027)", "Two years out", "Just exploring for now"],
  },
  {
    id: "essay",
    question: "Where are you on your college essay?",
    subtitle: "No judgment — just helps us know what you need",
    type: "choice",
    options: ["Haven't started", "Have a topic, haven't written", "First draft done", "Almost finished", "Completely done"],
  },
  {
    id: "counselor",
    question: "Do you have a college counselor?",
    subtitle: "ClavisPrep works best as a complement to human guidance",
    type: "choice",
    options: ["Yes, school counselor", "Yes, private counselor", "No — just family help", "No — doing it alone", "No — that's why I'm here"],
  },
  {
    id: "email",
    question: "Where should we send your college list?",
    subtitle: "We'll email your personalized reach, match, and safety schools",
    type: "email",
    options: [],
  },
];

const COLLEGE_RESULTS = {
  reach: [
    { name: "University of Texas at Austin", rate: "31%", fit: "Strong match for your major" },
    { name: "UCLA", rate: "9%", fit: "Reach — apply with a strong essay" },
    { name: "NYU", rate: "12%", fit: "Reach — great urban campus fit" },
  ],
  match: [
    { name: "University of Florida", rate: "38%", fit: "Solid match for your profile" },
    { name: "Boston University", rate: "14%", fit: "Good fit for your interests" },
    { name: "University of Georgia", rate: "45%", fit: "Strong chance of admission" },
  ],
  safety: [
    { name: "Texas State University", rate: "67%", fit: "Safety — strong scholarship potential" },
    { name: "University of Alabama", rate: "72%", fit: "Safety — merit aid likely" },
    { name: "Auburn University", rate: "64%", fit: "Safety — great campus culture" },
  ],
};

const STRIPE_LINK = "https://buy.stripe.com/8x228r9ihcQk8bQ75c83C01";

export default function AppPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [customSchool, setCustomSchool] = useState("");

  const q = QUESTIONS[current];
  const progress = (current / (QUESTIONS.length - 1)) * 100;

  function selectOption(opt: string) {
    if (q.type === "multi" || q.type === "multi-text") {
      setSelected(prev => prev.includes(opt) ? prev.filter(s => s !== opt) : [...prev, opt]);
    } else {
      setSelected([opt]);
    }
  }

  function addCustomSchool() {
    if (customSchool.trim()) {
      setSelected(prev => [...prev, customSchool.trim()]);
      setCustomSchool("");
    }
  }

  function next() {
    if (q.type === "email") {
      if (!email) return;
      setAnswers(prev => ({ ...prev, [q.id]: email }));
      setDone(true);
      return;
    }
    if (selected.length === 0) return;
    setAnswers(prev => ({ ...prev, [q.id]: q.type === "multi" || q.type === "multi-text" ? selected : selected[0] }));
    setCurrent(c => c + 1);
    setSelected([]);
    setCustomSchool("");
  }

  function prev() {
    if (current === 0) return;
    setCurrent(c => c - 1);
    setSelected([]);
    setCustomSchool("");
  }

  const canContinue = q.type === "email" ? !!email : selected.length > 0;

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", flexDirection: "column" }}>
        <nav style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-dark)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image src="/images/logo.png" alt="ClavisPrep" width={36} height={36} unoptimized style={{ borderRadius: "6px" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--gold-light)" }}>ClavisPrep</span>
          </a>
          <span style={{ fontSize: "13px", color: "rgba(245,240,232,0.4)" }}>Your personalized college list</span>
        </nav>

        <div style={{ flex: 1, maxWidth: "900px", margin: "0 auto", padding: "48px 24px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ display: "inline-block", background: "rgba(200,140,36,0.15)", border: "1px solid rgba(200,140,36,0.3)", borderRadius: "20px", padding: "6px 16px", marginBottom: "20px" }}>
              <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Your results are ready</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", color: "var(--warm-white)", marginBottom: "12px" }}>Your personalized college list</h1>
            <p style={{ fontSize: "16px", color: "rgba(245,240,232,0.6)" }}>Based on your profile, here are your best-fit schools</p>
          </div>

          {(["reach", "match", "safety"] as const).map((tier) => (
            <div key={tier} style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: tier === "reach" ? "#E24B4A" : tier === "match" ? "var(--gold)" : "#4A9B7F" }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--warm-white)", fontWeight: 400, textTransform: "capitalize" }}>{tier} Schools</h2>
                <span style={{ fontSize: "12px", color: "rgba(245,240,232,0.4)" }}>{tier === "reach" ? "15–30% chance" : tier === "match" ? "40–65% chance" : "70%+ chance"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                {COLLEGE_RESULTS[tier].map(college => (
                  <div key={college.name} style={{ background: "var(--navy-mid)", border: "1px solid var(--border-dark)", borderRadius: "var(--radius-lg)", padding: "20px 24px", transition: "border-color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(200,140,36,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-dark)")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "17px", color: "var(--warm-white)", fontWeight: 400 }}>{college.name}</h3>
                      <span style={{ fontSize: "12px", color: "var(--gold-mid)", background: "rgba(200,140,36,0.1)", padding: "2px 8px", borderRadius: "12px", whiteSpace: "nowrap", marginLeft: "8px" }}>{college.rate}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(245,240,232,0.5)", lineHeight: 1.5 }}>{college.fit}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: "rgba(200,140,36,0.08)", border: "1px solid rgba(200,140,36,0.3)", borderRadius: "var(--radius-xl)", padding: "40px", textAlign: "center", marginTop: "48px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--warm-white)", marginBottom: "12px" }}>Unlock your full college roadmap</h2>
            <p style={{ fontSize: "15px", color: "rgba(245,240,232,0.6)", maxWidth: "480px", margin: "0 auto 28px" }}>Get essay coaching, deadline tracking, financial aid estimates, and a personalized month-by-month action plan.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer" style={{ background: "var(--gold)", color: "var(--navy)", fontWeight: 600, fontSize: "16px", padding: "14px 32px", borderRadius: "var(--radius-md)", display: "inline-block", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-light)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--gold)")}
              >Upgrade to Pro — $19/mo →</a>
              <a href="/" style={{ background: "transparent", color: "var(--gold-light)", fontWeight: 500, fontSize: "16px", padding: "13px 32px", borderRadius: "var(--radius-md)", border: "1px solid rgba(200,140,36,0.3)", display: "inline-block" }}>Back to Home</a>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.3)", marginTop: "14px" }}>7-day free trial · Cancel anytime</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--navy)", display: "flex", flexDirection: "column" }}>
      <nav style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-dark)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image src="/images/logo.png" alt="ClavisPrep" width={36} height={36} unoptimized style={{ borderRadius: "6px" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--gold-light)" }}>ClavisPrep</span>
        </a>
        <span style={{ fontSize: "13px", color: "rgba(245,240,232,0.4)" }}>{current + 1} of {QUESTIONS.length}</span>
      </nav>

      <div style={{ height: "3px", background: "rgba(200,140,36,0.15)" }}>
        <div style={{ height: "100%", background: "var(--gold)", width: `${progress}%`, transition: "width 0.4s ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "620px" }}>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Question {current + 1}</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 40px)", color: "var(--warm-white)", marginBottom: "10px", fontWeight: 400, lineHeight: 1.2 }}>{q.question}</h1>
            <p style={{ fontSize: "15px", color: "rgba(245,240,232,0.5)", lineHeight: 1.6 }}>{q.subtitle}</p>
          </div>

          {q.type === "text" ? (
            <div style={{ marginBottom: "32px" }}>
              <input
                type="text"
                placeholder="e.g. Texas, California, New York..."
                value={selected[0] || ""}
                onChange={e => setSelected([e.target.value])}
                onKeyDown={e => e.key === "Enter" && next()}
                style={{ width: "100%", background: "var(--navy-mid)", border: "1px solid var(--border-dark)", borderRadius: "var(--radius-md)", padding: "18px 20px", fontSize: "18px", color: "var(--warm-white)", outline: "none", fontFamily: "var(--font-body)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border-dark)")}
              />
            </div>
          ) : q.type === "multi-text" ? (
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                {q.options.map(opt => {
                  const isSelected = selected.includes(opt);
                  return (
                    <button key={opt} onClick={() => selectOption(opt)} style={{ background: isSelected ? "rgba(200,140,36,0.15)" : "var(--navy-mid)", border: `1px solid ${isSelected ? "var(--gold)" : "var(--border-dark)"}`, borderRadius: "var(--radius-md)", padding: "14px 16px", color: isSelected ? "var(--gold-light)" : "rgba(245,240,232,0.8)", fontSize: "14px", fontFamily: "var(--font-body)", textAlign: "left", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${isSelected ? "var(--gold)" : "rgba(245,240,232,0.2)"}`, background: isSelected ? "var(--gold)" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isSelected && <span style={{ color: "var(--navy)", fontSize: "10px", fontWeight: 700 }}>✓</span>}
                      </div>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Type another school and press Enter..."
                  value={customSchool}
                  onChange={e => setCustomSchool(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { addCustomSchool(); } }}
                  style={{ flex: 1, background: "var(--navy-mid)", border: "1px solid var(--border-dark)", borderRadius: "var(--radius-md)", padding: "14px 20px", fontSize: "15px", color: "var(--warm-white)", outline: "none", fontFamily: "var(--font-body)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border-dark)")}
                />
                <button onClick={addCustomSchool} style={{ background: "var(--navy-mid)", border: "1px solid var(--border-dark)", borderRadius: "var(--radius-md)", padding: "14px 16px", color: "var(--gold)", fontFamily: "var(--font-body)", cursor: "pointer", fontSize: "14px" }}>Add</button>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.3)", marginTop: "8px" }}>Press Enter or click Add to include a school · Select all that apply</p>
              {selected.filter(s => !q.options.includes(s)).length > 0 && (
                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selected.filter(s => !q.options.includes(s)).map(s => (
                    <span key={s} onClick={() => setSelected(prev => prev.filter(p => p !== s))} style={{ background: "rgba(200,140,36,0.15)", border: "1px solid var(--gold)", borderRadius: "20px", padding: "4px 12px", fontSize: "13px", color: "var(--gold-light)", cursor: "pointer" }}>
                      {s} ×
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : q.type === "email" ? (
            <div style={{ marginBottom: "32px" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && next()}
                style={{ width: "100%", background: "var(--navy-mid)", border: "1px solid var(--border-dark)", borderRadius: "var(--radius-md)", padding: "18px 20px", fontSize: "18px", color: "var(--warm-white)", outline: "none", fontFamily: "var(--font-body)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border-dark)")}
              />
              <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.3)", marginTop: "10px" }}>We never share your email. Unsubscribe anytime.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: q.options.length > 4 ? "1fr 1fr" : "1fr", gap: "10px", marginBottom: "32px" }}>
              {q.options.map(opt => {
                const isSelected = selected.includes(opt);
                return (
                  <button key={opt} onClick={() => selectOption(opt)} style={{ background: isSelected ? "rgba(200,140,36,0.15)" : "var(--navy-mid)", border: `1px solid ${isSelected ? "var(--gold)" : "var(--border-dark)"}`, borderRadius: "var(--radius-md)", padding: "16px 20px", color: isSelected ? "var(--gold-light)" : "rgba(245,240,232,0.8)", fontSize: "15px", fontFamily: "var(--font-body)", textAlign: "left", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${isSelected ? "var(--gold)" : "rgba(245,240,232,0.2)"}`, background: isSelected ? "var(--gold)" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isSelected && <span style={{ color: "var(--navy)", fontSize: "11px", fontWeight: 700 }}>✓</span>}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {current > 0 && (
              <button onClick={prev} style={{ background: "transparent", border: "1px solid var(--border-dark)", color: "rgba(245,240,232,0.5)", padding: "14px 24px", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,240,232,0.3)"; e.currentTarget.style.color = "var(--warm-white)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-dark)"; e.currentTarget.style.color = "rgba(245,240,232,0.5)"; }}
              >← Back</button>
            )}
            <button onClick={next} disabled={!canContinue} style={{ flex: 1, background: canContinue ? "var(--gold)" : "rgba(200,140,36,0.3)", color: canContinue ? "var(--navy)" : "rgba(10,22,40,0.5)", fontWeight: 600, fontSize: "16px", padding: "16px 32px", borderRadius: "var(--radius-md)", border: "none", fontFamily: "var(--font-body)", cursor: canContinue ? "pointer" : "not-allowed", transition: "all 0.15s" }}
              onMouseEnter={e => { if (canContinue) e.currentTarget.style.background = "var(--gold-light)"; }}
              onMouseLeave={e => { if (canContinue) e.currentTarget.style.background = "var(--gold)"; }}
            >
              {current === QUESTIONS.length - 1 ? "Show My College List →" : "Continue →"}
            </button>
          </div>

          {(q.type === "multi" || q.type === "multi-text") && (
            <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.3)", textAlign: "center", marginTop: "12px" }}>Select all that apply</p>
          )}
        </div>
      </div>
    </div>
  );
}