"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const DARK = "#0A2E1A";
const G = "#1B4D3E";
const GOLD = "#C4943A";
const LIGHT = "#2E7D64";

// Soil polygons (mapped to visual positions on SVG canvas)
const SOIL_POLYGONS = [
  {
    id: "continental-terminal",
    name: "Continental Terminal (Upland)",
    code: "CT",
    color: "#D4A373",
    region: "Central & Upper River",
    area: "~180,000 ha",
    props: {
      pH: 5.5,
      salinity: "None",
      drainage: "Good",
      organicCarbon: "0.35%",
      phosphorus: "Low (5 ppm)",
      suitableCrops: ["Groundnut", "Millet", "Maize", "Cashew", "Sesame"],
      fertilizer: "NPK 40-45-30 kg/ha",
      irrigationNeed: "High",
      risk: "Drought-prone, low nutrient retention",
    },
    cx: 62, cy: 42, r: 18,
  },
  {
    id: "alluvial-lowland",
    name: "Alluvial Lowland",
    code: "AL",
    color: "#6A9C89",
    region: "River floodplains (LRR, CRR)",
    area: "~55,000 ha",
    props: {
      pH: 5.2,
      salinity: "Medium",
      drainage: "Poor",
      organicCarbon: "0.40%",
      phosphorus: "Low-Med (8 ppm)",
      suitableCrops: ["Rice", "Rice-Fish", "Vegetables"],
      fertilizer: "NPK 80-40-30 kg/ha",
      irrigationNeed: "Medium",
      risk: "Waterlogging, salinity intrusion",
    },
    cx: 42, cy: 52, r: 14,
  },
  {
    id: "saline-tidal",
    name: "Saline Tidal Zone",
    code: "ST",
    color: "#C1666B",
    region: "Lower River Region, coast",
    area: "~32,000 ha",
    props: {
      pH: 4.8,
      salinity: "High (4–8 dS/m)",
      drainage: "Very Poor",
      organicCarbon: "0.50%",
      phosphorus: "Low (6 ppm)",
      suitableCrops: ["ISRIZ-7 Salt-Tolerant Rice", "Mangrove Restoration"],
      fertilizer: "Specialised low-P (60-35-40 kg/ha)",
      irrigationNeed: "Low",
      risk: "High salinity, acid sulfate soils",
    },
    cx: 22, cy: 48, r: 11,
  },
  {
    id: "coastal-salt",
    name: "Coastal Salt Production",
    code: "CSP",
    color: "#E8B86B",
    region: "Western coast, estuaries",
    area: "~8,000 ha",
    props: {
      pH: 7.2,
      salinity: "Extreme (>12 dS/m)",
      drainage: "Variable",
      organicCarbon: "0.20%",
      phosphorus: "Very Low (3 ppm)",
      suitableCrops: ["Solar Salt", "Brine Shrimp"],
      fertilizer: "None required",
      irrigationNeed: "None",
      risk: "Investment opportunity — salt production",
      investment: "D500,000–D10M/ha",
      roi: "30–50% annually",
    },
    cx: 14, cy: 36, r: 8,
  },
  {
    id: "iron-pan",
    name: "Iron Pan (Laterite)",
    code: "IP",
    color: "#A0522D",
    region: "Upper River Region",
    area: "~45,000 ha",
    props: {
      pH: 5.8,
      salinity: "None",
      drainage: "Moderate",
      organicCarbon: "0.25%",
      phosphorus: "Very Low (4 ppm)",
      suitableCrops: ["Cashew", "Mango", "Agroforestry"],
      fertilizer: "NPK 30-35-20 kg/ha + organic",
      irrigationNeed: "High",
      risk: "Laterite hardpan limits root depth",
    },
    cx: 84, cy: 38, r: 12,
  },
];

const SALINITY_STATIONS = [
  { name: "Essau (NBR)", salinity: 6.2, risk: "critical", lat: "N13°29'", lon: "W16°31'" },
  { name: "Kuntaur (CRR)", salinity: 3.8, risk: "warning", lat: "N13°33'", lon: "W14°53'" },
  { name: "Janjanbureh (CRR)", salinity: 2.5, risk: "moderate", lat: "N13°32'", lon: "W14°46'" },
  { name: "Basse (URR)", salinity: 1.2, risk: "safe", lat: "N13°29'", lon: "W14°13'" },
  { name: "Banjul (WCR)", salinity: 8.1, risk: "critical", lat: "N13°27'", lon: "W16°34'" },
];

const RISK_COLORS: Record<string, string> = {
  critical: "#DC2626",
  warning: "#F59E0B",
  moderate: "#EAB308",
  safe: "#10B981",
};

