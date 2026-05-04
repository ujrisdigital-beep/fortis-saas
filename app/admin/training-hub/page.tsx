"use client";
// app/admin/training-hub/page.tsx
// Admin: Training Hub management — courses, enrollments, assessments, certificates, employer partnerships
import { useState } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const STATS = [
  { label: "Courses Published", value: 6, icon: "🎓", color: PRIMARY },
  { label: "Enrolled Learners", value: 1418, icon: "👥", color: "#3B82F6" },
  { label: "Certificates Issued", value: 312, icon: "🏅", color: "#16A34A" },
  { label: "Flagged Assessments", value: 4, icon: "🚨", color: "#DC2626" },
  { label: "Employer Partners", value: 11, icon: "🏢", color: GOLD },
  { label: "Job Matches", value: 87, icon: "🤝", color: "#8B5CF6" },
];

const MOCK_COURSES = [
  { id: "1", title: "Web Development Fundamentals", sector: "Digital & Tech", level: "Beginner", enrolled: 248, certs: 89, status: "PUBLISHED" },
  { id: "2", title: "Mobile Money & Digital Payments", sector: "Fintech", level: "Beginner", enrolled: 312, certs: 124, status: "PUBLISHED" },
  { id: "3", title: "Data Analysis for Business", sector: "Digital & Tech", level: "Intermediate", enrolled: 187, certs: 61, status: "PUBLISHED" },
  { id: "4", title: "Digital Marketing Mastery", sector: "Digital & Tech", level: "Beginner", enrolled: 421, certs: 0, status: "DRAFT" },
  { id: "5", title: "Cybersecurity Essentials", sector: "Digital & Tech", level: "Intermediate", enrolled: 94, certs: 22, status: "PUBLISHED" },
  { id: "6", title: "Smart Agriculture & AgriTech", sector: "Agriculture", level: "Beginner", enrolled: 156, certs: 16, status: "PUBLISHED" },
];

const MOCK_FLAGS = [
  { user: "Ebrima D.", course: "Web Dev Fundamentals", score: 95, tabSwitches: 7, time: "18s", reason: "7 tab switches + unusually fast", status: "pending" },
  { user: "Mariama S.", course: "Cybersecurity Essentials", score: 88, tabSwitches: 4, time: "42s", reason: "4 tab switches detected", status: "pending" },
  { user: "Ousman J.", course: "Data Analysis", score: 91, tabSwitches: 5, time: "31s", reason: "5 tab switches + fast", status: "cleared" },
  { user: "Binta K.", course: "Mobile Money", score: 72, tabSwitches: 8, time: "22s", reason: "8 tab switches + very fast", status: "pending" },
];

const MOCK_EMPLOYERS = [
  { company: "Africell Gambia", sector: "Telecom", roles: 3, matches: 24, verified: true },
  { company: "QCell", sector: "Telecom", roles: 2, matches: 18, verified: true },
  { company: "TrustBank Gambia", sector: "Fintech", roles: 4, matches: 31, verified: true },
  { company: "National Water & Electricity Company", sector: "Energy", roles: 1, matches: 8, verified: false },
];

const MOCK_CERTS = [
  { certNo: "FORTIS-2026-45231", name: "Amadou Jallow", program: "Web Dev Fundamentals", score: 94, issued: "2026-04-15" },
  { certNo: "FORTIS-2026-45188", name: "Fatou Ceesay", program: "Web Dev Fundamentals", score: 89, issued: "2026-04-14" },
  { certNo: "FORTIS-2026-45301", name: "Lamin Bojang", program: "Digital Marketing", score: 96, issued: "2026-04-16" },
];

type Tab = "courses" | "flags" | "certificates" | "employers" | "generate";

