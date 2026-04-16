"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

type WasteData = {
  revenuePerKg: number;
  co2PerKg: number;
  equipment: string;
  buyer: string;
  note: string;
};

const WASTE_INFO: Record<string, WasteData> = {
  plastic: {
    revenuePerKg: 8,
    co2PerKg: 2.5,
    equipment: "Baler / Shredder (GMD 45,000–80,000). Manual sorting tables for separation.",
    buyer: "Gambia Plastics Recycling Co., Kanifing Industrial Area",
    note: "PET bottles and HDPE containers command the highest prices. Clean, sorted plastic earns more.",
  },
  paper: {
    revenuePerKg: 5,
    co2PerKg: 1.8,
    equipment: "Baler (GMD 30,000–55,000). Storage shelter required to keep paper dry.",
    buyer: "West Africa Paper Recyclers, Banjul Port area",
    note: "Cardboard boxes earn the most. Keep paper dry — wet paper reduces value by 70%.",
  },
  organic: {
    revenuePerKg: 3,
    co2PerKg: 0.8,
    equipment: "Compost turner or biogas digester (GMD 15,000–40,000). Collection bins and PPE.",
    buyer: "Local farms and garden centres. Kombo Agricultural Station.",
    note: "Organic waste becomes valuable compost or biogas. Restaurants and markets are ideal sources.",
  },
};

type WasteResult = {
  monthlyRevenue: number;
  annualRevenue: number;
  annualCO2: number;
  savingsOnDisposal: number;
  netAnnualBenefit: number;
  equipment: string;
  buyer: string;
  note: string;
  paybackMonths: number;
  equipmentCost: number;
};

const EQUIP_COST: Record<string, number> = { plastic: 60000, paper: 40000, organic: 25000 };

export default function WastePage() {
  const [wasteType, setWasteType] = useState("plastic");
  const [volume, setVolume] = useState("");
  const [disposalCost, setDisposalCost] = useState("");
  const [result, setResult] = useState<WasteResult | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const kg = Number(volume);
    const disposal = Number(disposalCost);
    if (!kg) return;

    const info = WASTE_INFO[wasteType];
    const monthlyRevenue = Math.round(kg * info.revenuePerKg);
    const annualRevenue = monthlyRevenue * 12;
    const annualCO2 = Math.round(kg * 12 * info.co2PerKg * 10) / 10;
    const savingsOnDisposal = disposal * 12;
    const netAnnualBenefit = annualRevenue + savingsOnDisposal;
    const equipmentCost = EQUIP_COST[wasteType];
    const paybackMonths = netAnnualBenefit > 0 ? Math.round((equipmentCost / netAnnualBenefit) * 12) : 0;

    setResult({ monthlyRevenue, annualRevenue, annualCO2, savingsOnDisposal, netAnnualBenefit, equipment: info.equipment, buyer: info.buyer, note: info.note, paybackMonths, equipmentCost });
  }

  const wasteIcons: Record<string, string> = { plastic: "🧴", paper: "📦", organic: "🌿" };

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={headerBandStyle}>
          <div style={headerInnerStyle}>
            <span style={sectorTagStyle}>♻️ WASTE SECTOR</span>
            <h1 style={pageTitleStyle}>Recycling ROI Calculator</h1>
            <p style={pageSubStyle}>
              Calculate the revenue potential, environmental impact, and payback period for recycling your waste in The Gambia.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>
            {/* Form */}
            <div className="fortis-card" style={formCardStyle}>
              <h2 style={cardTitleStyle}>Waste Details</h2>
              <form onSubmit={calculate} style={formStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Waste Type</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {["plastic", "paper", "organic"].map((w) => (
                      <button key={w} type="button"
                        onClick={() => setWasteType(w)}
                        style={{
                          flex: 1, padding: "0.75rem 0.5rem", borderRadius: "0.5rem", border: `2px solid ${wasteType === w ? "#1B4D3E" : "#E2E8F0"}`,
                          background: wasteType === w ? "#1B4D3E" : "#FFFFFF",
                          color: wasteType === w ? "#FFFFFF" : "#0A1C2E",
                          fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", textAlign: "center" as const,
                        }}
                      >{wasteIcons[w]}<br />{w.charAt(0).toUpperCase() + w.slice(1)}</button>
                    ))}
                  </div>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Monthly Waste Volume (kg)</label>
                  <input type="number" className="fortis-input" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="e.g. 200" min="1" required />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Current Monthly Disposal Cost (GMD)</label>
                  <input type="number" className="fortis-input" value={disposalCost} onChange={(e) => setDisposalCost(e.target.value)} placeholder="e.g. 500 (enter 0 if none)" min="0" required />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  ♻️ Calculate Recycling ROI
                </button>
              </form>
            </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!result && (
                <div style={emptyCardStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>♻️</p>
                  <p style={emptyTextStyle}>Enter your waste details to see the recycling opportunity</p>
                </div>
              )}
              {result && (
                <>
                  <div style={resultBannerStyle}>
                    <Stat label="Monthly Revenue" value={`GMD ${result.monthlyRevenue.toLocaleString()}`} />
                    <Stat label="Annual Benefit" value={`GMD ${result.netAnnualBenefit.toLocaleString()}`} />
                    <Stat label="CO₂ Saved/yr" value={`${result.annualCO2} t`} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <InfoBox label="Annual Revenue" value={`GMD ${result.annualRevenue.toLocaleString()}`} />
                    <InfoBox label="Disposal Savings" value={`GMD ${result.savingsOnDisposal.toLocaleString()}/yr`} />
                    <InfoBox label="Equipment Cost Est." value={`GMD ${result.equipmentCost.toLocaleString()}`} />
                    <InfoBox label="Payback Period" value={result.paybackMonths > 0 ? `${result.paybackMonths} months` : "Immediate"} highlight />
                  </div>

                  <InfoCard icon="🔧" title="Equipment Needed" body={result.equipment} />
                  <InfoCard icon="🤝" title="Potential Buyer / Offtaker" body={result.buyer} />
                  <InfoCard icon="💡" title="Pro Tip" body={result.note} />
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: "clamp(1.2rem,2.5vw,1.7rem)", fontWeight: 800, color: "#D4AF37", lineHeight: 1 }}>{value}</p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)" }}>{label}</p>
    </div>
  );
}

function InfoBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? "#1B4D3E" : "#FFFFFF", border: `1.5px solid ${highlight ? "#1B4D3E" : "#E2E8F0"}`, borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
      <p style={{ margin: "0 0 0.3rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: highlight ? "#D4AF37" : "#1B4D3E" }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 800, fontSize: "1rem", color: highlight ? "#FFFFFF" : "#0A1C2E" }}>{value}</p>
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ margin: "0 0 0.3rem", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1B4D3E" }}>{title}</p>
        <p style={{ margin: 0, fontSize: "0.92rem", color: "#0A1C2E", lineHeight: 1.65 }}>{body}</p>
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
const resultBannerStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", borderRadius: "0.85rem", padding: "1.5rem 2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" as const };
