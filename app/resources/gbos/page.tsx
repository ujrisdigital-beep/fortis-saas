"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";

/* ── Types ─────────────────────────────────────────────────────── */
type CensusNational = {
  totalPopulation: number; malePopulation: number; femalePopulation: number;
  annualGrowthRate: number; urbanRate: number; medianAge: number;
  fertilityRate: number; lifeExpectancy: number; literacyRate: number; lastCensus: number;
};
type Region = { region: string; population: number; growthRate: number; urbanRate: number; area_km2: number };
type GdpCurrent = {
  year: number; gdpUSD: number; gdpPerCapitaUSD: number; realGrowthRate: number;
  nominalGrowthRate: number; inflation: number; exchangeRate: number;
};
type GdpHistorical = { year: number; gdpUSD: number; growthRate: number };
type Sector = { sector: string; share: number; growthRate: number };
type InflationCurrent = {
  year: number; month: string; headlineInflation: number; foodInflation: number;
  nonFoodInflation: number; coreInflation: number; policyRate: number;
};
type MonthlyInflation = { month: string; headline: number; food: number; nonFood: number };

/* ── Stat card ──────────────────────────────────────────────────── */
function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={statCardStyle}>
      <p style={statLabelStyle}>{label}</p>
      <p style={{ ...statValueStyle, color: accent || "#0A1C2E" }}>{value}</p>
      {sub && <p style={statSubStyle}>{sub}</p>}
    </div>
  );
}

