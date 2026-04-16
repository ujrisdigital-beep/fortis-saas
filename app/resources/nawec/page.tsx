"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const G = "#1B4D3E";
const GOLD = "#D4AF37";
const NAVY = "#0A1C2E";
const MUT = "#64748B";

const GambiaMap = dynamic(() => import("../../../components/GambiaMap"), { ssr: false, loading: () => (
  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: MUT, fontSize: 14 }}>
    Loading map...
  </div>
)});

const REGIONS = [
  { name: "Banjul", accessRate: 98.5, demandMW: 45, capacityMW: 52, lat: 13.4549, lng: -16.579, waterAccess: 95, population: 31356, solarPotentialKWh: 1820 },
  { name: "Kanifing", accessRate: 95.2, demandMW: 120, capacityMW: 135, lat: 13.444, lng: -16.667, waterAccess: 88, population: 472916, solarPotentialKWh: 1850 },
  { name: "Brikama", accessRate: 82.3, demandMW: 68, capacityMW: 75, lat: 13.271, lng: -16.645, waterAccess: 72, population: 697370, solarPotentialKWh: 1900 },
  { name: "Bwiam", accessRate: 65.7, demandMW: 22, capacityMW: 28, lat: 13.233, lng: -16.15, waterAccess: 58, population: 87784, solarPotentialKWh: 1930 },
  { name: "Basse", accessRate: 58.2, demandMW: 18, capacityMW: 22, lat: 13.31, lng: -14.213, waterAccess: 52, population: 261273, solarPotentialKWh: 1980 },
  { name: "Farafenni", accessRate: 62.4, demandMW: 15, capacityMW: 19, lat: 13.567, lng: -15.6, waterAccess: 55, population: 154838, solarPotentialKWh: 1960 },
  { name: "Janjanbureh", accessRate: 54.1, demandMW: 9, capacityMW: 12, lat: 13.533, lng: -14.767, waterAccess: 48, population: 120204, solarPotentialKWh: 1970 },
];

type ResourceType = "energy" | "water" | "solar";

const RESOURCE_CONFIG: Record<ResourceType, { label: string; icon: string; dataKey: keyof typeof REGIONS[0]; unit: string; color: string }> = {
  energy: { label: "Electricity Access", icon: "⚡", dataKey: "accessRate", unit: "%", color: G },
  water: { label: "Clean Water Access", icon: "💧", dataKey: "waterAccess", unit: "%", color: "#0EA5E9" },
  solar: { label: "Solar Potential", icon: "☀️", dataKey: "solarPotentialKWh", unit: "kWh/m²/yr", color: GOLD },
};

const NATIONAL_STATS = [
  { label: "National Grid Coverage", value: "76.7%", icon: "⚡", trend: "+2.3% YoY" },
  { label: "Installed Capacity", value: "220 MW", icon: "🏭", trend: "+15MW 2025" },
  { label: "Renewable Share", value: "28%", icon: "☀️", trend: "+6% YoY" },
  { label: "Water Access Rate", icon: "💧", value: "71%", trend: "+1.8% YoY" },
  { label: "Borehole Sites", value: "1,847", icon: "🕳️", trend: "+34 2025" },
  { label: "NAWEC Subscribers", value: "94,203", icon: "🔌", trend: "+4,200 YoY" },
];

