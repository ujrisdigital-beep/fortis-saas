"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const DARK = "#0A2E1A";
const G = "#1B4D3E";
const GOLD = "#C4943A";

const SCALE_OPTIONS = [
  { id: "small", label: "Small (0.5 ha)", hectares: 0.5, capexBase: 500_000, note: "Suitable for cooperatives" },
  { id: "medium", label: "Medium (2 ha)", hectares: 2, capexBase: 1_600_000, note: "Family enterprise" },
  { id: "large", label: "Large (5 ha)", hectares: 5, capexBase: 3_500_000, note: "Commercial operation" },
  { id: "enterprise", label: "Enterprise (10 ha)", hectares: 10, capexBase: 6_000_000, note: "GIEPA anchor investor" },
  { id: "custom", label: "Custom", hectares: 0, capexBase: 0, note: "Enter your own figures" },
];

const SALT_PRICE_GMD = 4000; // per tonne average
const YIELD_LOW = 15; // tonnes/ha/year
const YIELD_HIGH = 25; // tonnes/ha/year

function formatGMD(n: number) {
  if (n >= 1_000_000) return `D${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `D${(n / 1_000).toFixed(0)}k`;
  return `D${n.toFixed(0)}`;
}

export default function SaltInvestmentPage() {
  const [scale, setScale] = useState("medium");
  const [customHa, setCustomHa] = useState(2);
  const [customCapex, setCustomCapex] = useState(1_600_000);
  const [pricePerTonne, setPricePerTonne] = useState(SALT_PRICE_GMD);
  const [yieldPerHa, setYieldPerHa] = useState(20);
  const [opexPercent, setOpexPercent] = useState(25); // % of revenue
  const [taxHoliday, setTaxHoliday] = useState(true);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const scaleData = SCALE_OPTIONS.find(s => s.id === scale)!;
  const hectares = scale === "custom" ? customHa : scaleData.hectares;
  const capex = scale === "custom" ? customCapex : scaleData.capexBase;

  const results = useMemo(() => {
    const annualYield = hectares * yieldPerHa; // tonnes
    const annualRevenue = annualYield * pricePerTonne;
    const annualOpex = annualRevenue * (opexPercent / 100);
    const annualProfit = annualRevenue - annualOpex;
    const roi = capex > 0 ? ((annualProfit / capex) * 100) : 0;
    const paybackYears = capex > 0 && annualProfit > 0 ? capex / annualProfit : 999;

    // Tax: 0% for first 5 years if GIEPA holiday, 25% thereafter
    const taxRate = (y: number) => (taxHoliday && y <= 5) ? 0 : 0.25;

    const fiveYear = Array.from({ length: 10 }, (_, i) => {
      const year = i + 1;
      const revenue = annualRevenue;
      const opex = annualOpex;
      const ebt = revenue - opex;
      const tax = ebt * taxRate(year);
      const netProfit = ebt - tax;
      const cumulative = netProfit * year - capex;
      return { year, revenue, opex, ebt, tax, netProfit, cumulative };
    });

    return {
      annualYield,
      annualRevenue,
      annualOpex,
      annualProfit,
      roi,
      paybackYears,
      fiveYear,
    };
  }, [hectares, capex, yieldPerHa, pricePerTonne, opexPercent, taxHoliday]);

  const breakEvenYear = results.fiveYear.find(r => r.cumulative >= 0)?.year ?? null;

  return (
    <main style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, #5C3D11 60%, ${GOLD} 100%)`, padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Link href="/soil-mapping" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>← Soil Map</Link>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, margin: "8px 0 4px" }}>🧂 Salt Production Investment Calculator</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: 0 }}>Solar salt production ROI, payback period, and 10-year cashflow — with GIEPA incentive modelling</p>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", gap: 16 }}>
          {/* INPUT PANEL */}
          <div>
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "1.25rem", marginBottom: 12 }}>
              <h2 style={{ fontWeight: 800, color: DARK, fontSize: 14, margin: "0 0 1rem" }}>⚙️ Investment Parameters</h2>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Operation Scale</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {SCALE_OPTIONS.map(s => (
                    <button key={s.id} onClick={() => setScale(s.id)} style={{
                      padding: "9px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left", border: "1.5px solid",
                      borderColor: scale === s.id ? GOLD : "#e5e7eb",
                      background: scale === s.id ? "rgba(196,148,58,0.08)" : "#fafafa",
                      transition: "all 0.15s",
                    }}>
                      <div style={{ fontWeight: 700, color: DARK, fontSize: 13 }}>{s.label}</div>
                      {s.note && <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.note}</div>}
                    </button>
                  ))}
                </div>
              </div>

              {scale === "custom" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <div>
                    <label style={labelStyle}>Hectares</label>
                    <input type="number" min={0.1} step={0.5} value={customHa}
                      onChange={e => setCustomHa(parseFloat(e.target.value) || 0)}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Capital (GMD)</label>
                    <input type="number" min={0} step={100000} value={customCapex}
                      onChange={e => setCustomCapex(parseInt(e.target.value) || 0)}
                      style={inputStyle} />
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Salt Price (GMD/tonne)</label>
                  <input type="number" min={1000} step={500} value={pricePerTonne}
                    onChange={e => setPricePerTonne(parseInt(e.target.value) || 4000)}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Yield (t/ha/year): {yieldPerHa}t</label>
                  <input type="range" min={YIELD_LOW} max={YIELD_HIGH} value={yieldPerHa}
                    onChange={e => setYieldPerHa(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: GOLD }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" }}>
                    <span>{YIELD_LOW}t</span><span>{YIELD_HIGH}t</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Operating Costs: {opexPercent}%</label>
                  <input type="range" min={15} max={45} value={opexPercent}
                    onChange={e => setOpexPercent(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: G }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" }}>
                    <span>15%</span><span>45%</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <input type="checkbox" id="giepa" checked={taxHoliday} onChange={e => setTaxHoliday(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: GOLD, cursor: "pointer" }} />
                  <label htmlFor="giepa" style={{ fontSize: 12, fontWeight: 600, color: DARK, cursor: "pointer" }}>
                    Apply GIEPA Tax Holiday<br /><span style={{ fontWeight: 400, color: "#9ca3af" }}>(5-year 0% tax)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* GIEPA Info */}
            <div style={{ background: "rgba(196,148,58,0.08)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 12, padding: "1rem" }}>
              <div style={{ fontWeight: 800, color: DARK, fontSize: 13, marginBottom: 8 }}>🏛️ GIEPA Investment Incentives</div>
              <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: "#555", lineHeight: 1.7 }}>
                <li>5-year corporate tax holiday (0% tax)</li>
                <li>Duty-free import of production equipment</li>
                <li>No withholding tax on dividends (first 5 years)</li>
                <li>Land lease priority for coastal zones</li>
                <li>Export facilitation support</li>
              </ul>
              <a href="mailto:ceo@fortisos.co.uk?subject=GIEPA Salt Investment Enquiry"
                style={{ display: "inline-block", marginTop: 10, padding: "7px 14px", background: GOLD, color: DARK, borderRadius: 8, fontSize: 12, fontWeight: 800, textDecoration: "none" }}>
                Get Investment Support →
              </a>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[
                { icon: "📦", label: "Annual Yield", v: `${results.annualYield.toLocaleString()} t`, sub: `${hectares} ha × ${yieldPerHa}t/ha` },
                { icon: "💰", label: "Annual Revenue", v: formatGMD(results.annualRevenue), sub: `${pricePerTonne.toLocaleString()} GMD/t` },
                { icon: "📊", label: "Annual Profit", v: formatGMD(results.annualProfit), sub: `After ${opexPercent}% opex`, highlight: true },
                { icon: "📈", label: "ROI", v: `${results.roi.toFixed(1)}%`, sub: "Year 1 return", highlight: true },
                { icon: "⏱️", label: "Payback Period", v: results.paybackYears < 100 ? `${results.paybackYears.toFixed(1)} yrs` : "N/A", sub: breakEvenYear ? `Break-even yr ${breakEvenYear}` : "Not reached in 10yr" },
                { icon: "🏛️", label: "CAPEX Required", v: formatGMD(capex), sub: `${hectares} ha operation` },
              ].map(({ icon, label, v, sub, highlight }) => (
                <div key={label} style={{ background: highlight ? `linear-gradient(135deg, rgba(27,77,62,0.06), rgba(196,148,58,0.06))` : "#fff", borderRadius: 12, border: `1.5px solid ${highlight ? "rgba(196,148,58,0.3)" : "#e5e7eb"}`, padding: "12px" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{icon} {label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: highlight ? GOLD : DARK }}>{v}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* 10-Year Cashflow Table */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontWeight: 800, color: DARK, fontSize: 13, margin: 0 }}>📅 10-Year Cashflow Projection</h3>
                {breakEvenYear && (
                  <span style={{ background: "#d1fae5", color: "#065f46", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                    Break-even: Year {breakEvenYear}
                  </span>
                )}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", textAlign: "right" }}>
                      <th style={{ ...thStyle, textAlign: "left" }}>Year</th>
                      <th style={thStyle}>Revenue</th>
                      <th style={thStyle}>Opex</th>
                      <th style={thStyle}>Tax</th>
                      <th style={thStyle}>Net Profit</th>
                      <th style={thStyle}>Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.fiveYear.map((r, i) => {
                      const isBreakEven = r.cumulative >= 0 && (i === 0 || results.fiveYear[i - 1].cumulative < 0);
                      const isHoliday = taxHoliday && r.year <= 5;
                      return (
                        <tr key={r.year}
                          onClick={() => setActiveYear(activeYear === r.year ? null : r.year)}
                          style={{ background: isBreakEven ? "#f0fdf4" : activeYear === r.year ? "rgba(196,148,58,0.05)" : i % 2 === 0 ? "#fff" : "#fafafa", cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "8px 10px", fontWeight: 700, color: DARK }}>
                            {isBreakEven && <span style={{ color: "#10B981", marginRight: 4 }}>✓</span>}
                            Yr {r.year}
                            {isHoliday && <span style={{ fontSize: 9, color: GOLD, fontWeight: 700, marginLeft: 4 }}>GIEPA</span>}
                          </td>
                          <td style={{ ...tdStyle, color: "#059669" }}>{formatGMD(r.revenue)}</td>
                          <td style={{ ...tdStyle, color: "#9ca3af" }}>({formatGMD(r.opex)})</td>
                          <td style={{ ...tdStyle, color: r.tax > 0 ? "#EF4444" : "#9ca3af" }}>{r.tax > 0 ? `(${formatGMD(r.tax)})` : "—"}</td>
                          <td style={{ ...tdStyle, fontWeight: 700, color: r.netProfit >= 0 ? DARK : "#EF4444" }}>{formatGMD(r.netProfit)}</td>
                          <td style={{ ...tdStyle, fontWeight: 700, color: r.cumulative >= 0 ? "#10B981" : "#EF4444" }}>
                            {r.cumulative >= 0 ? "+" : ""}{formatGMD(r.cumulative)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: "8px 14px", fontSize: 11, color: "#9ca3af", borderTop: "1px solid #f3f4f6" }}>
                ⚠️ Projections are indicative. Actual results depend on market conditions, weather, and management quality.
              </div>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: "2rem" }}>
          Fortis OS Agri-Intel · Data sources: GIEPA 2024, FAO Salt Market Analysis · © FORTIS INVICTA LTD {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  borderRadius: 8,
  border: "1.5px solid #d1d5db",
  background: "#fafafa",
  color: "#111",
  fontSize: 13,
  boxSizing: "border-box",
};

const thStyle: React.CSSProperties = {
  padding: "8px 10px",
  fontWeight: 700,
  color: "#374151",
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "right",
};
