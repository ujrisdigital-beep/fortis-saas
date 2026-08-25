"use client";
import { useState } from "react";

const G = "#1B4D3E";
const GOLD = "#D4AF37";
const NAVY = "#0A1C2E";
const MUT = "#64748B";

interface WasteStream {
  id: string;
  type: string;
  icon: string;
  tonnesPerDay: number;
  color: string;
  recyclingRate: number;
  valorisationPotential: string;
  revenuePerTonne: number;
  carbonSavedPerTonne: number;
}

const WASTE_STREAMS: WasteStream[] = [
  { id: "organic", type: "Organic / Food Waste", icon: "🥬", tonnesPerDay: 220, color: G, recyclingRate: 8, valorisationPotential: "Biogas, Compost, Animal Feed", revenuePerTonne: 4500, carbonSavedPerTonne: 0.5 },
  { id: "plastic", type: "Plastic Waste", icon: "♻️", tonnesPerDay: 85, color: "#0EA5E9", recyclingRate: 12, valorisationPotential: "Plastic Bricks, Fuel, Recycled Pellets", revenuePerTonne: 12000, carbonSavedPerTonne: 1.8 },
  { id: "paper", type: "Paper & Cardboard", icon: "📄", tonnesPerDay: 42, color: "#D97706", recyclingRate: 22, valorisationPotential: "Recycled Paper, Packaging, Mulch", revenuePerTonne: 3500, carbonSavedPerTonne: 0.7 },
  { id: "metal", type: "Scrap Metal", icon: "🔩", tonnesPerDay: 18, color: "#6B7280", recyclingRate: 45, valorisationPotential: "Foundry, Construction, Export", revenuePerTonne: 28000, carbonSavedPerTonne: 2.1 },
  { id: "glass", type: "Glass", icon: "🫙", tonnesPerDay: 12, color: "#34D399", recyclingRate: 15, valorisationPotential: "Cullet, Sand Substitute, Art", revenuePerTonne: 1500, carbonSavedPerTonne: 0.3 },
  { id: "ewaste", type: "E-Waste", icon: "📱", tonnesPerDay: 8, color: "#8B5CF6", recyclingRate: 5, valorisationPotential: "Gold/Silver Recovery, Parts Resale", revenuePerTonne: 85000, carbonSavedPerTonne: 4.2 },
  { id: "construction", type: "Construction Debris", icon: "🧱", tonnesPerDay: 65, color: "#9CA3AF", recyclingRate: 18, valorisationPotential: "Aggregate, Road Base, Brick", revenuePerTonne: 2000, carbonSavedPerTonne: 0.4 },
  { id: "medical", type: "Medical Waste", icon: "🏥", tonnesPerDay: 4, color: "#E63946", recyclingRate: 2, valorisationPotential: "Autoclave + Energy Recovery", revenuePerTonne: 45000, carbonSavedPerTonne: 3.1 },
];

const VALORISATION_OPPS = [
  {
    id: "biogas",
    title: "Municipal Biogas Plant",
    location: "Brikama (Proposed)",
    feedstock: "Organic waste (220 T/day)",
    output: "2.4 MW electricity + 180 T compost/month",
    investment: "D42M",
    irr: "19%",
    payback: "5.2 years",
    jobs: 47,
    icon: "⚡",
    status: "Tender Open",
    statusColor: G,
  },
  {
    id: "plastic",
    title: "Plastic-to-Brick Factory",
    location: "Kanifing Industrial",
    feedstock: "Mixed plastics (40 T/day)",
    output: "80,000 building bricks/month",
    investment: "D8.5M",
    irr: "24%",
    payback: "3.8 years",
    jobs: 32,
    icon: "🧱",
    status: "Partners Needed",
    statusColor: GOLD,
  },
  {
    id: "ewaste",
    title: "E-Waste Recovery Centre",
    location: "Banjul Port Zone",
    feedstock: "E-waste (8 T/day)",
    output: "Precious metals + refurbished devices",
    investment: "D15M",
    irr: "31%",
    payback: "3.1 years",
    jobs: 24,
    icon: "📱",
    status: "MOU Signed",
    statusColor: "#0EA5E9",
  },
  {
    id: "composting",
    title: "Community Composting Network",
    location: "All 7 LGAs",
    feedstock: "Organic food waste",
    output: "Organic fertiliser for farmers",
    investment: "D3.2M",
    irr: "16%",
    payback: "4.5 years",
    jobs: 120,
    icon: "🌱",
    status: "Pilot Running",
    statusColor: G,
  },
];

