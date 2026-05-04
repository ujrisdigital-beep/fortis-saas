// app/training/hub/page.tsx
// Public Digital Skills Hub — no login required
"use client";
import { useState, useEffect } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const STATS = [
  { value: "12+", label: "AI-Generated Courses", icon: "🎓" },
  { value: "5", label: "Sectors Covered", icon: "🏭" },
  { value: "100%", label: "Free to Enroll", icon: "✅" },
  { value: "FORTIS", label: "Certified Credentials", icon: "🏅" },
];

const SECTORS = [
  { icon: "💻", name: "Digital & Tech", courses: 4, color: "#3B82F6", desc: "Web development, data, cybersecurity, AI" },
  { icon: "💳", name: "Fintech", courses: 3, color: "#10B981", desc: "Mobile money, digital payments, compliance" },
  { icon: "🌾", name: "Agriculture", courses: 2, color: "#F59E0B", desc: "AgriTech, smart farming, market access" },
  { icon: "🏥", name: "Health", courses: 2, color: "#EF4444", desc: "Health informatics, telemedicine, data" },
  { icon: "⚡", name: "Energy", courses: 1, color: "#8B5CF6", desc: "Solar, smart grids, energy management" },
];

const FEATURED_COURSES = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    sector: "Digital & Tech",
    level: "Beginner",
    duration: "4 weeks",
    modules: 6,
    enrolled: 248,
    desc: "Build your first website using HTML, CSS, and JavaScript. Gambia-context projects included.",
  },
  {
    id: "2",
    title: "Mobile Money & Digital Payments",
    sector: "Fintech",
    level: "Beginner",
    duration: "3 weeks",
    modules: 5,
    enrolled: 312,
    desc: "Master the digital financial ecosystem — from Wave to international transfers. For entrepreneurs and agents.",
  },
  {
    id: "3",
    title: "Data Analysis for Business",
    sector: "Digital & Tech",
    level: "Intermediate",
    duration: "6 weeks",
    modules: 8,
    enrolled: 187,
    desc: "Turn raw data into decisions using Excel, Google Sheets, and basic Python. Real Gambian business datasets.",
  },
  {
    id: "4",
    title: "Digital Marketing Mastery",
    sector: "Digital & Tech",
    level: "Beginner",
    duration: "4 weeks",
    modules: 6,
    enrolled: 421,
    desc: "Social media strategy, content creation, SEO, and paid advertising for Gambian SMEs.",
  },
  {
    id: "5",
    title: "Cybersecurity Essentials",
    sector: "Digital & Tech",
    level: "Intermediate",
    duration: "5 weeks",
    modules: 7,
    enrolled: 94,
    desc: "Protect yourself and your business online. Understand threats, compliance, and incident response.",
  },
  {
    id: "6",
    title: "Smart Agriculture & AgriTech",
    sector: "Agriculture",
    level: "Beginner",
    duration: "3 weeks",
    modules: 4,
    enrolled: 156,
    desc: "IoT sensors, drone mapping, digital market access, and precision farming for Gambian farmers.",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Browse & Enroll", desc: "Choose from AI-generated courses across 5 sectors. Free. No prerequisites for beginner courses.", icon: "🔍" },
  { step: "2", title: "Learn with AI", desc: "Interactive modules, quizzes, and AI-assisted explanations. Learn at your pace — mobile-friendly.", icon: "📱" },
  { step: "3", title: "Pass Assessment", desc: "AI-proctored assessment. Score 70%+ to qualify. Flagged attempts are human-reviewed within 24h.", icon: "📝" },
  { step: "4", title: "Get Certified", desc: "Instant FORTIS digital certificate with unique ID. Verifiable by any employer via QR code.", icon: "🏅" },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "#16A34A",
  Intermediate: "#D97706",
  Advanced: "#DC2626",
};