/* ── Mini bar chart ─────────────────────────────────────────────── */
function BarChart({ data, valueKey, labelKey, color }: {
  data: Record<string, unknown>[];
  valueKey: string;
  labelKey: string;
  color: string;
}) {
  const max = Math.max(...data.map(d => Number(d[valueKey]) || 0));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      {data.map((d, i) => {
        const val = Number(d[valueKey]) || 0;
        const pct = max > 0 ? (val / max) * 100 : 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <span style={{ width: "120px", fontSize: "0.72rem", color: "#64748B", flexShrink: 0, textAlign: "right" }}>
              {String(d[labelKey])}
            </span>
            <div style={{ flex: 1, height: "10px", background: "#E2E8F0", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "999px", transition: "width 0.6s ease" }} />
            </div>
            <span style={{ width: "50px", fontSize: "0.72rem", fontWeight: 700, color: "#0A1C2E" }}>
              {val % 1 === 0 ? val.toLocaleString() : val.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function GBoSPage() {
  const [census, setCensus] = useState<{ national: CensusNational; regions: Region[] } | null>(null);
  const [gdp, setGdp] = useState<{ current: GdpCurrent; historical: GdpHistorical[]; sectors: Sector[] } | null>(null);
  const [inflation, setInflation] = useState<{ current: InflationCurrent; monthly: MonthlyInflation[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"population" | "economy" | "inflation">("population");

  useEffect(() => {
    async function loadAll() {
      try {
        const [cRes, gRes, iRes] = await Promise.all([
          fetch("/api/gbos/census?view=full"),
          fetch("/api/gbos/gdp?view=full"),
          fetch("/api/gbos/inflation?view=full"),
        ]);
        const [cData, gData, iData] = await Promise.all([cRes.json(), gRes.json(), iRes.json()]);
        setCensus({ national: cData.national, regions: cData.regions });
        setGdp({ current: gData.current, historical: gData.historical, sectors: gData.sectorContributions });
        setInflation({ current: iData.current, monthly: iData.monthly });
      } catch (e) {
        console.error("GBoS load error", e);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1.25rem 5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={eyebrowStyle}>GAMBIA BUREAU OF STATISTICS</p>
          <h1 style={pageTitleStyle}>National Data Dashboard</h1>
          <p style={pageSubStyle}>
            Live national statistics: population, GDP, inflation, and sector performance.
            Sources: GBoS 2023 PHC · World Bank WDI · Central Bank of The Gambia.
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "4rem", color: "#64748B" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }} />
            Loading national statistics…
          </div>
        )}

        {!loading && census && gdp && inflation && (
          <>
            {/* Top KPI strip */}
            <div style={kpiStripStyle}>
              <StatCard label="Total Population" value={census.national.totalPopulation.toLocaleString()} sub="2023 Census" accent="#1B4D3E" />
              <StatCard label="GDP (2024)" value={`$${(gdp.current.gdpUSD / 1e9).toFixed(2)}B`} sub="USD" accent="#1B4D3E" />
              <StatCard label="GDP Growth" value={`${gdp.current.realGrowthRate}%`} sub="Real, 2024" accent="#10B981" />
              <StatCard label="Headline Inflation" value={`${inflation.current.headlineInflation}%`} sub={`${inflation.current.month} ${inflation.current.year}`} accent="#E63946" />
              <StatCard label="GDP per Capita" value={`$${gdp.current.gdpPerCapitaUSD}`} sub="USD" />
              <StatCard label="Median Age" value={`${census.national.medianAge} yrs`} sub="2023" />
            </div>

            {/* Tabs */}
            <div style={tabBarStyle}>
              {(["population", "economy", "inflation"] as const).map(tab => (
                <button
                  key={tab}
                  style={{ ...tabButtonStyle, ...(activeTab === tab ? tabActiveStyle : {}) }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "population" ? "👥 Population" : tab === "economy" ? "📈 Economy" : "📊 Inflation"}
                </button>
              ))}
            </div>

            {/* POPULATION TAB */}
            {activeTab === "population" && (
              <div style={tabPanelStyle}>
                <div style={twoColStyle}>

                  {/* National indicators */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>National Indicators — {census.national.lastCensus} Census</p>
                    <div style={indicatorGridStyle}>
                      {[
                        { label: "Annual Growth Rate", value: `${census.national.annualGrowthRate}%` },
                        { label: "Urban Population", value: `${census.national.urbanRate}%` },
                        { label: "Literacy Rate", value: `${census.national.literacyRate}%` },
                        { label: "Life Expectancy", value: `${census.national.lifeExpectancy} yrs` },
                        { label: "Fertility Rate", value: census.national.fertilityRate.toFixed(1) },
                        { label: "Male Population", value: census.national.malePopulation.toLocaleString() },
                        { label: "Female Population", value: census.national.femalePopulation.toLocaleString() },
                        { label: "Median Age", value: `${census.national.medianAge} yrs` },
                      ].map(({ label, value }) => (
                        <div key={label} style={indicatorRowStyle}>
                          <span style={indLabelStyle}>{label}</span>
                          <span style={indValueStyle}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regions */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>Population by Region</p>
                    <BarChart
                      data={census.regions}
                      labelKey="region"
                      valueKey="population"
                      color="#1B4D3E"
                    />
                  </div>
                </div>

                {/* Region table */}
                <div style={{ ...sectionCardStyle, marginTop: "1rem" }}>
                  <p style={sectionLabelStyle}>Regional Detail</p>
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          {["Region", "Population", "Growth %", "Urban %", "Area km²"].map(h => (
                            <th key={h} style={thStyle}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {census.regions.map((r) => (
                          <tr key={r.region} style={trStyle}>
                            <td style={tdStyle}><strong>{r.region}</strong></td>
                            <td style={tdStyle}>{r.population.toLocaleString()}</td>
                            <td style={tdStyle}>{r.growthRate}%</td>
                            <td style={tdStyle}>{r.urbanRate}%</td>
                            <td style={tdStyle}>{r.area_km2.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ECONOMY TAB */}
            {activeTab === "economy" && (
              <div style={tabPanelStyle}>
                <div style={twoColStyle}>

                  {/* GDP headline */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>GDP Snapshot — {gdp.current.year}</p>
                    <div style={indicatorGridStyle}>
                      {[
                        { label: "GDP (USD)", value: `$${(gdp.current.gdpUSD / 1e9).toFixed(2)}B` },
                        { label: "Real Growth", value: `${gdp.current.realGrowthRate}%`, color: "#10B981" },
                        { label: "Nominal Growth", value: `${gdp.current.nominalGrowthRate}%` },
                        { label: "Per Capita USD", value: `$${gdp.current.gdpPerCapitaUSD}` },
                        { label: "Exchange Rate", value: `D${gdp.current.exchangeRate}/USD` },
                        { label: "Inflation", value: `${gdp.current.inflation}%`, color: "#E63946" },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={indicatorRowStyle}>
                          <span style={indLabelStyle}>{label}</span>
                          <span style={{ ...indValueStyle, color: color || "#0A1C2E" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GDP growth trend */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>GDP Growth Trend (2015–2024)</p>
                    <BarChart
                      data={gdp.historical}
                      labelKey="year"
                      valueKey="growthRate"
                      color="#D4AF37"
                    />
                  </div>
                </div>

                {/* Sector contributions */}
                <div style={{ ...sectionCardStyle, marginTop: "1rem" }}>
                  <p style={sectionLabelStyle}>GDP by Sector — Share & Growth</p>
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          {["Sector", "GDP Share %", "Growth Rate %", "Signal"].map(h => (
                            <th key={h} style={thStyle}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {gdp.sectors.sort((a, b) => b.share - a.share).map((s) => (
                          <tr key={s.sector} style={trStyle}>
                            <td style={tdStyle}><strong>{s.sector}</strong></td>
                            <td style={tdStyle}>{s.share}%</td>
                            <td style={{ ...tdStyle, color: s.growthRate > 10 ? "#10B981" : s.growthRate > 5 ? "#D4AF37" : "#64748B", fontWeight: 700 }}>
                              {s.growthRate}%
                            </td>
                            <td style={tdStyle}>
                              <span style={{
                                padding: "0.15rem 0.55rem",
                                borderRadius: "999px",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                background: s.growthRate > 10 ? "#dcfce7" : s.growthRate > 5 ? "#fef3c7" : "#F1F5F9",
                                color: s.growthRate > 10 ? "#166534" : s.growthRate > 5 ? "#92400e" : "#64748B",
                              }}>
                                {s.growthRate > 10 ? "🚀 High Growth" : s.growthRate > 5 ? "📈 Growing" : "📊 Stable"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* INFLATION TAB */}
            {activeTab === "inflation" && (
              <div style={tabPanelStyle}>
                <div style={twoColStyle}>

                  {/* Current CPI */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>CPI — {inflation.current.month} {inflation.current.year}</p>
                    <div style={indicatorGridStyle}>
                      {[
                        { label: "Headline Inflation", value: `${inflation.current.headlineInflation}%`, color: "#E63946" },
                        { label: "Food Inflation", value: `${inflation.current.foodInflation}%`, color: "#E63946" },
                        { label: "Non-Food Inflation", value: `${inflation.current.nonFoodInflation}%` },
                        { label: "Core Inflation", value: `${inflation.current.coreInflation}%` },
                        { label: "CBG Policy Rate", value: `${inflation.current.policyRate}%`, color: "#1B4D3E" },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={indicatorRowStyle}>
                          <span style={indLabelStyle}>{label}</span>
                          <span style={{ ...indValueStyle, color: color || "#0A1C2E" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly trend */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>Headline Inflation Monthly Trend</p>
                    <BarChart
                      data={inflation.monthly}
                      labelKey="month"
                      valueKey="headline"
                      color="#E63946"
                    />
                  </div>
                </div>

                {/* CPI detail table */}
                <div style={{ ...sectionCardStyle, marginTop: "1rem" }}>
                  <p style={sectionLabelStyle}>Monthly CPI — Headline / Food / Non-Food</p>
                  <div style={{ overflowX: "auto" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          {["Month", "Headline %", "Food %", "Non-Food %", "Trend"].map(h => (
                            <th key={h} style={thStyle}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {inflation.monthly.map((m, i) => {
                          const prev = inflation.monthly[i - 1];
                          const direction = prev ? (m.headline < prev.headline ? "↓" : m.headline > prev.headline ? "↑" : "→") : "—";
                          const dirColor = direction === "↓" ? "#10B981" : direction === "↑" ? "#E63946" : "#64748B";
                          return (
                            <tr key={m.month} style={trStyle}>
                              <td style={tdStyle}><strong>{m.month}</strong></td>
                              <td style={{ ...tdStyle, fontWeight: 700, color: "#E63946" }}>{m.headline}%</td>
                              <td style={tdStyle}>{m.food}%</td>
                              <td style={tdStyle}>{m.nonFood}%</td>
                              <td style={{ ...tdStyle, fontWeight: 800, color: dirColor, fontSize: "1rem" }}>{direction}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Source attribution */}
            <p style={sourceStyle}>
              Sources: Gambia Bureau of Statistics (GBoS) 2023 PHC · GBOS National Accounts 2024 ·
              World Bank WDI · Central Bank of The Gambia (CBG) · IMF WEO
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */
const eyebrowStyle: React.CSSProperties = { margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#1B4D3E" };
const pageTitleStyle: React.CSSProperties = { margin: "0.4rem 0 0.75rem", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "#0A1C2E" };
const pageSubStyle: React.CSSProperties = { margin: 0, color: "#64748B", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "64ch" };
const kpiStripStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" };
const statCardStyle: React.CSSProperties = { padding: "1rem 1.25rem", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem" };
const statLabelStyle: React.CSSProperties = { margin: "0 0 0.2rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B" };
const statValueStyle: React.CSSProperties = { margin: 0, fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 };
const statSubStyle: React.CSSProperties = { margin: "0.2rem 0 0", fontSize: "0.7rem", color: "#94A3B8" };
const tabBarStyle: React.CSSProperties = { display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" };
const tabButtonStyle: React.CSSProperties = { padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "1.5px solid #E2E8F0", background: "#FFFFFF", fontFamily: "inherit", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", color: "#64748B" };
const tabActiveStyle: React.CSSProperties = { background: "#1B4D3E", color: "#FFFFFF", borderColor: "#1B4D3E" };
const tabPanelStyle: React.CSSProperties = {};
const twoColStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" };
const sectionCardStyle: React.CSSProperties = { padding: "1.25rem 1.5rem", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem" };
const sectionLabelStyle: React.CSSProperties = { margin: "0 0 1rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#1B4D3E" };
const indicatorGridStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.6rem" };
const indicatorRowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0", borderBottom: "1px solid #F1F5F9" };
const indLabelStyle: React.CSSProperties = { fontSize: "0.82rem", color: "#64748B" };
const indValueStyle: React.CSSProperties = { fontSize: "0.9rem", fontWeight: 700 };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" };
const thStyle: React.CSSProperties = { padding: "0.6rem 0.75rem", textAlign: "left", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748B", borderBottom: "2px solid #E2E8F0", whiteSpace: "nowrap" };
const trStyle: React.CSSProperties = { borderBottom: "1px solid #F1F5F9" };
const tdStyle: React.CSSProperties = { padding: "0.6rem 0.75rem", color: "#0A1C2E", verticalAlign: "middle" };
const sourceStyle: React.CSSProperties = { marginTop: "2rem", fontSize: "0.72rem", color: "#94A3B8", lineHeight: 1.6, fontStyle: "italic" };