export default function TrainingHubAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [flagDecisions, setFlagDecisions] = useState<Record<number, "cleared" | "revoked">>({});
  const [genTopic, setGenTopic] = useState("");
  const [genSector, setGenSector] = useState("digital");
  const [genLevel, setGenLevel] = useState("beginner");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<string | null>(null);

  async function handleGenerate() {
    if (!genTopic) return;
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch("/api/training/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: genTopic, sector: genSector, level: genLevel }),
      });
      const data = await res.json();
      if (data.course) {
        setGenResult(`✅ Course "${data.course.title}" generated with ${data.course.modules?.length ?? 0} modules. ${data.fallback ? "(fallback mode)" : `${data.tokens} tokens used.`}`);
      } else {
        setGenResult(`❌ Generation failed: ${data.error ?? "Unknown error"}`);
      }
    } catch {
      setGenResult("❌ Network error — check API configuration.");
    } finally {
      setGenerating(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "courses", label: "📚 Courses" },
    { id: "flags", label: `🚨 Flagged (${MOCK_FLAGS.filter((f) => f.status === "pending").length})` },
    { id: "certificates", label: "🏅 Certificates" },
    { id: "employers", label: "🏢 Employers" },
    { id: "generate", label: "🤖 AI Generate" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, padding: "1.5rem 1.5rem 1.25rem", borderBottom: `3px solid ${GOLD}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div>
              <Link href="/admin/ai-monitor" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Admin</Link>
              <h1 style={{ margin: "0.25rem 0 0.2rem", color: WHITE, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 800 }}>🎓 Training Hub Admin</h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.8rem" }}>
                AI-administered · Course management · Assessment review · Certificate issuance
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/training/hub" style={{ padding: "0.5rem 0.9rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: WHITE, borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Public Hub
              </a>
              <a href="/employers/dashboard" style={{ padding: "0.5rem 0.9rem", background: GOLD, color: DARK, borderRadius: 7, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                Employer Portal
              </a>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.65rem" }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.65rem 0.85rem" }}>
                <div style={{ fontSize: 16 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", color: GOLD }}>{s.value.toLocaleString()}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "0.5rem 1rem",
                background: activeTab === t.id ? PRIMARY : WHITE,
                color: activeTab === t.id ? WHITE : "#6B7280",
                border: `1.5px solid ${activeTab === t.id ? PRIMARY : "#E2E8F0"}`,
                borderRadius: 8,
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Courses tab */}
        {activeTab === "courses" && (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Course", "Sector", "Level", "Enrolled", "Certs", "Status", ""].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_COURSES.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F0F4F0" }}>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", fontWeight: 600, color: DARK }}>{c.title}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: "#6B7280" }}>{c.sector}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: "#6B7280" }}>{c.level}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", fontWeight: 600, color: PRIMARY }}>{c.enrolled}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", fontWeight: 600, color: "#16A34A" }}>{c.certs}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 999, background: c.status === "PUBLISHED" ? "#D1FAE5" : "#FEF3C7", color: c.status === "PUBLISHED" ? "#065F46" : "#92400E", fontSize: "0.68rem", fontWeight: 700 }}>{c.status}</span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <a href="/training/learn" style={{ fontSize: "0.72rem", color: PRIMARY, fontWeight: 600, textDecoration: "none" }}>Preview →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Flagged assessments */}
        {activeTab === "flags" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {MOCK_FLAGS.map((f, i) => {
              const decision = flagDecisions[i];
              const resolved = decision || f.status === "cleared";
              return (
                <div key={i} style={{ background: WHITE, border: `2px solid ${resolved ? "#D1FAE5" : "#FECACA"}`, borderLeft: `5px solid ${resolved ? "#16A34A" : "#DC2626"}`, borderRadius: 12, padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: DARK }}>{f.user} — {f.course}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: 3 }}>
                      Score: <strong>{f.score}%</strong> · Tab switches: <strong style={{ color: "#DC2626" }}>{f.tabSwitches}</strong> · Time: <strong>{f.time}</strong>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: 3 }}>🚨 {f.reason}</div>
                  </div>
                  {resolved ? (
                    <span style={{ padding: "4px 12px", background: "#D1FAE5", color: "#065F46", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700 }}>
                      {decision === "revoked" ? "🚫 Revoked" : "✅ Cleared"}
                    </span>
                  ) : (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => setFlagDecisions((p) => ({ ...p, [i]: "cleared" }))} style={{ padding: "0.5rem 1rem", background: "#16A34A", color: WHITE, border: "none", borderRadius: 7, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        ✅ Clear & Issue Cert
                      </button>
                      <button onClick={() => setFlagDecisions((p) => ({ ...p, [i]: "revoked" }))} style={{ padding: "0.5rem 1rem", background: "#DC2626", color: WHITE, border: "none", borderRadius: 7, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        🚫 Revoke
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Certificates */}
        {activeTab === "certificates" && (
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Certificate No.", "Learner", "Programme", "Score", "Issued", ""].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_CERTS.map((c) => (
                  <tr key={c.certNo} style={{ borderBottom: "1px solid #F0F4F0" }}>
                    <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace", fontSize: "0.78rem", color: PRIMARY }}>{c.certNo}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", fontWeight: 600, color: DARK }}>{c.name}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: "#6B7280" }}>{c.program}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", fontWeight: 700, color: "#16A34A" }}>{c.score}%</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: "#6B7280" }}>{c.issued}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <a href="/training/verify" style={{ fontSize: "0.72rem", color: PRIMARY, fontWeight: 600, textDecoration: "none" }}>Verify →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Employers */}
        {activeTab === "employers" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {MOCK_EMPLOYERS.map((e, i) => (
              <div key={i} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: DARK }}>{e.company}</div>
                  {e.verified ? (
                    <span style={{ fontSize: "0.68rem", background: "#D1FAE5", color: "#065F46", padding: "2px 7px", borderRadius: 999, fontWeight: 700 }}>✓ Verified</span>
                  ) : (
                    <span style={{ fontSize: "0.68rem", background: "#FEF3C7", color: "#92400E", padding: "2px 7px", borderRadius: 999, fontWeight: 700 }}>Pending</span>
                  )}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6B7280", marginBottom: "0.5rem" }}>{e.sector}</div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div>
                    <div style={{ fontWeight: 800, color: PRIMARY, fontSize: "1.1rem" }}>{e.roles}</div>
                    <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>Open Roles</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#3B82F6", fontSize: "1.1rem" }}>{e.matches}</div>
                    <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>AI Matches</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Generate */}
        {activeTab === "generate" && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem" }}>
              <h2 style={{ margin: "0 0 0.5rem", color: DARK, fontSize: "1.05rem", fontWeight: 800 }}>🤖 AI Course Generator</h2>
              <p style={{ margin: "0 0 1.25rem", fontSize: "0.82rem", color: "#6B7280" }}>
                GPT-4 generates a complete course with modules, quizzes, and a capstone project. Takes ~15 seconds.
              </p>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Topic *</label>
                <input type="text" value={genTopic} onChange={(e) => setGenTopic(e.target.value)} placeholder="e.g. Python Programming, Solar Energy, E-Commerce" style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: "0.85rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Sector</label>
                  <select value={genSector} onChange={(e) => setGenSector(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: "0.85rem", fontFamily: "inherit", background: WHITE, outline: "none" }}>
                    {["digital", "fintech", "agriculture", "health", "energy"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Level</label>
                  <select value={genLevel} onChange={(e) => setGenLevel(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: "0.85rem", fontFamily: "inherit", background: WHITE, outline: "none" }}>
                    {["beginner", "intermediate", "advanced"].map((l) => (
                      <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={handleGenerate} disabled={!genTopic || generating} style={{ width: "100%", padding: "0.75rem", background: !genTopic || generating ? "#9CA3AF" : `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 8, fontSize: "0.9rem", fontWeight: 700, cursor: !genTopic || generating ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {generating ? "⏳ Generating course…" : "🤖 Generate Course with AI"}
              </button>
              {genResult && (
                <div style={{ marginTop: "1rem", background: genResult.startsWith("✅") ? "#D1FAE5" : "#FEE2E2", border: `1px solid ${genResult.startsWith("✅") ? "#6EE7B7" : "#FECACA"}`, borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.82rem", color: genResult.startsWith("✅") ? "#065F46" : "#991B1B" }}>
                  {genResult}
                </div>
              )}
              {!process.env.NEXT_PUBLIC_HAS_OPENAI && (
                <p style={{ margin: "0.75rem 0 0", fontSize: "0.72rem", color: "#9CA3AF", textAlign: "center" }}>
                  Set OPENAI_API_KEY in Vercel to enable live generation. Without it, a structured fallback course is returned.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
