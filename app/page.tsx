"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const NAV_LINKS = ["Features", "How It Works", "Pricing", "Blog"];

const FEATURES = [
  { icon: "🗝", title: "AI College Match", desc: "Answer 15 questions. Get a personalized list of reach, match, and safety schools ranked for your exact profile." },
  { icon: "✍️", title: "Essay Coach", desc: "AI feedback on your college essays in seconds. Score, rewrite suggestions, and before/after comparisons." },
  { icon: "📋", title: "Application Tracker", desc: "Never miss a deadline. Track every school, requirement, and deadline in one organized dashboard." },
  { icon: "💰", title: "Financial Aid Calculator", desc: "See your real cost at every school. Estimate your Expected Family Contribution and compare aid packages." },
  { icon: "🗺️", title: "Activity Roadmap", desc: "A personalized year-by-year plan from freshman year through application season." },
  { icon: "📁", title: "Document Storage", desc: "Keep essays, transcripts, and recommendations organized and accessible in one secure place." },
];

const STATS = [
  { value: "3.8M", label: "Students apply to college each year" },
  { value: "5 min", label: "To get your personalized college list" },
  { value: "300+", label: "Colleges in our database" },
  { value: "Free", label: "To start — no credit card needed" },
];

const STEPS = [
  { num: "01", title: "Tell us about yourself", desc: "Answer 15 quick questions about your GPA, interests, location, and goals." },
  { num: "02", title: "Get your college list", desc: "Our AI builds a personalized list of reach, match, and safety schools ranked for you." },
  { num: "03", title: "Plan your application", desc: "Track deadlines, polish essays, and calculate your real cost at every school." },
  { num: "04", title: "Get accepted", desc: "Submit confident applications knowing you've applied to the right schools." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(10,22,40,0.98)" : "var(--navy)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--border-dark)",
        height: "68px",
        display: "flex", alignItems: "center",
        padding: "0 32px",
        justifyContent: "space-between",
        transition: "background 0.3s",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Image src="/images/logo.png" alt="ClavisPrep" width={44} height={44} unoptimized style={{ borderRadius: "8px" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--gold-light)", letterSpacing: "0.02em" }}>ClavisPrep</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} style={{ color: "rgba(245,240,232,0.7)", fontSize: "14px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-light)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.7)")}
            >{link}</a>
          ))}
          <a href="/app.html" style={{
            background: "var(--gold)", color: "var(--navy)", fontWeight: 600,
            fontSize: "14px", padding: "10px 22px", borderRadius: "var(--radius-md)",
            transition: "background 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--gold-light)"; e.currentTarget.style.boxShadow = "var(--shadow-gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.boxShadow = "none"; }}
          >Get Started Free →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "var(--navy)", paddingTop: "140px", paddingBottom: "100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(200,140,36,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(200,140,36,0.12)", border: "1px solid rgba(200,140,36,0.3)", borderRadius: "20px", padding: "6px 16px", marginBottom: "32px" }}>
            <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Personalized College Prep</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 7vw, 72px)", color: "var(--warm-white)", lineHeight: 1.1, marginBottom: "24px", fontWeight: 400 }}>
            The key to your<br /><span style={{ color: "var(--gold-light)" }}>college future</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "rgba(245,240,232,0.65)", maxWidth: "580px", margin: "0 auto 40px", lineHeight: 1.7 }}>
            Answer 15 questions. Get your personalized list of reach, match, and safety schools — built by AI, tailored to you.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/app.html" style={{ background: "var(--gold)", color: "var(--navy)", fontWeight: 600, fontSize: "16px", padding: "16px 36px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-gold)", display: "inline-block", transition: "background 0.15s, transform 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--gold-light)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Build My College List — Free →</a>
            <a href="#how-it-works" style={{ background: "transparent", color: "var(--gold-light)", fontWeight: 500, fontSize: "16px", padding: "15px 36px", borderRadius: "var(--radius-md)", border: "1px solid rgba(200,140,36,0.4)", display: "inline-block", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,140,36,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >See How It Works</a>
          </div>
          <p style={{ color: "rgba(245,240,232,0.35)", fontSize: "13px", marginTop: "16px" }}>Free to start · No credit card · Takes 5 minutes</p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "var(--navy-mid)", borderTop: "1px solid var(--border-dark)", borderBottom: "1px solid var(--border-dark)", padding: "40px 32px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "32px", textAlign: "center" }}>
          {STATS.map(stat => (
            <div key={stat.value}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--gold-light)", marginBottom: "6px" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "rgba(245,240,232,0.55)", lineHeight: 1.4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: "var(--warm-white)", padding: "100px 32px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "12px" }}>Everything you need</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", color: "var(--navy)", marginBottom: "16px" }}>Your complete college prep toolkit</h2>
            <p style={{ fontSize: "17px", color: "var(--text-2)", maxWidth: "520px", margin: "0 auto" }}>Everything a private college counselor does — powered by AI, available to every student.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-mid)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--navy)", marginBottom: "8px", fontWeight: 400 }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "var(--navy)", padding: "100px 32px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "12px" }}>Simple process</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", color: "var(--warm-white)" }}>How ClavisPrep works</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: "32px", alignItems: "flex-start", paddingBottom: i < STEPS.length - 1 ? "48px" : "0" }}>
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(200,140,36,0.15)", border: "1px solid rgba(200,140,36,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--gold)" }}>{step.num}</div>
                  {i < STEPS.length - 1 && <div style={{ width: "1px", flex: 1, background: "rgba(200,140,36,0.2)", marginTop: "8px", minHeight: "40px" }} />}
                </div>
                <div style={{ paddingTop: "12px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--warm-white)", marginBottom: "8px", fontWeight: 400 }}>{step.title}</h3>
                  <p style={{ fontSize: "15px", color: "rgba(245,240,232,0.6)", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--warm-white)", padding: "100px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ background: "var(--navy)", borderRadius: "var(--radius-xl)", padding: "64px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 100%, rgba(200,140,36,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
            <Image src="/images/logo.png" alt="ClavisPrep" width={64} height={64} unoptimized style={{ margin: "0 auto 24px", borderRadius: "12px" }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 40px)", color: "var(--warm-white)", marginBottom: "16px", position: "relative" }}>Ready to find your perfect college?</h2>
            <p style={{ fontSize: "16px", color: "rgba(245,240,232,0.6)", marginBottom: "36px", position: "relative" }}>Join thousands of students who used ClavisPrep to build their college list, write better essays, and get accepted.</p>
            <a href="/app.html" style={{ display: "inline-block", background: "var(--gold)", color: "var(--navy)", fontWeight: 600, fontSize: "16px", padding: "16px 40px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-gold)", position: "relative", transition: "background 0.15s, transform 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--gold-light)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Start Free — No Credit Card →</a>
            <p style={{ color: "rgba(245,240,232,0.3)", fontSize: "12px", marginTop: "14px", position: "relative" }}>Takes 5 minutes · Free forever plan available</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--navy)", borderTop: "1px solid var(--border-dark)", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "24px" }}>
            <Image src="/images/logo.png" alt="ClavisPrep" width={32} height={32} unoptimized style={{ borderRadius: "6px" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--gold-light)" }}>ClavisPrep</span>
          </div>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
            {["Features", "Blog", "Colleges", "Terms", "Privacy"].map(link => (
              <a key={link} href={`/${link.toLowerCase()}`} style={{ fontSize: "13px", color: "rgba(245,240,232,0.4)", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-mid)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,240,232,0.4)")}
              >{link}</a>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.25)" }}>© 2026 ClavisPrep · The key to your college future · Powered by Claude AI</p>
        </div>
      </footer> 

    </div>
  );
}