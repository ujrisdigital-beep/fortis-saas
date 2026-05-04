"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const DARK = "#0A2E1A";
const G = "#1B4D3E";
const GOLD = "#C4943A";

const SOILS = [
  { id: "continental-terminal", label: "Continental Terminal (Upland)", icon: "🏜️", color: "#D4A373" },
  { id: "alluvial-lowland", label: "Alluvial Lowland", icon: "🌊", color: "#6A9C89" },
  { id: "saline-tidal", label: "Saline Tidal Zone", icon: "🌊🧂", color: "#C1666B" },
  { id: "coastal-salt", label: "Coastal Salt Production", icon: "🧂", color: "#E8B86B" },
  { id: "iron-pan", label: "Iron Pan (Laterite)", icon: "🪨", color: "#A0522D" },
];

const CROPS = [
  { id: "groundnut", label: "Groundnut", icon: "🥜" },
  { id: "rice", label: "Rice", icon: "🍚" },
  { id: "salt-tolerant-rice", label: "Salt-Tolerant Rice (ISRIZ-7)", icon: "🌾" },
  { id: "maize", label: "Maize", icon: "🌽" },
  { id: "millet", label: "Millet", icon: "🌿" },
  { id: "cashew", label: "Cashew", icon: "🪴" },
  { id: "vegetables", label: "Vegetables", icon: "🥬" },
  { id: "sesame", label: "Sesame", icon: "✦" },
  { id: "salt", label: "Salt (Production)", icon: "🧂" },
  { id: "mangrove", label: "Mangrove Restoration", icon: "🌳" },
  { id: "rice-fish", label: "Rice-Fish System", icon: "🐟" },
  { id: "mango", label: "Mango", icon: "🥭" },
];

type CropResult = {
  id: string;
  suitability: number;
  yield: string;
  fertilizer: string;
  variety: string;
  investment?: string;
  roi?: string;
  giepa?: boolean;
};

type ApiResponse = {
  success?: boolean;
  error?: string;
  soil?: { id: string; name: string; pH: number; salinity: string };
  crop?: CropResult;
  recommendations?: string;
  crops?: CropResult[];
};

