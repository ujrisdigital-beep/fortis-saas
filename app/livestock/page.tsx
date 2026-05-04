"use client";

import { useState } from "react";
import { LIVESTOCK_CENSUS, LIVESTOCK_TOTALS, LIVESTOCK_TYPES, formatNumber } from "@/lib/livestock-census";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

export default function LivestockPage() {
  const [selectedAnimal, setSelectedAnimal] = useState<string>("total");

  // Sort regions by selected animal descending (excluding totals row)
  const sorted = [...LIVESTOCK_CENSUS].sort((a, b) => {
    const key = selectedAnimal as keyof typeof a;
    return (b[key] as number) - (a[key] as number);
  });

  const maxVal = Math.max(...LIVESTOCK_CENSUS.map(r => {
    const key = selectedAnimal as keyof typeof r;
    return r[key] as number;
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #14532d 55%, #166534 100%)`,
        color: "#fff", padding: "52px 24px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🐄</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Livestock Census — The Gambia
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.6 }}>
            GBoS livestock data by region — cattle, goats, sheep, poultry, pigs, and horses across all 7 regions.
          </p>
          {/* National totals */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {LIVESTOCK_TYPES.map(t => (
              <span key={t.key} style={{ background: "rgba(255,255,255,0.15)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600 }}>
                {t.emoji} {t.label}: {formatNumber(LIVESTOCK_TOTALS[t.key] as number)}
              </span>
            ))}
            <span style={{ background: "rgba(196,148,58,0.35)", padding: "5px 14px", borderRadius: 30, fontSize: 12, fontWeight: 700 }}>
              🐾 Total: {formatNumber(LIVESTOCK_TOTALS.total)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* National KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
          {LIVESTOCK_TYPES.map(t => (
            <button key={t.key}
              onClick={() => setSelectedAnimal(t.key)}
              style={{
                background: selectedAnimal === t.key ? t.color : "#fff",
                color: selectedAnimal === t.key ? "#fff" : DARK,
                borderRadius: 14, padding: "16px 10px", border: selectedAnimal === t.key ? "none" : "1.5px solid #E5E7EB",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{t.emoji}</div>
              <div style={{ fontSize: "clamp(16px, 3vw, 22px)", fontWeight: 900, lineHeight: 1.1 }}>
                {formatNumber(LIVESTOCK_TOTALS[t.key] as number)}
              </div>
              <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{t.label}</div>
            </button>
          ))}
          <button
            onClick={() => setSelectedAnimal("total")}
            style={{
              background: selectedAnimal === "total" ? DARK : "#fff",
              color: selectedAnimal === "total" ? "#fff" : DARK,
              borderRadius: 14, padding: "16px 10px", border: selectedAnimal === "total" ? "none" : "1.5px solid #E5E7EB",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center",
              cursor: "pointer", fontFamily: "inherit",
            }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🐾</div>
            <div style={{ fontSize: "clamp(16px, 3vw, 22px)", fontWeight: 900, lineHeight: 1.1 }}>
              {formatNumber(LIVESTOCK_TOTALS.total)}
            </div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>All Livestock</div>
          </button>
        </div>

        {/* Bar chart by region */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: DARK, marginBottom: 20 }}>
            {LIVESTOCK_TYPES.find(t => t.key === selectedAnimal)?.emoji ?? "🐾"} {LIVESTOCK_TYPES.find(t => t.key === selectedAnimal)?.label ?? "All Livestock"} by Region
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sorted.map(row => {
              const key = selectedAnimal as keyof typeof row;
              const val = row[key] as number;
              const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const color = LIVESTOCK_TYPES.find(t => t.key === selectedAnimal)?.color ?? G;
              return (
                <div key={row.region}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: DARK }}>📍 {row.region}</span>
                    <span style={{ fontWeight: 800, color: color }}>{formatNumber(val)}</span>
                  </div>
                  <div style={{ background: "#F3F4F6", borderRadius: 6, height: 12, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 6, transition: "width 0.3s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full data table */}
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: 24 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: DARK }}>📊 Full Livestock Data Table</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>GBoS Livestock Census 2023 estimates</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>Region</th>
                  {LIVESTOCK_TYPES.map(t => (
                    <th key={t.key} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: t.color, borderBottom: "1px solid #E5E7EB" }}>
                      {t.emoji} {t.label}
                    </th>
                  ))}
                  <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: DARK, borderBottom: "1px solid #E5E7EB" }}>🐾 Total</th>
                </tr>
              </thead>
              <tbody>
                {LIVESTOCK_CENSUS.map((row, i) => (
                  <tr key={row.region} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 700, color: DARK, borderBottom: "1px solid #F3F4F6" }}>📍 {row.region}</td>
                    {LIVESTOCK_TYPES.map(t => (
                      <td key={t.key} style={{ padding: "10px 12px", textAlign: "right", color: "#374151", borderBottom: "1px solid #F3F4F6" }}>
                        {row[t.key].toLocaleString()}
                      </td>
                    ))}
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: DARK, borderBottom: "1px solid #F3F4F6" }}>
                      {row.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr style={{ background: `${G}10` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 900, color: G }}>🇬🇲 NATIONAL TOTAL</td>
                  {LIVESTOCK_TYPES.map(t => (
                    <td key={t.key} style={{ padding: "12px 12px", textAlign: "right", fontWeight: 800, color: t.color }}>
                      {(LIVESTOCK_TOTALS[t.key] as number).toLocaleString()}
                    </td>
                  ))}
                  <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 900, color: G }}>
                    {LIVESTOCK_TOTALS.total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Source note */}
        <div style={{ background: `linear-gradient(135deg, rgba(27,77,62,0.06), rgba(196,148,58,0.06))`, border: "1.5px solid rgba(196,148,58,0.2)", borderRadius: 14, padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontWeight: 800, color: DARK, fontSize: 14, marginBottom: 6 }}>📋 Data Source & Methodology</div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 12px", lineHeight: 1.7 }}>
            Data sourced from GBoS Livestock & Agricultural Census (2023 estimates). Figures are indicative and rounded. Upper River Region consistently holds the highest livestock concentration. Contact GBoS for granular LGA-level data.
          </p>
          <a href="/resources/gbos" style={{ display: "inline-block", padding: "8px 18px", background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
            📊 GBoS Data Portal →
          </a>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          Livestock census data is indicative. For official figures, contact GBoS at <a href="https://www.gbos.gov.gm" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>gbos.gov.gm</a><br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
