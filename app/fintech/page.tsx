"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

type CreditResult = {
  score: number;
  grade: string;
  gradeColor: string;
  gradeBg: string;
  eligible: boolean;
  maxLoan: number;
  breakdown: { label: string; points: number; max: number }[];
  advice: string;
};

export default function FintechPage() {
  const [income, setIncome] = useState("");
  const [hasLoans, setHasLoans] = useState<"yes" | "no">("no");
  const [mobileMoneyUsage, setMobileMoneyUsage] = useState<"yes" | "no">("yes");
  const [businessAge, setBusinessAge] = useState("");
  const [result, setResult] = useState<CreditResult | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const monthlyIncome = Number(income);
    const bAge = Number(businessAge);
    if (!monthlyIncome || bAge < 0) return;

    // Score components (total max 100)
    const incomeScore = Math.min(30, Math.round((monthlyIncome / 100000) * 30));
    const loanScore = hasLoans === "no" ? 25 : 10;
    const mobileScore = mobileMoneyUsage === "yes" ? 20 : 5;
    const ageScore = Math.min(25, Math.round((bAge / 10) * 25));
    const totalScore = incomeScore + loanScore + mobileScore + ageScore;

    const breakdown = [
      { label: "Monthly Income", points: incomeScore, max: 30 },
      { label: "Existing Loans", points: loanScore, max: 25 },
      { label: "Mobile Money Usage", points: mobileScore, max: 20 },
      { label: "Business Age", points: ageScore, max: 25 },
    ];

    let grade = "Poor";
    let gradeColor = "#E63946";
    let gradeBg = "#fff1f2";
    if (totalScore >= 80) { grade = "Excellent"; gradeColor = "#10B981"; gradeBg = "#f0fdf4"; }
    else if (totalScore >= 65) { grade = "Good"; gradeColor = "#1B4D3E"; gradeBg = "rgba(27,77,62,0.08)"; }
    else if (totalScore >= 50) { grade = "Fair"; gradeColor = "#D4AF37"; gradeBg = "#fffbeb"; }
    else if (totalScore >= 35) { grade = "Below Average"; gradeColor = "#F59E0B"; gradeBg = "#fff7ed"; }

    const eligible = totalScore >= 50;
    const maxLoan = eligible ? Math.round((monthlyIncome * 12 * (totalScore / 100)) * 3) : 0;

    const advice = eligible
      ? `Your credit profile qualifies you for a loan of up to GMD ${maxLoan.toLocaleString()}. Use mobile money consistently and pay existing loans promptly to improve your score further.`
      : "Your credit score is currently below the minimum threshold. Focus on reducing existing debts, increasing mobile money usage, and maintaining consistent income for 6+ months before reapplying.";

    setResult({ score: totalScore, grade, gradeColor, gradeBg, eligible, maxLoan, breakdown, advice });
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={headerBandStyle}>
          <div style={headerInnerStyle}>
            <span style={sectorTagStyle}>💳 FINTECH SECTOR</span>
            <h1 style={pageTitleStyle}>Credit Score Estimator</h1>
            <p style={pageSubStyle}>
              Estimate your creditworthiness and loan eligibility using the Gambian Informal Credit Scoring model.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>
            {/* Form */}
            <div className="fortis-card" style={formCardStyle}>
              <h2 style={cardTitleStyle}>Your Financial Profile</h2>
              <form onSubmit={calculate} style={formStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Monthly Income (GMD)</label>
                  <input type="number" className="fortis-input" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g. 15000" min="0" required />
                </div>

                <YesNo label="Do you have existing loans?" value={hasLoans} onChange={(v) => setHasLoans(v as "yes" | "no")} />
                <YesNo label="Do you actively use mobile money?" value={mobileMoneyUsage} onChange={(v) => setMobileMoneyUsage(v as "yes" | "no")} subtext="Wave, Africell Money, QMoney etc." />

                <div style={fieldStyle}>
                  <label style={labelStyle}>Business / Employment Age (years)</label>
                  <input type="number" className="fortis-input" value={businessAge} onChange={(e) => setBusinessAge(e.target.value)} placeholder="e.g. 3" min="0" step="0.5" required />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  💳 Estimate Credit Score
                </button>
              </form>
            </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!result && (
                <div style={emptyCardStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>💰</p>
                  <p style={emptyTextStyle}>Enter your financial details to estimate your credit score</p>
                </div>
              )}
              {result && (
                <>
                  {/* Score banner */}
                  <div style={{ background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", borderRadius: "0.85rem", padding: "1.75rem 2rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" as const }}>
                    <div style={{ position: "relative" }}>
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={`${(result.score / 100) * (2 * Math.PI * 42)} ${2 * Math.PI * 42}`}
                          transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 0.8s ease" }} />
                        <text x="50" y="44" textAnchor="middle" fontSize="24" fontWeight="800" fill="#FFFFFF">{result.score}</text>
                        <text x="50" y="60" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)">/100 SCORE</text>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "inline-block", padding: "0.3rem 0.9rem", borderRadius: "999px", background: result.gradeBg, color: result.gradeColor, fontWeight: 800, fontSize: "1rem", marginBottom: "0.4rem" }}>
                        {result.grade}
                      </div>
                      <p style={{ margin: "0.3rem 0 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                        Loan Eligible: <strong style={{ color: result.eligible ? "#10B981" : "#E63946" }}>{result.eligible ? "YES ✓" : "NO ✗"}</strong>
                      </p>
                      {result.eligible && (
                        <p style={{ margin: "0.3rem 0 0", fontSize: "1rem", color: "#D4AF37", fontWeight: 800 }}>
                          Max Loan: GMD {result.maxLoan.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>Score Breakdown</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {result.breakdown.map((item) => (
                        <div key={item.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0A1C2E" }}>{item.label}</span>
                            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1B4D3E" }}>{item.points}/{item.max}</span>
                          </div>
                          <div style={{ height: "6px", background: "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(item.points / item.max) * 100}%`, background: "#1B4D3E", borderRadius: "999px", transition: "width 0.6s ease" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advice */}
                  <div style={{ background: "rgba(27,77,62,0.05)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
                    <p style={{ margin: "0 0 0.5rem", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1B4D3E" }}>Advice</p>
                    <p style={{ margin: 0, fontSize: "0.92rem", color: "#0A1C2E", lineHeight: 1.7 }}>{result.advice}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function YesNo({ label, value, onChange, subtext }: { label: string; value: string; onChange: (v: string) => void; subtext?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={labelStyle}>{label}</label>
      {subtext && <span style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "-0.1rem" }}>{subtext}</span>}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {["yes", "no"].map((v) => (
          <button key={v} type="button" onClick={() => onChange(v)}
            style={{
              flex: 1, padding: "0.65rem", borderRadius: "0.5rem",
              border: `2px solid ${value === v ? "#1B4D3E" : "#E2E8F0"}`,
              background: value === v ? "#1B4D3E" : "#FFFFFF",
              color: value === v ? "#FFFFFF" : "#0A1C2E",
              fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
              textTransform: "capitalize" as const,
            }}
          >{v === "yes" ? "Yes" : "No"}</button>
        ))}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh" };
const headerBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "3rem 1.25rem 2.5rem" };
const headerInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const sectorTagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.85rem" };
const pageTitleStyle: React.CSSProperties = { margin: "0 0 0.6rem", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 };
const pageSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "55ch" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "380px 1fr", gap: "1.5rem", alignItems: "start" };
const formCardStyle: React.CSSProperties = { padding: "1.75rem" };
const cardTitleStyle: React.CSSProperties = { margin: "0 0 1.25rem", fontSize: "1.05rem", fontWeight: 700, color: "#0A1C2E" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "1rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.35rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const emptyCardStyle: React.CSSProperties = { background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: "0.85rem", padding: "4rem 2rem", textAlign: "center" as const, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" };
const emptyTextStyle: React.CSSProperties = { color: "#64748B", fontSize: "0.95rem", margin: 0 };
const sectionCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" };
const sectionLabelStyle: React.CSSProperties = { margin: "0 0 0.85rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#1B4D3E" };