export default function TrainingHubPage() {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fortis-course-progress");
      if (saved) setProgress(JSON.parse(saved) as Record<string, number>);
    } catch { /* ignore */ }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Hero */}
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 55%, #2A6B52 100%)`,
        padding: "3rem 1.5rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 300, height: 300,
          borderRadius: "50%", background: "rgba(196,148,58,0.06)", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 14px", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: 14 }}>🇬🇲</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: "0.08em" }}>FORTIS DIGITAL SKILLS HUB</span>
          </div>
          <h1 style={{ margin: "0 0 1rem", color: WHITE, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.2 }}>
            Gambia&apos;s National<br />
            <span style={{ color: GOLD }}>Digital Training Platform</span>
          </h1>
          <p style={{ margin: "0 0 2rem", color: "rgba(255,255,255,0.75)", fontSize: "clamp(1rem, 2vw, 1.15rem)", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            AI-generated courses. AI-proctored assessments. Blockchain-verifiable certificates.
            Free for every Gambian.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#courses" style={{ padding: "0.75rem 2rem", background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, borderRadius: 10, fontSize: 15, fontWeight: 800, textDecoration: "none", display: "inline-block" }}>
              🎓 Start Free — No Login
            </a>
            <a href="/training/verify" style={{ padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: WHITE, borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", display: "inline-block" }}>
              🏅 Verify a Certificate
            </a>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div style={{ maxWidth: 900, margin: "-1.5rem auto 0", padding: "0 1.5rem", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.25rem", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div style={{ fontWeight: 900, fontSize: "1.6rem", color: PRIMARY, marginTop: 4 }}>{s.value}</div>
              <div style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* How it works */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: DARK, margin: "0 0 1.25rem" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem" }}>
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.25rem", position: "relative" }}>
                <div style={{ position: "absolute", top: -10, left: 16, width: 28, height: 28, borderRadius: "50%", background: PRIMARY, color: GOLD, fontSize: "0.78rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{h.step}</div>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{h.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: DARK, marginBottom: 4 }}>{h.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.5 }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sectors */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: DARK, margin: "0 0 1.25rem" }}>Browse by Sector</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {SECTORS.map((s) => (
              <div key={s.name} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "0.85rem 1.1rem", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flex: "1 1 180px" }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: DARK }}>{s.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>{s.courses} courses · {s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        <section id="courses" style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: DARK, margin: 0 }}>Featured Courses</h2>
            <span style={{ fontSize: "0.82rem", color: PRIMARY, fontWeight: 600 }}>Free · No login required</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {FEATURED_COURSES.map((c) => {
              const pct = progress[c.id] ?? 0;
              return (
                <div key={c.id} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, padding: "1.25rem", position: "relative" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 999, background: `${LEVEL_COLOR[c.level]}20`, color: LEVEL_COLOR[c.level], border: `1px solid ${LEVEL_COLOR[c.level]}40`, fontSize: "0.68rem", fontWeight: 700 }}>{c.level}</span>
                    <h3 style={{ margin: "0.5rem 0 0", color: WHITE, fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.3 }}>{c.title}</h3>
                  </div>
                  <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#4B5563", lineHeight: 1.5, flex: 1 }}>{c.desc}</p>
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>📅 {c.duration}</span>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>📚 {c.modules} modules</span>
                      <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>👥 {c.enrolled} enrolled</span>
                    </div>
                    {pct > 0 && (
                      <div style={{ marginBottom: "0.65rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6B7280", marginBottom: 3 }}>
                          <span>Progress</span><span>{pct}% complete</span>
                        </div>
                        <div style={{ height: 5, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: GOLD, borderRadius: 999 }} />
                        </div>
                      </div>
                    )}
                    <a href={`/training/learn?course=${c.id}`} style={{ display: "block", textAlign: "center", padding: "0.55rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, borderRadius: 8, fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>
                      {pct > 0 ? "Continue →" : "Start Free →"}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Employer CTA */}
        <section style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, borderRadius: 16, padding: "2rem 1.5rem", textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 36, marginBottom: "0.75rem" }}>🤝</div>
          <h2 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "1.25rem", fontWeight: 800 }}>Are You an Employer?</h2>
          <p style={{ margin: "0 0 1.25rem", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
            Post roles, let AI match you with FORTIS-certified talent, and help build Gambia&apos;s digital workforce.
          </p>
          <a href="mailto:ceo@fortisos.co.uk?subject=Employer Partnership" style={{ padding: "0.7rem 1.75rem", background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, borderRadius: 10, fontSize: 14, fontWeight: 800, textDecoration: "none", display: "inline-block" }}>
            🏢 Partner with FORTIS
          </a>
        </section>

        {/* Certificate verification CTA */}
        <section style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 0.5rem", color: DARK, fontSize: "1rem", fontWeight: 700 }}>🏅 Verify a FORTIS Certificate</h3>
          <p style={{ margin: "0 0 1rem", color: "#6B7280", fontSize: "0.85rem" }}>
            Employers and institutions can verify any FORTIS certificate instantly using the certificate number or QR code.
          </p>
          <a href="/training/verify" style={{ padding: "0.6rem 1.5rem", background: PRIMARY, color: WHITE, borderRadius: 8, fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
            Verify Certificate →
          </a>
        </section>

      </div>
    </div>
  );
}
