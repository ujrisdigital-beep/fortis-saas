"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

type CropData = {
  yieldPerHa: Record<string, number>;
  bestMonth: string;
  fertilizer: string;
  notes: string;
};

const CROP_INFO: Record<string, CropData> = {
  maize: {
    yieldPerHa: { Low: 1.2, Medium: 2.1, High: 3.0 },
    bestMonth: "June – July",
    fertilizer: "NPK 15-15-15 at 200kg/ha, top-dress with Urea at 100kg/ha after 4 weeks",
    notes: "Maize grows well in most Gambian soil types. Ensure proper drainage.",
  },
  rice: {
    yieldPerHa: { Low: 1.5, Medium: 2.8, High: 4.2 },
    bestMonth: "July – August",
    fertilizer: "DAP at 150kg/ha at planting, Urea 100kg/ha at tillering stage",
    notes: "Irrigated rice can yield up to 5 tonnes/ha. Lowland varieties preferred.",
  },
  groundnuts: {
    yieldPerHa: { Low: 0.8, Medium: 1.4, High: 2.0 },
    bestMonth: "June",
    fertilizer: "Single Super Phosphate at 150kg/ha. Groundnuts fix nitrogen — limit urea.",
    notes: "Key Gambian export crop. Planting density: 15×20cm spacing for best yield.",
  },
};

type AgriResult = {
  totalYield: number;
  yieldPerHa: number;
  bestMonth: string;
  fertilizer: string;
  estimatedRevenue: number;
  notes: string;
};

const PRICE_PER_TONNE: Record<string, number> = {
  maize: 18000,
  rice: 22000,
  groundnuts: 35000,
};

export default function AgriculturePage() {
  const [crop, setCrop] = useState("maize");
  const [farmSize, setFarmSize] = useState("");
  const [rainfall, setRainfall] = useState("Medium");
  const [result, setResult] = useState<AgriResult | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const ha = Number(farmSize);
    if (!ha) return;

    const info = CROP_INFO[crop];
    const yph = info.yieldPerHa[rainfall];
    const total = Math.round(yph * ha * 10) / 10;
    const revenue = Math.round(total * PRICE_PER_TONNE[crop]);

    setResult({
      totalYield: total,
      yieldPerHa: yph,
      bestMonth: info.bestMonth,
      fertilizer: info.fertilizer,
      estimatedRevenue: revenue,
      notes: info.notes,
    });
  }

  const cropLabels: Record<string, string> = { maize: "Maize", rice: "Rice", groundnuts: "Groundnuts" };
  const rainfallColors: Record<string, string> = { Low: "#E63946", Medium: "#D4AF37", High: "#10B981" };

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={headerBandStyle}>
          <div style={headerInnerStyle}>
            <span style={sectorTagStyle}>🌾 AGRICULTURE SECTOR</span>
            <h1 style={pageTitleStyle}>Crop Yield Predictor</h1>
            <p style={pageSubStyle}>
              Estimate expected crop yields, optimal planting times, and fertilizer recommendations for Gambian farms.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>
            {/* Form */}
            <div className="fortis-card" style={formCardStyle}>
              <h2 style={cardTitleStyle}>Farm Details</h2>
              <form onSubmit={calculate} style={formStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Crop Type</label>
                  <select className="fortis-input" value={crop} onChange={(e) => setCrop(e.target.value)}>
                    <option value="maize">Maize</option>
                    <option value="rice">Rice</option>
                    <option value="groundnuts">Groundnuts</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Farm Size (hectares)</label>
                  <input type="number" className="fortis-input" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="e.g. 2.5" min="0.1" step="0.1" required />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Expected Rainfall Level</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {["Low", "Medium", "High"].map((r) => (
                      <button
                        key={r} type="button"
                        onClick={() => setRainfall(r)}
                        style={{
                          flex: 1, padding: "0.65rem", borderRadius: "0.5rem", border: `2px solid ${rainfall === r ? rainfallColors[r] : "#E2E8F0"}`,
                          background: rainfall === r ? rainfallColors[r] : "#FFFFFF",
                          color: rainfall === r ? "#FFFFFF" : "#0A1C2E",
                          fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit",
                        }}
                      >{r}</button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
                  🌾 Predict Yield
                </button>
              </form>
            </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!result && (
                <div style={emptyCardStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>🌱</p>
                  <p style={emptyTextStyle}>Enter your farm details to predict yield</p>
                </div>
              )}
              {result && (
                <>
                  <div style={resultBannerStyle}>
                    <Stat label="Expected Yield" value={`${result.totalYield} tonnes`} />
                    <Stat label="Yield Per Hectare" value={`${result.yieldPerHa} t/ha`} />
                    <Stat label="Est. Revenue" value={`GMD ${result.estimatedRevenue.toLocaleString()}`} />
                  </div>

                  <InfoCard icon="📅" title="Best Planting Month" body={result.bestMonth} />
                  <InfoCard icon="🌿" title="Fertilizer Recommendation" body={result.fertilizer} />
                  <InfoCard icon="💡" title="Crop Notes" body={result.notes} />

                  <div style={disclaimerStyle}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748B" }}>
                      Yield estimates based on Gambian agricultural data averages. Actual results vary by soil quality, seed variety, and farming practices. Consult your local agricultural extension officer for field-specific advice.
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 800, color: "#D4AF37" }}>{value}</p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)" }}>{label}</p>
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
const disclaimerStyle: React.CSSProperties = { padding: "0.85rem 1.25rem", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "0.5rem" };