function SuitabilityBar({ score }: { score: number }) {
  const color = score >= 70 ? "#10B981" : score >= 45 ? "#F59E0B" : score >= 20 ? "#EF4444" : "#9ca3af";
  const label = score >= 70 ? "Highly Suitable" : score >= 45 ? "Moderately Suitable" : score >= 20 ? "Poorly Suitable" : "Not Suitable";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
        <span style={{ fontWeight: 700, color }}>{label}</span>
        <span style={{ fontWeight: 800, color, fontSize: 16 }}>{score}/100</span>
      </div>
      <div style={{ height: 10, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 999, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function CropSuitabilityContent() {
  const searchParams = useSearchParams();
  const [selectedSoil, setSelectedSoil] = useState(searchParams.get("soil") ?? "");
  const [selectedCrop, setSelectedCrop] = useState(searchParams.get("crop") ?? "");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [allCrops, setAllCrops] = useState<CropResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"picker" | "ranked">("picker");

  async function fetchCropSuitability() {
    if (!selectedSoil) return;
    setLoading(true);
    setResult(null);
    setAllCrops(null);
    try {
      const url = selectedCrop
        ? `/api/soil/crop-suitability?soil=${selectedSoil}&crop=${selectedCrop}`
        : `/api/soil/crop-suitability?soil=${selectedSoil}`;
      const res = await fetch(url);
      const data: ApiResponse = await res.json();
      if (selectedCrop) {
        setResult(data);
      } else {
        setAllCrops(data.crops ?? null);
        setResult(data);
      }
    } catch {
      setResult({ error: "Failed to fetch data. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  // Auto-fetch when soil changes for ranked view
  useEffect(() => {
    if (selectedSoil && mode === "ranked") fetchCropSuitability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSoil, mode]);

  const soilInfo = SOILS.find(s => s.id === selectedSoil);
  const cropInfo = CROPS.find(c => c.id === selectedCrop);

  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2E7D64 100%)`, padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Link href="/soil-mapping" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>← Soil Map</Link>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, margin: "8px 0 4px" }}>🌾 Crop Suitability Tool</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>Select your soil type and crop to get AI-powered yield and fertiliser guidance</p>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
          {[
            { id: "picker", label: "🔍 Specific Crop" },
            { id: "ranked", label: "📊 Rank All Crops" },
          ].map(m => (
            <button key={m.id} onClick={() => { setMode(m.id as "picker" | "ranked"); setResult(null); setAllCrops(null); }} style={{
              padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none",
              background: mode === m.id ? G : "#fff",
              color: mode === m.id ? "#fff" : "#555",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>{m.label}</button>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "1.5rem", marginBottom: "1.25rem" }}>
          <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: "0 0 1rem" }}>Select Soil Type</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
            {SOILS.map(s => (
              <button key={s.id} onClick={() => { setSelectedSoil(s.id); setResult(null); setAllCrops(null); }} style={{
                padding: "10px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                background: selectedSoil === s.id ? "rgba(27,77,62,0.08)" : "#fafafa",
                border: selectedSoil === s.id ? `2px solid ${s.color}` : "1.5px solid #e5e7eb",
                transition: "all 0.15s",
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{s.label}</div>
                <div style={{ width: 24, height: 4, borderRadius: 2, background: s.color, marginTop: 6 }} />
              </button>
            ))}
          </div>

          {mode === "picker" && (
            <>
              <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: "1.25rem 0 1rem" }}>Select Crop</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
                {CROPS.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCrop(c.id); setResult(null); }} style={{
                    padding: "8px 10px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                    background: selectedCrop === c.id ? "rgba(196,148,58,0.1)" : "#fafafa",
                    border: selectedCrop === c.id ? `2px solid ${GOLD}` : "1.5px solid #e5e7eb",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{c.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={fetchCropSuitability}
            disabled={loading || !selectedSoil || (mode === "picker" && !selectedCrop)}
            style={{
              marginTop: "1.25rem",
              padding: "11px 28px", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: loading || !selectedSoil ? "not-allowed" : "pointer",
              background: loading || !selectedSoil ? "#9ca3af" : `linear-gradient(135deg, ${G}, #2E7D64)`,
              color: "#fff", border: "none",
            }}
          >
            {loading ? "Analysing…" : mode === "picker" ? "Check Suitability →" : "Rank All Crops →"}
          </button>
        </div>

        {/* SINGLE CROP RESULT */}
        {result?.crop && result.soil && mode === "picker" && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "1.5rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: "1.25rem" }}>
              <div>
                <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Result for</div>
                <h3 style={{ fontWeight: 800, color: DARK, fontSize: 17, margin: 0 }}>
                  {cropInfo?.icon} {cropInfo?.label}
                  <span style={{ fontWeight: 400, color: "#9ca3af", fontSize: 13 }}> on {soilInfo?.label}</span>
                </h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Soil pH: {result.soil.pH}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Salinity: {result.soil.salinity}</div>
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <SuitabilityBar score={result.crop.suitability} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: "1rem" }}>
              {[
                { k: "Expected Yield", v: result.crop.yield, icon: "📦" },
                { k: "Recommended Variety", v: result.crop.variety, icon: "🌱" },
                { k: "Fertiliser", v: result.crop.fertilizer, icon: "🧪" },
                ...(result.crop.investment ? [{ k: "Investment", v: result.crop.investment, icon: "💰" }] : []),
                ...(result.crop.roi ? [{ k: "Est. ROI", v: result.crop.roi, icon: "📈" }] : []),
              ].map(({ k, v, icon }) => (
                <div key={k} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{icon} {k}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{v}</div>
                </div>
              ))}
            </div>

            {result.recommendations && (
              <div style={{ background: "rgba(27,77,62,0.06)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                💡 {result.recommendations}
              </div>
            )}

            {result.crop.giepa && (
              <div style={{ marginTop: 12, background: "rgba(196,148,58,0.1)", border: `1px solid rgba(196,148,58,0.3)`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: DARK }}>
                🏛️ <strong>GIEPA Incentive Eligible:</strong> 5-year tax holiday, duty-free equipment import. Contact GIEPA for licensing.
              </div>
            )}

            {(selectedCrop === "salt-tolerant-rice" || (selectedCrop === "rice" && selectedSoil === "saline-tidal")) && (
              <Link href="/marketplace?category=seeds" style={{ display: "inline-block", marginTop: 14, padding: "10px 22px", background: GOLD, color: DARK, borderRadius: 8, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                🛒 Buy ISRIZ-7 Seeds in Marketplace →
              </Link>
            )}

            {selectedSoil === "coastal-salt" && selectedCrop === "salt" && (
              <Link href="/soil-mapping/salt-investment" style={{ display: "inline-block", marginTop: 14, padding: "10px 22px", background: G, color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                📊 Open Salt Investment Calculator →
              </Link>
            )}
          </div>
        )}

        {/* RANKED ALL CROPS */}
        {allCrops && mode === "ranked" && result?.soil && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f3f4f6" }}>
              <h3 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: 0 }}>
                📊 All Crops Ranked for {soilInfo?.label}
              </h3>
            </div>
            {allCrops.map((crop, i) => {
              const ci = CROPS.find(c => c.id === crop.id);
              const color = crop.suitability >= 70 ? "#10B981" : crop.suitability >= 45 ? "#F59E0B" : crop.suitability >= 20 ? "#EF4444" : "#9ca3af";
              return (
                <div key={crop.id} style={{ padding: "12px 1.25rem", borderBottom: "1px solid #f9fafb", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {ci?.icon ?? "🌱"}
                  </div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{ci?.label ?? crop.id}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{crop.yield}</div>
                  </div>
                  <div style={{ flex: 2, minWidth: 160 }}>
                    <div style={{ height: 7, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${crop.suitability}%`, background: color, borderRadius: 999 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color, width: 44, textAlign: "right", flexShrink: 0 }}>
                    {crop.suitability}
                  </div>
                  <button
                    onClick={() => { setSelectedCrop(crop.id); setMode("picker"); setResult(null); setAllCrops(null); }}
                    style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "#f3f4f6", border: "none", color: "#555", flexShrink: 0 }}>
                    Details →
                  </button>
                </div>
              );
            })}
            {result.recommendations && (
              <div style={{ padding: "1rem 1.25rem", background: "rgba(27,77,62,0.04)", fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                💡 {result.recommendations}
              </div>
            )}
          </div>
        )}

        {result?.error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#991b1b" }}>
            {result.error}
          </div>
        )}
      </div>
    </main>
  );
}

export default function CropSuitabilityPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "#9ca3af" }}>Loading…</div>}>
      <CropSuitabilityContent />
    </Suspense>
  );
}
