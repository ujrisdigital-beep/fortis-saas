"use client";
// app/employers/dashboard/page.tsx
// Employer portal — post roles, AI talent matching
import { useState } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface JobRole {
  id: string;
  title: string;
  skills: string[];
  salaryRange: string;
  location: string;
  matches: number;
  postedAt: string;
}

const MOCK_ROLES: JobRole[] = [
  {
    id: "1",
    title: "Junior Web Developer",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    salaryRange: "GMD 8,000 – 15,000/month",
    location: "Banjul",
    matches: 14,
    postedAt: "2026-04-10",
  },
  {
    id: "2",
    title: "Digital Marketing Specialist",
    skills: ["Social Media", "SEO", "Content Creation", "Analytics"],
    salaryRange: "GMD 10,000 – 18,000/month",
    location: "Serrekunda",
    matches: 23,
    postedAt: "2026-04-12",
  },
];

const MOCK_MATCHES = [
  { name: "Amadou Jallow", program: "Web Development Fundamentals", score: 94, cert: "FORTIS-2026-45231", location: "Banjul", available: "Immediately" },
  { name: "Fatou Ceesay", program: "Web Development Fundamentals", score: 89, cert: "FORTIS-2026-45188", location: "Serrekunda", available: "2 weeks" },
  { name: "Lamin Bojang", program: "Digital Marketing Mastery", score: 96, cert: "FORTIS-2026-45301", location: "Brikama", available: "Immediately" },
];

export default function EmployerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "post" | "matches">("overview");
  const [form, setForm] = useState({ title: "", skills: "", salary: "", location: "" });
  const [posted, setPosted] = useState(false);

  function handlePost() {
    if (!form.title || !form.skills) return;
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
    setForm({ title: "", skills: "", salary: "", location: "" });
  }

  const tabs: { id: "overview" | "post" | "matches"; label: string }[] = [
    { id: "overview", label: "📋 Active Roles" },
    { id: "post", label: "➕ Post a Role" },
    { id: "matches", label: "🤝 AI Matches" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, padding: "1.75rem 1.5rem", borderBottom: `3px solid ${GOLD}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <div style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>FORTIS Digital Skills Hub</div>
              <h1 style={{ margin: "0 0 0.3rem", color: WHITE, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800 }}>🏢 Employer Dashboard</h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>
                Post roles · AI-match certified talent · Build Gambia&apos;s digital workforce
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/training/hub" style={{ padding: "0.55rem 1rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: WHITE, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                🎓 Skills Hub
              </a>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1.25rem" }}>
            {[
              { label: "Active Roles", value: MOCK_ROLES.length, icon: "💼" },
              { label: "AI Matches", value: MOCK_MATCHES.length, icon: "🤝" },
              { label: "Certified Candidates", value: "48+", icon: "🏅" },
              { label: "Hires via FORTIS", value: "12", icon: "✅" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "0.75rem 1rem" }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: "1.2rem", color: GOLD }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "2px solid #E2E8F0", paddingBottom: "0.75rem" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "0.55rem 1.1rem",
                background: activeTab === t.id ? PRIMARY : WHITE,
                color: activeTab === t.id ? WHITE : "#6B7280",
                border: `1.5px solid ${activeTab === t.id ? PRIMARY : "#E2E8F0"}`,
                borderRadius: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {MOCK_ROLES.map((role) => (
              <div key={role.id} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.4rem", color: DARK, fontSize: "1rem", fontWeight: 700 }}>{role.title}</h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {role.skills.map((s) => (
                      <span key={s} style={{ padding: "2px 8px", background: "#EFF6FF", color: "#1D4ED8", borderRadius: 999, fontSize: "0.7rem", fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", color: "#6B7280", flexWrap: "wrap" }}>
                    <span>📍 {role.location}</span>
                    <span>💰 {role.salaryRange}</span>
                    <span>📅 Posted {role.postedAt}</span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 900, fontSize: "1.5rem", color: PRIMARY }}>{role.matches}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>AI Matches</div>
                  <button onClick={() => setActiveTab("matches")} style={{ marginTop: 8, padding: "0.45rem 0.9rem", background: PRIMARY, color: WHITE, border: "none", borderRadius: 7, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    View Matches
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post a Role */}
        {activeTab === "post" && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem" }}>
              <h2 style={{ margin: "0 0 1.25rem", color: DARK, fontSize: "1.05rem", fontWeight: 800 }}>Post a New Role</h2>
              {posted && (
                <div style={{ background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.85rem", color: "#065F46", fontWeight: 600 }}>
                  ✅ Role posted! AI is now matching certified candidates.
                </div>
              )}
              {[
                { key: "title", label: "Job Title *", placeholder: "e.g. Junior Web Developer" },
                { key: "skills", label: "Required Skills *", placeholder: "e.g. HTML, CSS, JavaScript (comma-separated)" },
                { key: "salary", label: "Salary Range", placeholder: "e.g. GMD 8,000 – 15,000/month" },
                { key: "location", label: "Location", placeholder: "e.g. Banjul, Remote, Hybrid" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>{f.label}</label>
                  <input
                    type="text"
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: "0.85rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
              ))}
              <button
                onClick={handlePost}
                disabled={!form.title || !form.skills}
                style={{ width: "100%", padding: "0.75rem", background: !form.title || !form.skills ? "#9CA3AF" : `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 8, fontSize: "0.9rem", fontWeight: 700, cursor: !form.title || !form.skills ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              >
                🤝 Post & AI-Match Talent
              </button>
              <p style={{ margin: "0.75rem 0 0", fontSize: "0.75rem", color: "#9CA3AF", textAlign: "center" }}>
                FORTIS AI will immediately match your role against certified candidates and notify you.
              </p>
            </div>
          </div>
        )}

        {/* AI Matches */}
        {activeTab === "matches" && (
          <div>
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.82rem", color: "#1D4ED8" }}>
              🤖 <strong>AI Match Results</strong> — Ranked by FORTIS certification score + skill alignment. All candidates are verified graduates.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {MOCK_MATCHES.map((m, i) => (
                <div key={i} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderLeft: `5px solid ${i === 0 ? GOLD : PRIMARY}`, borderRadius: 12, padding: "1.25rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    {i === 0 && <span style={{ padding: "2px 8px", background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: 999, fontSize: "0.68rem", fontWeight: 700, display: "inline-block", marginBottom: 6 }}>⭐ TOP MATCH</span>}
                    <h3 style={{ margin: "0 0 0.3rem", color: DARK, fontSize: "0.95rem", fontWeight: 700 }}>{m.name}</h3>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280", marginBottom: "0.4rem" }}>{m.program}</div>
                    <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "#6B7280", flexWrap: "wrap" }}>
                      <span>📍 {m.location}</span>
                      <span>⏰ Available: {m.available}</span>
                      <span style={{ fontFamily: "monospace", fontSize: "0.7rem" }}>{m.cert}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ fontWeight: 900, fontSize: "1.4rem", color: m.score >= 90 ? "#16A34A" : PRIMARY }}>{m.score}%</div>
                    <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>Match Score</div>
                    <button style={{ padding: "0.45rem 0.9rem", background: `linear-gradient(135deg, ${GOLD}, #D4A855)`, color: DARK, border: "none", borderRadius: 7, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Contact →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