export default function NAWECPage() {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [resourceType, setResourceType] = useState<ResourceType>("energy");
  const [activeTab, setActiveTab] = useState<"map" | "stats" | "gaps">("map");

  const getColorByRate = (rate: number, max = 100) => {
    const pct = rate / max;
    if (pct >= 0.9) return G;
    if (pct >= 0.7) return GOLD;
    if (pct >= 0.5) return "#F97316";
    return "#E63946";
  };

  const deficitRegions = REGIONS.filter(r => (r.accessRate as number) < 70).sort((a, b) => a.accessRate - b.accessRate);

  const page: React.CSSProperties = { background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
  const hero: React.CSSProperties = { background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, color: "#fff", padding: "56px 24px 44px" };
  const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 16px" };
  const tabRow: React.CSSProperties = { display: "flex", gap: 0, background: "#fff", borderBottom: "2px solid #E2E8F0", maxWidth: 1200, margin: "0 auto" };
  const tabBtn = (a: boolean): React.CSSProperties => ({ flex: 1, padding: "14px 16px", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, color: a ? G : MUT, borderBottom: `3px solid ${a ? G : "transparent"}` });
  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" };
  const badge = (color: string, bg: string): React.CSSProperties => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color, background: bg });

  return (
    <div style={page}>
      {/* HERO */}
      <div style={hero}>
        <div style={container}>
          <span style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: GOLD, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, display: "inline-block", marginBottom: 14 }}>
            NAWEC INTEGRATION
          </span>
          <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8, letterSpacing: -1 }}>Energy & Water Resources Map</h1>
          <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 600, marginBottom: 28 }}>
            Real-time electricity access, water availability and solar potential data across all regions of The Gambia
          </p>
          {/* National stats strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {NATIONAL_STATS.map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: GOLD, marginTop: 2 }}>{s.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
        <div style={tabRow}>
          <button style={tabBtn(activeTab === "map")} onClick={() => setActiveTab("map")}>🗺️ Interactive Map</button>
          <button style={tabBtn(activeTab === "stats")} onClick={() => setActiveTab("stats")}>📊 Regional Statistics</button>
          <button style={tabBtn(activeTab === "gaps")} onClick={() => setActiveTab("gaps")}>⚠️ Coverage Gaps</button>
        </div>
      </div>

      <div style={container}>
        {activeTab === "map" && (
          <div style={{ padding: "28px 0" }}>
            {/* Resource type toggle */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {(Object.keys(RESOURCE_CONFIG) as ResourceType[]).map(rt => (
                <button
                  key={rt}
                  style={{ padding: "8px 20px", borderRadius: 24, border: `2px solid ${resourceType === rt ? RESOURCE_CONFIG[rt].color : "#E2E8F0"}`, background: resourceType === rt ? RESOURCE_CONFIG[rt].color : "#fff", color: resourceType === rt ? "#fff" : MUT, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
                  onClick={() => setResourceType(rt)}
                >
                  {RESOURCE_CONFIG[rt].icon} {RESOURCE_CONFIG[rt].label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
              {/* Map */}
              <div style={{ ...card, height: 520, padding: 12 }}>
                <GambiaMap regions={REGIONS} onRegionClick={(r) => setSelectedRegion(r as unknown as typeof REGIONS[0])} selectedRegion={selectedRegion} />
              </div>

              {/* Side panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Legend */}
                <div style={card}>
                  <div style={{ fontWeight: 700, color: NAVY, marginBottom: 10, fontSize: 14 }}>Map Legend</div>
                  {[
                    { color: G, label: "≥90% Access (Excellent)" },
                    { color: GOLD, label: "70–89% Access (Good)" },
                    { color: "#F97316", label: "50–69% Access (Moderate)" },
                    { color: "#E63946", label: "<50% Access (Critical)" },
                  ].map(l => (
                    <div key={l.label} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: MUT }}>{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Selected region */}
                <div style={{ ...card, border: `2px solid ${G}` }}>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: 16, marginBottom: 14 }}>
                    📍 {selectedRegion.name}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { icon: "⚡", label: "Electricity", value: `${selectedRegion.accessRate}%`, color: getColorByRate(selectedRegion.accessRate) },
                      { icon: "💧", label: "Water", value: `${selectedRegion.waterAccess}%`, color: getColorByRate(selectedRegion.waterAccess) },
                      { icon: "🔋", label: "Peak Demand", value: `${selectedRegion.demandMW} MW`, color: NAVY },
                      { icon: "⚙️", label: "Capacity", value: `${selectedRegion.capacityMW} MW`, color: G },
                      { icon: "👥", label: "Population", value: selectedRegion.population.toLocaleString(), color: NAVY },
                      { icon: "☀️", label: "Solar Potential", value: `${selectedRegion.solarPotentialKWh} kWh`, color: GOLD },
                    ].map(m => (
                      <div key={m.label} style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 11, color: MUT, marginBottom: 2 }}>{m.icon} {m.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Progress bars */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, color: MUT, marginBottom: 4 }}>Electricity Access</div>
                    <div style={{ background: "#E2E8F0", borderRadius: 4, height: 8, marginBottom: 8 }}>
                      <div style={{ height: "100%", borderRadius: 4, background: getColorByRate(selectedRegion.accessRate), width: `${selectedRegion.accessRate}%`, transition: "width 0.4s" }} />
                    </div>
                    <div style={{ fontSize: 12, color: MUT, marginBottom: 4 }}>Clean Water Access</div>
                    <div style={{ background: "#E2E8F0", borderRadius: 4, height: 8 }}>
                      <div style={{ height: "100%", borderRadius: 4, background: "#0EA5E9", width: `${selectedRegion.waterAccess}%`, transition: "width 0.4s" }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 14, padding: "10px 12px", background: "#F0FDF4", borderRadius: 8, fontSize: 12, color: MUT }}>
                    Grid utilisation: <strong style={{ color: G }}>{Math.round((selectedRegion.demandMW / selectedRegion.capacityMW) * 100)}%</strong>
                    {selectedRegion.demandMW / selectedRegion.capacityMW > 0.85 && (
                      <span style={{ color: "#E63946", fontWeight: 700, marginLeft: 8 }}>⚠️ Near capacity</span>
                    )}
                  </div>
                </div>

                {/* Region selector */}
                <div style={{ ...card }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: 13, marginBottom: 10 }}>Select Region</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {REGIONS.map(r => (
                      <button
                        key={r.name}
                        onClick={() => setSelectedRegion(r)}
                        style={{ padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${selectedRegion.name === r.name ? G : "#E2E8F0"}`, background: selectedRegion.name === r.name ? "#F0FDF4" : "#fff", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 13, color: NAVY }}>{r.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: getColorByRate(r.accessRate) }}>{r.accessRate}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div style={{ padding: "28px 0" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <thead>
                  <tr style={{ background: NAVY, color: "#fff" }}>
                    {["Region", "Population", "⚡ Electricity", "💧 Water", "Peak Demand", "Capacity", "Grid Usage", "☀️ Solar Potential"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REGIONS.map((r, i) => (
                    <tr key={r.name} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff", borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: NAVY }}>{r.name}</td>
                      <td style={{ padding: "12px 16px", color: MUT, fontSize: 13 }}>{r.population.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={badge(getColorByRate(r.accessRate), `${getColorByRate(r.accessRate)}18`)}>{r.accessRate}%</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={badge("#0369A1", "#DBEAFE")}>{r.waterAccess}%</span>
                      </td>
                      <td style={{ padding: "12px 16px", color: MUT, fontSize: 13 }}>{r.demandMW} MW</td>
                      <td style={{ padding: "12px 16px", color: MUT, fontSize: 13 }}>{r.capacityMW} MW</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, background: "#E2E8F0", borderRadius: 4, height: 6, minWidth: 60 }}>
                            <div style={{ height: "100%", borderRadius: 4, background: getColorByRate(r.demandMW, r.capacityMW), width: `${Math.round((r.demandMW / r.capacityMW) * 100)}%` }} />
                          </div>
                          <span style={{ fontSize: 12, color: MUT, whiteSpace: "nowrap" }}>{Math.round((r.demandMW / r.capacityMW) * 100)}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: GOLD, fontWeight: 700, fontSize: 13 }}>{r.solarPotentialKWh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "gaps" && (
          <div style={{ padding: "28px 0" }}>
            <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>⚠️ Critical Coverage Gaps Identified</div>
              <p style={{ color: "#7F1D1D", fontSize: 14, margin: 0 }}>
                {deficitRegions.length} regions have electricity access below 70%. Estimated {Math.round(deficitRegions.reduce((s, r) => s + r.population * (1 - r.accessRate / 100), 0)).toLocaleString()} people lack reliable electricity access.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginBottom: 32 }}>
              {deficitRegions.map(r => (
                <div key={r.name} style={{ ...card, borderLeft: `4px solid #E63946` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, color: NAVY, fontSize: 16 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: MUT }}>Pop: {r.population.toLocaleString()}</div>
                    </div>
                    <span style={badge("#991B1B", "#FEE2E2")}>{r.accessRate}% access</span>
                  </div>
                  <div style={{ fontSize: 13, color: MUT, marginBottom: 10 }}>
                    Unserved: ~{Math.round(r.population * (1 - r.accessRate / 100)).toLocaleString()} people
                  </div>
                  <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "10px 12px", fontSize: 13 }}>
                    <div style={{ fontWeight: 700, color: G, marginBottom: 4 }}>☀️ Solar Solution Potential</div>
                    <div style={{ color: MUT }}>Solar irradiance: {r.solarPotentialKWh} kWh/m²/yr</div>
                    <div style={{ color: MUT }}>Min capacity needed: {(r.capacityMW - r.demandMW).toFixed(1)} MW reserve headroom</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Investment needed */}
            <div style={{ ...card, background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, color: "#fff" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>💡 Investment Opportunities</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                {[
                  { label: "Solar Mini-Grids Needed", value: "23", desc: "For rural upcountry coverage" },
                  { label: "Estimated Investment", value: "$85M", desc: "To reach 95% national coverage" },
                  { label: "Carbon Credits (Est.)", value: "42,000 tCO₂", desc: "Annual avoided emissions" },
                  { label: "IRR (Solar Projects)", value: "14–18%", desc: "Based on ECOWAS benchmarks" },
                ].map(inv => (
                  <div key={inv.label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>{inv.value}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{inv.label}</div>
                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{inv.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