export default function SoilMappingPage() {
  const [selected, setSelected] = useState<typeof SOIL_POLYGONS[0] | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"map" | "table" | "salinity">("map");
  const [cropFilter, setCropFilter] = useState<string>("all");

  const filteredSoils = cropFilter === "all"
    ? SOIL_POLYGONS
    : SOIL_POLYGONS.filter(s => s.props.suitableCrops.some(c => c.toLowerCase().includes(cropFilter.toLowerCase())));

  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 55%, ${LIGHT} 100%)`, padding: "2.5rem 1.5rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(196,148,58,0.05)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: 48 }}>🌱</span>
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ background: "rgba(196,148,58,0.2)", border: "1px solid rgba(196,148,58,0.4)", borderRadius: 999, padding: "2px 12px", fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.08em" }}>FORTIS AGRI-INTEL</span>
                <span style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "2px 10px", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>🇬🇲 SOTER / ISRIC Data</span>
              </div>
              <h1 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>Gambia Soil & Crop Suitability Map</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: "4px 0 0" }}>Interactive soil intelligence for farmers, investors & policymakers</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/soil-mapping/crop-suitability" style={{ padding: "9px 18px", background: GOLD, color: DARK, borderRadius: 8, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
              🌾 Crop Suitability Tool →
            </Link>
            <Link href="/soil-mapping/salt-investment" style={{ padding: "9px 18px", background: "rgba(255,255,255,0.12)", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)" }}>
              🧂 Salt Investment Calculator
            </Link>
            <Link href="/marketplace?category=seeds" style={{ padding: "9px 18px", background: "transparent", color: "rgba(255,255,255,0.75)", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              🛒 Buy ISRIZ-7 Seeds
            </Link>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", gap: 4 }}>
          {[
            { id: "map", label: "🗺️ Soil Map" },
            { id: "table", label: "📊 Soil Data" },
            { id: "salinity", label: "💧 Salinity Monitor" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)} style={{
              padding: "13px 16px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer",
              background: "none", border: "none",
              borderBottom: activeTab === t.id ? `3px solid ${GOLD}` : "3px solid transparent",
              color: activeTab === t.id ? GOLD : "#555",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem" }}>

        {/* MAP TAB */}
        {activeTab === "map" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
            {/* SVG Map */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: 0 }}>🇬🇲 The Gambia — Soil Classification</h2>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>Click a zone for details</span>
              </div>
              <div style={{ padding: "1rem", position: "relative" }}>
                {/* SVG schematic map */}
                <svg viewBox="0 0 100 70" style={{ width: "100%", height: "auto", display: "block" }}>
                  {/* Background */}
                  <rect x="0" y="0" width="100" height="70" fill="#E8F4F8" rx="4" />
                  {/* River Gambia - wavy line */}
                  <path d="M 5 45 Q 15 42 25 46 Q 35 50 45 47 Q 55 44 65 46 Q 75 48 85 44 Q 92 42 98 43"
                    fill="none" stroke="#5BA4CF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                  <text x="50" y="55" textAnchor="middle" fontSize="3.5" fill="#5BA4CF" fontWeight="bold">RIVER GAMBIA</text>
                  {/* Atlantic Ocean label */}
                  <text x="8" y="65" fontSize="3.5" fill="#5BA4CF" opacity="0.7">ATLANTIC</text>

                  {/* Soil circles */}
                  {SOIL_POLYGONS.map(soil => (
                    <g key={soil.id}
                      onClick={() => setSelected(soil === selected ? null : soil)}
                      onMouseEnter={() => setHoveredId(soil.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ cursor: "pointer" }}>
                      <circle
                        cx={soil.cx} cy={soil.cy} r={soil.r + 2}
                        fill="rgba(255,255,255,0.3)"
                        stroke={selected?.id === soil.id ? GOLD : "transparent"}
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={soil.cx} cy={soil.cy} r={soil.r}
                        fill={soil.color}
                        opacity={hoveredId === soil.id || selected?.id === soil.id ? 0.95 : 0.75}
                        stroke="#fff"
                        strokeWidth="0.8"
                      />
                      <text x={soil.cx} y={soil.cy + 1} textAnchor="middle" fontSize="3.5" fill="#fff" fontWeight="bold">{soil.code}</text>
                    </g>
                  ))}

                  {/* Salinity warning dots */}
                  {[
                    { cx: 16, cy: 43, label: "6.2" },
                    { cx: 8, cy: 41, label: "8.1" },
                    { cx: 54, cy: 46, label: "3.8" },
                    { cx: 60, cy: 45, label: "2.5" },
                    { cx: 84, cy: 43, label: "1.2" },
                  ].map((s, i) => (
                    <g key={i}>
                      <circle cx={s.cx} cy={s.cy} r="2.5" fill={parseFloat(s.label) >= 6 ? "#DC2626" : parseFloat(s.label) >= 3 ? "#F59E0B" : "#10B981"} stroke="#fff" strokeWidth="0.5" />
                      <text x={s.cx} y={s.cy - 3.5} textAnchor="middle" fontSize="2.5" fill="#444">{s.label}</text>
                    </g>
                  ))}
                </svg>

                {/* Legend */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {SOIL_POLYGONS.map(s => (
                    <div key={s.id} onClick={() => setSelected(s === selected ? null : s)}
                      style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: "3px 8px", borderRadius: 999, background: selected?.id === s.id ? "rgba(196,148,58,0.1)" : "transparent", border: selected?.id === s.id ? `1px solid ${GOLD}` : "1px solid transparent" }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#444" }}>{s.code}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#DC2626" }} />
                    <span style={{ fontSize: 11, color: "#444" }}>Salinity (dS/m)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail panel */}
            <div>
              {selected ? (
                <div style={{ background: "#fff", borderRadius: 16, border: `2px solid ${selected.color}`, padding: "1.25rem", position: "sticky", top: 80 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: selected.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 18, color: "#fff", fontWeight: 900 }}>{selected.code}</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: DARK, fontSize: 15 }}>{selected.name}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{selected.region} · {selected.area}</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    {[
                      { k: "pH", v: selected.props.pH },
                      { k: "Salinity", v: selected.props.salinity },
                      { k: "Drainage", v: selected.props.drainage },
                      { k: "Organic C", v: selected.props.organicCarbon },
                      { k: "Phosphorus", v: selected.props.phosphorus },
                      { k: "Irrigation", v: selected.props.irrigationNeed },
                    ].map(({ k, v }) => (
                      <div key={k} style={{ background: "#f9fafb", borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{String(v)}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>Suitable Crops</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {selected.props.suitableCrops.map(c => (
                        <span key={c} style={{ background: "rgba(27,77,62,0.08)", color: G, borderRadius: 999, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>{c}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#92400e", marginBottom: 12 }}>
                    ⚠️ {selected.props.risk}
                  </div>

                  <div style={{ fontSize: 12, color: "#555", marginBottom: 14 }}>
                    <strong>Fertiliser:</strong> {selected.props.fertilizer}
                  </div>

                  {selected.id === "coastal-salt" && (
                    <div style={{ background: "rgba(196,148,58,0.08)", border: `1px solid rgba(196,148,58,0.3)`, borderRadius: 8, padding: "8px 10px", fontSize: 12, color: DARK, marginBottom: 14 }}>
                      <div style={{ fontWeight: 700, marginBottom: 3 }}>💰 Investment Opportunity</div>
                      <div>Capital: {selected.props.investment}</div>
                      <div>ROI: {selected.props.roi}</div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Link href={`/soil-mapping/crop-suitability?soil=${selected.id}`}
                      style={{ flex: 1, textAlign: "center", padding: "9px", background: GOLD, color: DARK, borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: "none" }}>
                      Check Crop Suitability →
                    </Link>
                    {(selected.id === "saline-tidal" || selected.id === "alluvial-lowland") && (
                      <Link href="/marketplace?category=seeds"
                        style={{ padding: "9px 14px", background: G, color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                        🌾 ISRIZ-7
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "2rem", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
                  <h3 style={{ fontWeight: 800, color: DARK, fontSize: 15, marginBottom: 8 }}>Select a Soil Zone</h3>
                  <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>Click any coloured zone on the map to view detailed soil properties, crop recommendations, and fertiliser guidance.</p>

                  {/* Quick stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
                    {[
                      { v: "5", l: "Soil Types", icon: "🌱" },
                      { v: "320k ha", l: "Arable Land", icon: "🌾" },
                      { v: "55k ha", l: "Rice Potential", icon: "🍚" },
                      { v: "8k ha", l: "Salt Zones", icon: "🧂" },
                    ].map(({ v, l, icon }) => (
                      <div key={l} style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 22 }}>{icon}</div>
                        <div style={{ fontWeight: 800, color: DARK, fontSize: 16 }}>{v}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TABLE TAB */}
        {activeTab === "table" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: 0 }}>📊 Soil Properties Database</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["all", "rice", "groundnut", "salt", "cashew"].map(c => (
                  <button key={c} onClick={() => setCropFilter(c)} style={{
                    padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    background: cropFilter === c ? G : "#f3f4f6",
                    color: cropFilter === c ? "#fff" : "#555",
                    border: "none",
                  }}>{c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}</button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                    {["Soil Type", "pH", "Salinity", "Drainage", "Organic C", "P (ppm)", "Suitable Crops", "Fertiliser"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", fontWeight: 700, color: "#374151", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSoils.map((s, i) => (
                    <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, color: DARK }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{s.props.pH}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ background: s.props.salinity === "None" ? "#d1fae5" : s.props.salinity === "High (4–8 dS/m)" ? "#fee2e2" : s.props.salinity === "Extreme (>12 dS/m)" ? "#dc2626" : "#fef3c7", color: s.props.salinity === "None" ? "#065f46" : s.props.salinity === "High (4–8 dS/m)" ? "#991b1b" : s.props.salinity === "Extreme (>12 dS/m)" ? "#fff" : "#92400e", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                          {s.props.salinity}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{s.props.drainage}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{s.props.organicCarbon}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>{String(s.props.phosphorus).replace(" ppm", "").split("(")[1]?.replace(")", "") ?? s.props.phosphorus}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {s.props.suitableCrops.slice(0, 3).map(c => (
                            <span key={c} style={{ background: "rgba(27,77,62,0.08)", color: G, borderRadius: 999, padding: "1px 7px", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>{c}</span>
                          ))}
                          {s.props.suitableCrops.length > 3 && <span style={{ fontSize: 10, color: "#9ca3af" }}>+{s.props.suitableCrops.length - 3}</span>}
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#555", fontSize: 12 }}>{s.props.fertilizer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SALINITY TAB */}
        {activeTab === "salinity" && (
          <div>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: "1.25rem", fontSize: 13, color: "#991b1b", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
              <div>
                <strong>Salinity Alert:</strong> 2 monitoring stations showing critical levels (&gt;6 dS/m). Recommend ISRIZ-7 salt-tolerant rice variety for affected areas in LRR and WCR.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: "1.5rem" }}>
              {SALINITY_STATIONS.map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e5e7eb", borderLeft: `5px solid ${RISK_COLORS[s.risk]}`, padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: DARK, fontSize: 14 }}>📍 {s.name}</div>
                    <span style={{ background: RISK_COLORS[s.risk] + "20", color: RISK_COLORS[s.risk], borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{s.risk}</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: RISK_COLORS[s.risk], marginBottom: 4 }}>{s.salinity} <span style={{ fontSize: 14, fontWeight: 600 }}>dS/m</span></div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.lat}, {s.lon}</div>
                  {/* Progress bar */}
                  <div style={{ marginTop: 10, height: 6, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 999, background: RISK_COLORS[s.risk], width: `${Math.min(100, (s.salinity / 10) * 100)}%`, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                    <span>0 dS/m</span><span>Safe &lt;2</span><span>Critical &gt;6</span>
                  </div>
                  {s.risk === "critical" && (
                    <Link href="/marketplace?category=seeds" style={{ display: "block", marginTop: 10, padding: "6px 12px", background: GOLD, color: DARK, borderRadius: 6, fontSize: 11, fontWeight: 800, textDecoration: "none", textAlign: "center" }}>
                      → Get ISRIZ-7 Salt-Tolerant Seeds
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div style={{ background: `linear-gradient(135deg, rgba(27,77,62,0.06), rgba(196,148,58,0.06))`, borderRadius: 12, border: "1px solid rgba(196,148,58,0.2)", padding: "1.25rem" }}>
              <h3 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: "0 0 10px" }}>💧 Salinity Tolerance Scale</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {[
                  { range: "0–2 dS/m", label: "Safe", color: "#10B981", crops: "All crops" },
                  { range: "2–4 dS/m", label: "Moderate", color: "#EAB308", crops: "Rice, vegetables" },
                  { range: "4–6 dS/m", label: "Warning", color: "#F59E0B", crops: "ISRIZ-7, mangrove" },
                  { range: ">6 dS/m", label: "Critical", color: "#DC2626", crops: "Salt-tolerant only" },
                ].map(({ range, label, color, crops }) => (
                  <div key={range} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", borderLeft: `4px solid ${color}` }}>
                    <div style={{ fontWeight: 700, color, fontSize: 13 }}>{range}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: DARK }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{crops}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data source footer */}
        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: "2rem" }}>
          Data: SOTER Senegal & The Gambia (ISRIC 2008) · GBOS 2024 · Regional Soil Fertility Mapping Project 2023–2026 · Fortis OS © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
