"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

interface Course {
  id: string;
  title: string;
  progress: number;
  status: string;
  program?: { title: string; sector: string; level: string; durationWeeks: number };
}

interface Certificate {
  id: string;
  programId: string;
  issuedAt: string;
  blockchainHash: string | null;
  program?: { title: string };
}

interface LearningData {
  industry: string | null;
  enrolledCourses: Course[];
  certificates: Certificate[];
  totalProgress: number;
  nextMilestone: string;
  simulationUrl: string | null;
}

const INDUSTRY_ICONS: Record<string, string> = {
  banking_finance: "🏦", telecommunications: "📡", agriculture: "🌾",
  energy: "⚡", health: "🏥", government: "🏛️", education: "🎓",
  sme_entrepreneurship: "🚀", general: "💻",
};

const INDUSTRY_LABELS: Record<string, string> = {
  banking_finance: "Banking & Finance", telecommunications: "Telecommunications",
  agriculture: "Agriculture", energy: "Energy & Utilities", health: "Healthcare",
  government: "Government & Civil Service", education: "Education",
  sme_entrepreneurship: "SME & Entrepreneurship", general: "Digital Literacy",
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "#16A34A", intermediate: "#D97706", advanced: "#DC2626",
};

export default function MyLearningPage() {
  const [data, setData] = useState<LearningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"courses" | "certificates">("courses");

  useEffect(() => {
    fetch("/api/training/progress")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load learning data."))
      .finally(() => setLoading(false));
  }, []);

  const industry = data?.industry ?? "general";
  const icon = INDUSTRY_ICONS[industry] ?? "💻";
  const label = INDUSTRY_LABELS[industry] ?? "Digital Literacy";
  const simUrl = data?.simulationUrl ?? `/training/simulate/${industry}`;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`,
        padding: "2.5rem 1.5rem 2rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} />
          <div style={{ flex: 1, background: WHITE }} />
          <div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Digital Skills Hub</span>
          </div>
          <h1 style={{ margin: "0 0 0.4rem", color: WHITE, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }}>
            🎓 My Learning Dashboard
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>
            Track your progress, earn certificates, and launch simulations
          </p>

          {/* Industry badge + quick actions */}
          {data && (
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "0.6rem 1rem" }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Track</div>
                  <div style={{ color: WHITE, fontSize: "0.88rem", fontWeight: 700 }}>{label}</div>
                </div>
              </div>
              <Link href={simUrl} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "0.6rem 1.2rem", borderRadius: 10,
                background: GOLD, color: DARK, fontSize: "0.85rem", fontWeight: 700, textDecoration: "none",
              }}>
                ▶ Launch Simulation
              </Link>
              <Link href="/training/hub" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "0.6rem 1.2rem", borderRadius: 10,
                border: "1.5px solid rgba(255,255,255,0.3)", color: WHITE, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none",
              }}>
                📚 All Courses
              </Link>
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ width: 40, height: 40, border: `4px solid ${PRIMARY}30`, borderTop: `4px solid ${PRIMARY}`, borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#6B7280", fontSize: "0.88rem" }}>Loading your learning data…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && !loading && (
          <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 12, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: "0.75rem" }}>🔒</div>
            <p style={{ fontWeight: 700, color: DARK, margin: "0 0 0.5rem" }}>Login Required</p>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", marginBottom: "1.25rem" }}>{error}</p>
            <Link href="/auth/login" style={{ display: "inline-block", padding: "0.65rem 1.5rem", background: PRIMARY, color: WHITE, borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
              Sign In to FORTIS OS →
            </Link>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "Enrolled Courses", value: data.enrolledCourses.length, icon: "📚", color: PRIMARY },
                { label: "Avg. Progress", value: `${Math.round(data.totalProgress)}%`, icon: "📈", color: "#D97706" },
                { label: "Certificates", value: data.certificates.length, icon: "🏆", color: "#7C3AED" },
                { label: "Next Milestone", value: data.nextMilestone, icon: "🎯", color: "#0891B2", small: true },
              ].map((s) => (
                <div key={s.label} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderTop: `4px solid ${s.color}`, borderRadius: 10, padding: "1rem 1.1rem" }}>
                  <div style={{ fontSize: 22, marginBottom: "0.35rem" }}>{s.icon}</div>
                  <div style={{ fontSize: s.small ? "0.82rem" : "1.6rem", fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6B7280", marginTop: "0.2rem", fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Overall progress bar */}
            {data.enrolledCourses.length > 0 && (
              <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1.1rem 1.25rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: DARK }}>Overall Learning Progress</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: PRIMARY }}>{Math.round(data.totalProgress)}%</span>
                </div>
                <div style={{ background: "#E8F5EF", borderRadius: 999, height: 10 }}>
                  <div style={{ width: `${data.totalProgress}%`, height: "100%", background: `linear-gradient(90deg, ${PRIMARY}, #2A6B52)`, borderRadius: 999, transition: "width 1s ease" }} />
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {(["courses", "certificates"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0.55rem 1.2rem", borderRadius: 8, border: "1.5px solid #E2E8F0",
                    background: activeTab === tab ? PRIMARY : WHITE,
                    color: activeTab === tab ? WHITE : DARK,
                    fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit",
                    textTransform: "capitalize",
                  }}
                >
                  {tab === "courses" ? `📚 Courses (${data.enrolledCourses.length})` : `🏆 Certificates (${data.certificates.length})`}
                </button>
              ))}
            </div>

            {/* Courses tab */}
            {activeTab === "courses" && (
              data.enrolledCourses.length === 0 ? (
                <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "2.5rem", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: "1rem" }}>📭</div>
                  <p style={{ fontWeight: 700, color: DARK, margin: "0 0 0.5rem" }}>No courses yet</p>
                  <p style={{ color: "#6B7280", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                    Auto-enroll based on your industry to get started.
                  </p>
                  <Link href="/training/hub" style={{ display: "inline-block", padding: "0.65rem 1.5rem", background: PRIMARY, color: WHITE, borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                    Explore Training Hub →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {data.enrolledCourses.map((course) => {
                    const prog = Math.min(100, Math.round(course.progress ?? 0));
                    const level = course.program?.level ?? "beginner";
                    const weeks = course.program?.durationWeeks ?? 4;
                    return (
                      <div key={course.id} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1.1rem 1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.6rem" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: DARK }}>{course.program?.title ?? course.title}</div>
                            <div style={{ display: "flex", gap: 6, marginTop: "0.25rem", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: `${LEVEL_COLOR[level]}15`, color: LEVEL_COLOR[level], border: `1px solid ${LEVEL_COLOR[level]}30` }}>
                                {level}
                              </span>
                              <span style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600 }}>{weeks} weeks</span>
                              <span style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 600 }}>{course.program?.sector ?? ""}</span>
                            </div>
                          </div>
                          <span style={{
                            fontSize: "0.8rem", fontWeight: 800,
                            color: prog === 100 ? "#16A34A" : PRIMARY,
                          }}>{prog}%</span>
                        </div>
                        <div style={{ background: "#E8F5EF", borderRadius: 999, height: 7 }}>
                          <div style={{
                            width: `${prog}%`, height: "100%", borderRadius: 999,
                            background: prog === 100 ? "#22C55E" : `linear-gradient(90deg, ${PRIMARY}, #2A6B52)`,
                            transition: "width 0.8s ease",
                          }} />
                        </div>
                        {prog === 100 && (
                          <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#16A34A", fontWeight: 700 }}>✅ Completed — certificate available</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Certificates tab */}
            {activeTab === "certificates" && (
              data.certificates.length === 0 ? (
                <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "2.5rem", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: "1rem" }}>🏆</div>
                  <p style={{ fontWeight: 700, color: DARK, margin: "0 0 0.5rem" }}>No certificates yet</p>
                  <p style={{ color: "#6B7280", fontSize: "0.85rem" }}>Complete a course to earn your first blockchain-verified certificate.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
                  {data.certificates.map((cert) => (
                    <div key={cert.id} style={{
                      background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`,
                      borderRadius: 12, padding: "1.5rem", border: `2px solid ${GOLD}40`,
                    }}>
                      <div style={{ fontSize: 32, marginBottom: "0.75rem" }}>🏆</div>
                      <div style={{ color: GOLD, fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                        {cert.program?.title ?? "Certificate"}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", marginBottom: "0.75rem" }}>
                        Issued {new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      {cert.blockchainHash && (
                        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "0.4rem 0.6rem" }}>
                          <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.2rem", fontWeight: 600 }}>BLOCKCHAIN HASH</div>
                          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", fontFamily: "monospace", wordBreak: "break-all" }}>
                            {cert.blockchainHash.substring(0, 32)}…
                          </div>
                        </div>
                      )}
                      <Link href={`/training/verify?cert=${cert.id}`} style={{
                        display: "block", marginTop: "0.85rem", textAlign: "center", padding: "0.5rem",
                        background: GOLD, color: DARK, borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, textDecoration: "none",
                      }}>
                        Verify Certificate →
                      </Link>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Simulation CTA */}
            <div style={{
              marginTop: "2.5rem",
              background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`,
              borderRadius: 14, padding: "1.75rem 2rem",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.25rem",
            }}>
              <div>
                <div style={{ color: GOLD, fontWeight: 800, fontSize: "1rem", marginBottom: "0.25rem" }}>
                  {icon} Ready to simulate?
                </div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                  Apply your {label} skills in the interactive simulation environment.
                </p>
              </div>
              <Link href={simUrl} style={{
                padding: "0.75rem 1.5rem", background: GOLD, color: DARK, borderRadius: 10,
                fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", whiteSpace: "nowrap",
              }}>
                ▶ Start Simulation →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