const REGIONS_WASTE = [
  { name: "Banjul", wastePerCapitaKg: 0.72, totalTonnesDay: 22, recyclingRate: 18 },
  { name: "Kanifing", wastePerCapitaKg: 0.68, totalTonnesDay: 321, recyclingRate: 14 },
  { name: "Brikama", wastePerCapitaKg: 0.55, totalTonnesDay: 383, recyclingRate: 8 },
  { name: "Basse", wastePerCapitaKg: 0.42, totalTonnesDay: 109, recyclingRate: 5 },
  { name: "Farafenni", wastePerCapitaKg: 0.45, totalTonnesDay: 70, recyclingRate: 6 },
  { name: "Bwiam", wastePerCapitaKg: 0.38, totalTonnesDay: 33, recyclingRate: 4 },
  { name: "Janjanbureh", wastePerCapitaKg: 0.35, totalTonnesDay: 42, recyclingRate: 4 },
];

export default function WastePage() {
  const [activeTab, setActiveTab] = useState<"streams" | "opportunities" | "calculator" | "regions">("streams");
  const [calcInput, setCalcInput] = useState({ wasteType: "plastic", tonnes: 10, period: "month" });
  const [calcResult, setCalcResult] = useState<{ revenue: number; carbonTonnes: number; creditValue: number } | null>(null);

  const totalWaste = WASTE_STREAMS.reduce((s, w) => s + w.tonnesPerDay, 0);
  const totalRevenuePotential = WASTE_STREAMS.reduce((s, w) => s + w.tonnesPerDay * 365 * (1 - w.recyclingRate / 100) * w.revenuePerTonne, 0);
  const totalCarbonPotential = WASTE_STREAMS.reduce((s, w) => s + w.tonnesPerDay * 365 * w.carbonSavedPerTonne, 0);

  const runCalc = () => {
    const ws = WASTE_STREAMS.find(w => w.id === calcInput.wasteType);
    if (!ws) return;
    const multiplier = calcInput.period === "day" ? 1 : calcInput.period === "month" ? 30 : 365;
    const totalTonnes = calcInput.tonnes * multiplier;
    const revenue = totalTonnes * ws.revenuePerTonne;
    const carbonTonnes = totalTonnes * ws.carbonSavedPerTonne;
    const creditValue = carbonTonnes * 8750; // ~$125/tCO₂ in GMD
    setCalcResult({ revenue, carbonTonnes, creditValue });
  };

  const page: React.CSSProperties = { background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
  const hero: React.CSSProperties = { background: `linear-gradient(135deg, ${NAVY} 0%, "#1a3a2e" 100%)`, color: "#fff", padding: "56px 24px 44px" };
  const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 16px" };
  const tabRow: React.CSSProperties = { display: "flex", gap: 0, background: "#fff", borderBottom: "2px solid #E2E8F0", maxWidth: 1200, margin: "0 auto", overflowX: "auto" };
  const tabBtn = (a: boolean): React.CSSProperties => ({ padding: "14px 20px", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: a ? G : MUT, borderBottom: `3px solid ${a ? G : "transparent"}`, whiteSpace: "nowrap" });
  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 14, boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: MUT, marginBottom: 4 };

  const PieSegment = ({ streams }: { streams: WasteStream[] }) => {
    let cumAngle = -90;
    const total = streams.reduce((s, w) => s + w.tonnesPerDay, 0);
    const cx = 100, cy = 100, r = 80;
    const segments = streams.map(w => {
      const angle = (w.tonnesPerDay / total) * 360;
      const startAngle = (cumAngle * Math.PI) / 180;
      cumAngle += angle;
      const endAngle = (cumAngle * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = angle > 180 ? 1 : 0;
      return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: w.color, type: w.type, pct: Math.round((w.tonnesPerDay / total) * 100) };
    });
    return (
      <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 200 }}>
        {segments.map((s, i) => <path key={i} d={s.d} fill={s.color} opacity={0.9} />)}
        <circle cx={cx} cy={cy} r={40} fill="#fff" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="12" fontWeight="bold" fill={NAVY}>{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill={MUT}>T/day</text>
      </svg>
    );
  };

  const fmt = (n: number) => n >= 1000000 ? `D${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `D${(n / 1000).toFixed(0)}K` : `D${n.toFixed(0)}`;

  return (
    <div style={page}>
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a2e 100%)`, color: "#fff", padding: "56px 24px 44px" }}>
        <div style={container}>
          <span style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: GOLD, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, display: "inline-block", marginBottom: 14 }}>
            WASTE VALORISATION
          </span>
          <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8, letterSpacing: -1 }}>Waste Generation & Valorisation Map</h1>
          <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 600, marginBottom: 28 }}>
            GROW planning model — not NEA weighbridge data, not issued carbon credits, not live tenders.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { label: "Total Daily Waste", value: `${totalWaste} T`, icon: "🗑️" },
              { label: "Current Recycling Rate", value: "11.4%", icon: "♻️" },
              { label: "Annual Revenue Potential", value: fmt(totalRevenuePotential / 365 * 30), icon: "💰", suffix: "/month" },
              { label: "Carbon Saving Potential", value: `${Math.round(totalCarbonPotential).toLocaleString()} T`, icon: "🌱", suffix: "/year" },
              { label: "Jobs Creatable", value: "1,200+", icon: "👷" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{s.value}<span style={{ fontSize: 11, opacity: 0.7 }}>{s.suffix}</span></div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
        <div style={tabRow}>
          <button style={tabBtn(activeTab === "streams")} onClick={() => setActiveTab("streams")}>🗑️ Waste Streams</button>
          <button style={tabBtn(activeTab === "opportunities")} onClick={() => setActiveTab("opportunities")}>💡 Valorisation Projects</button>
          <button style={tabBtn(activeTab === "calculator")} onClick={() => setActiveTab("calculator")}>🧮 Carbon Calculator</button>
          <button style={tabBtn(activeTab === "regions")} onClick={() => setActiveTab("regions")}>📍 By Region</button>
        </div>
      </div>

      <div style={container}>
        {activeTab === "streams" && (
          <div style={{ padding: "28px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, marginBottom: 28 }}>
              <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontWeight: 700, color: NAVY, marginBottom: 12, fontSize: 14 }}>Composition</div>
                <PieSegment streams={WASTE_STREAMS} />
              </div>
              <div style={card}>
                <div style={{ fontWeight: 700, color: NAVY, marginBottom: 14, fontSize: 14 }}>Waste Stream Breakdown</div>
                {WASTE_STREAMS.map(w => (
                  <div key={w.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: NAVY }}>{w.icon} {w.type}</span>
                      <span style={{ fontSize: 13, color: MUT }}>{w.tonnesPerDay} T/day · {Math.round((w.tonnesPerDay / totalWaste) * 100)}%</span>
                    </div>
                    <div style={{ background: "#E2E8F0", borderRadius: 4, height: 8 }}>
                      <div style={{ height: "100%", borderRadius: 4, background: w.color, width: `${(w.tonnesPerDay / totalWaste) * 100}%`, transition: "width 0.4s" }} />
                    </div>
                    <div style={{ fontSize: 11, color: MUT, marginTop: 3 }}>
                      Recycling rate: {w.recyclingRate}% · Potential: {w.valorisationPotential}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {WASTE_STREAMS.map(w => (
                <div key={w.id} style={{ ...card, borderLeft: `4px solid ${w.color}` }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{w.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: NAVY, fontSize: 15 }}>{w.type}</div>
                      <div style={{ fontSize: 12, color: MUT }}>{w.tonnesPerDay} tonnes/day generated</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 10, color: MUT }}>Revenue Potential</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: G }}>D{(w.revenuePerTonne / 1000).toFixed(0)}K/T</div>
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 10, color: MUT }}>Carbon Saved</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0EA5E9" }}>{w.carbonSavedPerTonne} tCO₂/T</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: MUT, background: "#F0FDF4", borderRadius: 8, padding: "8px 10px" }}>
                    <strong style={{ color: G }}>Valorise as: </strong>{w.valorisationPotential}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "opportunities" && (
          <div style={{ padding: "28px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {VALORISATION_OPPS.map(opp => (
                <div key={opp.id} style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <span style={{ fontSize: 32 }}>{opp.icon}</span>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginTop: 8, marginBottom: 4 }}>{opp.title}</h3>
                      <div style={{ fontSize: 12, color: MUT }}>📍 {opp.location}</div>
                    </div>
                    <span style={{ background: `${opp.statusColor}18`, color: opp.statusColor, border: `1px solid ${opp.statusColor}40`, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                      {opp.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: MUT, marginBottom: 14 }}>
                    <div>📥 <strong>Feedstock:</strong> {opp.feedstock}</div>
                    <div>📤 <strong>Output:</strong> {opp.output}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                    {[
                      { label: "Investment", value: opp.investment },
                      { label: "IRR", value: opp.irr },
                      { label: "Payback", value: opp.payback },
                      { label: "Jobs", value: String(opp.jobs) },
                    ].map(m => (
                      <div key={m.label} style={{ background: "#F8FAFC", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: G }}>{m.value}</div>
                        <div style={{ fontSize: 10, color: MUT }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    style={{ width: "100%", padding: "10px", background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                    onClick={() => {
                      window.location.href = "/services/logistics";
                    }}
                  >
                    Open FORTIS thread (no WhatsApp)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "calculator" && (
          <div style={{ padding: "28px 0", maxWidth: 640, margin: "0 auto" }}>
            <div style={card}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 6 }}>🧮 Carbon Credit Calculator</h2>
              <p style={{ color: MUT, fontSize: 14, marginBottom: 24 }}>Estimate your valorisation revenue and carbon credits from waste diversion.</p>

              <label style={labelStyle}>Waste Type</label>
              <select style={{ ...inputStyle, marginBottom: 14 }} value={calcInput.wasteType} onChange={e => setCalcInput({ ...calcInput, wasteType: e.target.value })}>
                {WASTE_STREAMS.map(w => (
                  <option key={w.id} value={w.id}>{w.icon} {w.type}</option>
                ))}
              </select>

              <label style={labelStyle}>Quantity (tonnes per {calcInput.period})</label>
              <input
                type="number"
                style={{ ...inputStyle, marginBottom: 14 }}
                value={calcInput.tonnes}
                min={0.1}
                step={0.1}
                onChange={e => setCalcInput({ ...calcInput, tonnes: parseFloat(e.target.value) || 1 })}
              />

              <label style={labelStyle}>Period</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {["day", "month", "year"].map(p => (
                  <button
                    key={p}
                    style={{ flex: 1, padding: "9px", borderRadius: 8, border: `2px solid ${calcInput.period === p ? G : "#E2E8F0"}`, background: calcInput.period === p ? G : "#fff", color: calcInput.period === p ? "#fff" : MUT, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
                    onClick={() => setCalcInput({ ...calcInput, period: p })}
                  >
                    Per {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>

              <button
                style={{ width: "100%", padding: 14, background: G, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer" }}
                onClick={runCalc}
              >
                Calculate →
              </button>

              {calcResult && (
                <div style={{ marginTop: 24, background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ fontWeight: 800, color: G, fontSize: 16, marginBottom: 16 }}>📊 Results</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{ background: "#fff", borderRadius: 10, padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: MUT, marginBottom: 4 }}>VALORISATION REVENUE</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: G }}>{fmt(calcResult.revenue)}</div>
                      <div style={{ fontSize: 11, color: MUT }}>per {calcInput.period}</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 10, padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: MUT, marginBottom: 4 }}>CO₂ AVOIDED</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#0EA5E9" }}>{calcResult.carbonTonnes.toFixed(1)} T</div>
                      <div style={{ fontSize: 11, color: MUT }}>carbon credits</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 10, padding: 14, textAlign: "center", gridColumn: "span 2" }}>
                      <div style={{ fontSize: 10, color: MUT, marginBottom: 4 }}>CARBON CREDIT VALUE (at $125/tCO₂)</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: GOLD }}>{fmt(calcResult.creditValue)}</div>
                      <div style={{ fontSize: 12, color: MUT, marginTop: 4 }}>Additional income from carbon markets</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: MUT, marginTop: 12, padding: "10px 14px", background: "#fff", borderRadius: 8 }}>
                    💡 <strong>Total potential:</strong> {fmt(calcResult.revenue + calcResult.creditValue)} combined per {calcInput.period} from both valorisation revenue and carbon credits.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "regions" && (
          <div style={{ padding: "28px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {REGIONS_WASTE.map(r => (
                <div key={r.name} style={card}>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 16, marginBottom: 10 }}>📍 {r.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px" }}>
                      <div style={{ fontSize: 10, color: MUT }}>Per Capita / Day</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>{r.wastePerCapitaKg} kg</div>
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px" }}>
                      <div style={{ fontSize: 10, color: MUT }}>Total Daily</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>{r.totalTonnesDay} T</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: MUT, marginBottom: 4 }}>
                      <span>Recycling rate</span>
                      <span style={{ fontWeight: 700, color: r.recyclingRate > 10 ? G : "#E63946" }}>{r.recyclingRate}%</span>
                    </div>
                    <div style={{ background: "#E2E8F0", borderRadius: 4, height: 8 }}>
                      <div style={{ height: "100%", borderRadius: 4, background: r.recyclingRate > 10 ? G : GOLD, width: `${r.recyclingRate}%` }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: MUT, marginTop: 8 }}>
                    Monthly revenue potential: <strong style={{ color: G }}>{fmt(r.totalTonnesDay * 30 * 8500)}</strong>
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
