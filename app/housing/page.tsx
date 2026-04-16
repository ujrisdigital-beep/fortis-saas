"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

type MortgageResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  downPaymentAmount: number;
  affordability: string;
  affordabilityColor: string;
  monthlyIncomeNeeded: number;
};

export default function HousingPage() {
  const [price, setPrice] = useState("");
  const [downPercent, setDownPercent] = useState("20");
  const [termYears, setTermYears] = useState("15");
  const [interestRate, setInterestRate] = useState("18");
  const [result, setResult] = useState<MortgageResult | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const P = Number(price);
    const down = Number(downPercent) / 100;
    const years = Number(termYears);
    const annualRate = Number(interestRate) / 100;

    if (!P || !years || !annualRate) return;

    const downAmt = P * down;
    const loanAmt = P - downAmt;
    const r = annualRate / 12;
    const n = years * 12;

    const monthly = r === 0 ? loanAmt / n : (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - loanAmt;
    const incomeNeeded = monthly / 0.3;

    let affordability = "Affordable";
    let affordabilityColor = "#10B981";
    if (monthly > 10000) { affordability = "High Commitment"; affordabilityColor = "#D4AF37"; }
    if (monthly > 25000) { affordability = "Very High — Seek Advice"; affordabilityColor = "#E63946"; }

    setResult({
      monthlyPayment: Math.round(monthly),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      loanAmount: Math.round(loanAmt),
      downPaymentAmount: Math.round(downAmt),
      affordability,
      affordabilityColor,
      monthlyIncomeNeeded: Math.round(incomeNeeded),
    });
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={headerBandStyle}>
          <div style={headerInnerStyle}>
            <span style={sectorTagStyle}>🏠 HOUSING SECTOR</span>
            <h1 style={pageTitleStyle}>Mortgage Calculator</h1>
            <p style={pageSubStyle}>
              Calculate your monthly mortgage payments, total interest, and affordability for property purchases in The Gambia.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>
            {/* Form */}
            <div className="fortis-card" style={formCardStyle}>
              <h2 style={cardTitleStyle}>Property Details</h2>
              <form onSubmit={calculate} style={formStyle}>
                <NumField label="Property Price (GMD)" value={price} onChange={setPrice} placeholder="e.g. 2500000" />
                <NumField label="Down Payment (%)" value={downPercent} onChange={setDownPercent} placeholder="e.g. 20" min="5" max="100" />
                <NumField label="Loan Term (years)" value={termYears} onChange={setTermYears} placeholder="e.g. 15" min="1" max="30" />
                <NumField label="Annual Interest Rate (%)" value={interestRate} onChange={setInterestRate} placeholder="e.g. 18" min="1" max="50" />
                <p style={hintStyle}>Typical Gambia mortgage rate: 18–22% p.a.</p>
                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  🏠 Calculate Mortgage
                </button>
              </form>
            </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!result && (
                <div style={emptyCardStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>🏡</p>
                  <p style={emptyTextStyle}>Enter property details to calculate your mortgage</p>
                </div>
              )}
              {result && (
                <>
                  <div style={resultBannerStyle}>
                    <Stat label="Monthly Payment" value={`GMD ${result.monthlyPayment.toLocaleString()}`} />
                    <Stat label="Total Interest" value={`GMD ${result.totalInterest.toLocaleString()}`} />
                    <Stat label="Total Cost" value={`GMD ${result.totalPayment.toLocaleString()}`} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <InfoBox label="Loan Amount" value={`GMD ${result.loanAmount.toLocaleString()}`} />
                    <InfoBox label="Down Payment" value={`GMD ${result.downPaymentAmount.toLocaleString()}`} />
                    <InfoBox label="Min Monthly Income Needed" value={`GMD ${result.monthlyIncomeNeeded.toLocaleString()}`} />
                    <div style={{ ...infoBoxStyle, borderColor: result.affordabilityColor, background: result.affordabilityColor + "15" }}>
                      <p style={{ margin: "0 0 0.3rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: result.affordabilityColor }}>Affordability</p>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: "1rem", color: result.affordabilityColor }}>{result.affordability}</p>
                    </div>
                  </div>

                  <div style={adviceCardStyle}>
                    <p style={adviceTitleStyle}>Financial Guidance</p>
                    <p style={adviceTextStyle}>
                      Your estimated monthly payment of <strong>GMD {result.monthlyPayment.toLocaleString()}</strong> requires a
                      minimum monthly income of approximately <strong>GMD {result.monthlyIncomeNeeded.toLocaleString()}</strong>{" "}
                      (using the 30% income rule). Over {termYears} years you will pay a total of{" "}
                      <strong>GMD {result.totalInterest.toLocaleString()}</strong> in interest.
                      Consider a larger down payment or shorter term to reduce this. Contact Trust Bank Gambia or a licensed mortgage broker for official quotes.
                    </p>
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

function NumField({ label, value, onChange, placeholder, min, max }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; min?: string; max?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={labelStyle}>{label}</label>
      <input type="number" className="fortis-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} min={min} max={max} required />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, color: "#D4AF37" }}>{value}</p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)" }}>{label}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoBoxStyle}>
      <p style={{ margin: "0 0 0.3rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1B4D3E" }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 800, fontSize: "1rem", color: "#0A1C2E" }}>{value}</p>
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
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const hintStyle: React.CSSProperties = { margin: "-0.25rem 0 0", fontSize: "0.78rem", color: "#64748B" };
const emptyCardStyle: React.CSSProperties = { background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: "0.85rem", padding: "4rem 2rem", textAlign: "center" as const, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" };
const emptyTextStyle: React.CSSProperties = { color: "#64748B", fontSize: "0.95rem", margin: 0 };
const resultBannerStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", borderRadius: "0.85rem", padding: "1.5rem 2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" as const };
const infoBoxStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1rem 1.25rem" };
const adviceCardStyle: React.CSSProperties = { background: "rgba(27,77,62,0.05)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" };
const adviceTitleStyle: React.CSSProperties = { margin: "0 0 0.5rem", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1B4D3E" };
const adviceTextStyle: React.CSSProperties = { margin: 0, fontSize: "0.92rem", color: "#0A1C2E", lineHeight: 1.7 };
