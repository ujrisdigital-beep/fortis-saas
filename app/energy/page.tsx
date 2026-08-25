"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

type SolarResult = {
  monthlySavings: number;
  annualSavings: number;
  systemSizeKw: number;
  systemCost: number;
  paybackYears: number;
  co2Saved: number;
};

export default function EnergyPage() {
  const [bill, setBill] = useState("");
  const [roofSize, setRoofSize] = useState("");
  const [result, setResult] = useState<SolarResult | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const monthlyBill = Number(bill);
    const roof = Number(roofSize);
    if (!monthlyBill || !roof) return;

    const monthlySavings = monthlyBill * 0.7;
    const annualSavings = monthlySavings * 12;
    const systemSizeKw = Math.max(1, Math.round((roof * 0.08) * 10) / 10);
    const systemCost = systemSizeKw * 48000;
    const paybackYears = Math.round((systemCost / annualSavings) * 10) / 10;
    const co2Saved = Math.round(systemSizeKw * 1.5 * 10) / 10;

    setResult({ monthlySavings, annualSavings, systemSizeKw, systemCost, paybackYears, co2Saved });
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={headerBandStyle}>
          <div style={headerInnerStyle}>
            <span style={sectorTagStyle}>GROW · ILLUSTRATIVE MODEL</span>
            <h1 style={pageTitleStyle}>Solar bill estimator</h1>
            <p style={pageSubStyle}>
              Planning maths for a Gambian roof. Not a NAWEC bill, not live irradiance, not an installer quote.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>
            {/* Form */}
            <div className="fortis-card" style={formCardStyle}>
              <h2 style={cardTitleStyle}>Your Energy Details</h2>
              <form onSubmit={calculate} style={formStyle}>
                <Field
                  label="Monthly Electricity Bill (GMD)"
                  type="number"
                  value={bill}
                  onChange={setBill}
                  placeholder="e.g. 2500"
                  required
                />
                <Field
                  label="Available Roof Size (sqm)"
                  type="number"
                  value={roofSize}
                  onChange={setRoofSize}
                  placeholder="e.g. 40"
                  required
                />
                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
                  ⚡ Calculate Solar Savings
                </button>
              </form>
            </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!result && (
                <div style={emptyCardStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>☀️</p>
                  <p style={emptyTextStyle}>Enter your details to see your solar potential</p>
                </div>
              )}
              {result && (
                <>
                  <div style={resultBannerStyle}>
                    <div style={bigStatStyle}>
                      <span style={bigNumberStyle}>GMD {Math.round(result.monthlySavings).toLocaleString()}</span>
                      <span style={bigLabelStyle}>Monthly Savings</span>
                    </div>
                    <div style={bigStatStyle}>
                      <span style={bigNumberStyle}>{result.paybackYears} yrs</span>
                      <span style={bigLabelStyle}>Payback Period</span>
                    </div>
                    <div style={bigStatStyle}>
                      <span style={bigNumberStyle}>{result.systemSizeKw} kW</span>
                      <span style={bigLabelStyle}>System Size</span>
                    </div>
                  </div>

                  <div style={resultGridStyle}>
                    <ResultCard icon="💰" label="Annual Savings" value={`GMD ${Math.round(result.annualSavings).toLocaleString()}`} />
                    <ResultCard icon="🔧" label="Estimated System Cost" value={`GMD ${Math.round(result.systemCost).toLocaleString()}`} />
                    <ResultCard icon="🌿" label="CO₂ Saved Per Year" value={`${result.co2Saved} tonnes`} />
                    <ResultCard
                      icon="✅"
                      label="Investment Verdict"
                      value={result.paybackYears < 5 ? "Excellent ROI" : result.paybackYears < 8 ? "Good Investment" : "Worth Considering"}
                      highlight
                    />
                  </div>

                  <div style={adviceCardStyle}>
                    <p style={adviceTitleStyle}>Recommendation</p>
                    <p style={adviceTextStyle}>
                      A <strong>{result.systemSizeKw} kW</strong> solar system on your{" "}
                      {roofSize} sqm roof could save you{" "}
                      <strong>GMD {Math.round(result.annualSavings).toLocaleString()} per year</strong> and pay for itself
                      in <strong>{result.paybackYears} years</strong>. Contact a certified solar installer in The Gambia to
                      get a formal quote and site assessment.
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

function Field({ label, type = "text", value, onChange, placeholder, required }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} className="fortis-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} min={type === "number" ? "0" : undefined} />
    </div>
  );
}

function ResultCard({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ ...resultCardBase, ...(highlight ? resultCardHighlight : {}) }}>
      <span style={{ fontSize: "1.4rem" }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: highlight ? "#D4AF37" : "#1B4D3E" }}>{label}</p>
        <p style={{ margin: "0.15rem 0 0", fontWeight: 800, fontSize: "1.05rem", color: highlight ? "#FFFFFF" : "#0A1C2E" }}>{value}</p>
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
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const emptyCardStyle: React.CSSProperties = { background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: "0.85rem", padding: "4rem 2rem", textAlign: "center" as const, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" };
const emptyTextStyle: React.CSSProperties = { color: "#64748B", fontSize: "0.95rem", margin: 0 };
const resultBannerStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", borderRadius: "0.85rem", padding: "1.5rem 2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" as const };
const bigStatStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.25rem", flex: 1 };
const bigNumberStyle: React.CSSProperties = { fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "#D4AF37", lineHeight: 1 };
const bigLabelStyle: React.CSSProperties = { fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)" };
const resultGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.85rem" };
const resultCardBase: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.85rem" };
const resultCardHighlight: React.CSSProperties = { background: "#1B4D3E", border: "none" };
const adviceCardStyle: React.CSSProperties = { background: "rgba(27,77,62,0.05)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" };
const adviceTitleStyle: React.CSSProperties = { margin: "0 0 0.5rem", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1B4D3E" };
const adviceTextStyle: React.CSSProperties = { margin: 0, fontSize: "0.92rem", color: "#0A1C2E", lineHeight: 1.7 };
