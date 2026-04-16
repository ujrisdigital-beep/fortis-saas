"use client";

import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";

const PORTS = ["Banjul Port", "Banjul International Airport", "Farafenni Border", "Karang Border", "Basse Land Border"];
const DESTINATIONS_INT = ["Dakar, Senegal", "Conakry, Guinea", "Freetown, Sierra Leone", "Accra, Ghana", "Lagos, Nigeria", "London, UK", "Dubai, UAE", "China (Guangzhou)", "India (Mumbai)", "USA (New York)"];

const COURIERS = [
  { id: "dhl",     name: "DHL Express",    logo: "🟡", services: ["Express 1-2d", "Standard 3-5d"], baseRate: 85, perKg: 18, local: false, intl: true,  phone: "4228160",   tracking: true },
  { id: "fedex",   name: "FedEx",          logo: "🟣", services: ["Priority 1-2d", "Economy 4-7d"], baseRate: 90, perKg: 20, local: false, intl: true,  phone: "4228161",   tracking: true },
  { id: "ups",     name: "UPS",            logo: "🟤", services: ["Worldwide Express", "Standard"],  baseRate: 88, perKg: 19, local: false, intl: true,  phone: "4228162",   tracking: true },
  { id: "aramex",  name: "Aramex",         logo: "🔴", services: ["Express", "Economy"],            baseRate: 75, perKg: 16, local: false, intl: true,  phone: "4228163",   tracking: true },
  { id: "gpa",     name: "GPA Courier",    logo: "🟢", services: ["Same Day", "Next Day", "Regular"],baseRate: 50, perKg: 8,  local: true,  intl: false, phone: "4201234",   tracking: false },
  { id: "qexpress",name: "Q-Express GM",   logo: "🔵", services: ["Same Day", "Next Day"],           baseRate: 45, perKg: 7,  local: true,  intl: false, phone: "7701234",   tracking: false },
  { id: "salam",   name: "Salam Transport",logo: "🟠", services: ["Inter-city", "Cross-border"],    baseRate: 40, perKg: 6,  local: true,  intl: true,  phone: "9901234",   tracking: false },
];

const BUS_OPERATORS = [
  { name: "Gambia Bus Service (GBS)", capacity: [30, 45, 60], dailyRate: 12000, driverIncluded: true, ac: true, routes: ["Banjul–Basse", "Banjul–Farafenni", "Banjul–Brikama"] },
  { name: "Trans-Gambia Coaches",     capacity: [35, 50],     dailyRate: 10000, driverIncluded: true, ac: true, routes: ["All major routes", "Cross-border Senegal"] },
  { name: "Regional Bus Lines",       capacity: [20, 30],     dailyRate: 7500,  driverIncluded: true, ac: false, routes: ["Banjul–Basse", "Banjul–Kaur"] },
  { name: "Premium Coach Hire",       capacity: [40, 55],     dailyRate: 15000, driverIncluded: true, ac: true,  routes: ["Custom routes", "Airport transfers", "Tours"] },
];

export default function LogisticsPage() {
  const [tab, setTab] = useState<"cargo" | "courier" | "bus">("cargo");

  // Cargo
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoResult, setCargoResult] = useState<null | { sea: number; air: number; road: number }>(null);

  // Courier
  const [pkgWeight, setPkgWeight] = useState("");
  const [couType, setCouType] = useState<"local" | "international">("local");
  const [couDest, setCouDest] = useState("");

  // Bus
  const [busCapacity, setBusCapacity] = useState("");
  const [busDays, setBusDays] = useState("1");
  const [busRoute, setBusRoute] = useState("");
  const [busResult, setBusResult] = useState<null | { min: number; max: number }>(null);

  function calcCargo() {
    const kg = Number(weight);
    const cbm = Number(volume) || 1;
    const isIntl = DESTINATIONS_INT.some((d) => destination.includes(d.split(",")[0]));
    const sea = Math.round((kg * 3 + cbm * 1200) * (isIntl ? 4 : 1));
    const air = Math.round(kg * (isIntl ? 85 : 18));
    const road = Math.round(kg * (isIntl ? 12 : 5) + cbm * 200);
    setCargoResult({ sea, air, road });
  }

  function calcBus() {
    const days = Number(busDays) || 1;
    const min = Math.round(BUS_OPERATORS[2].dailyRate * days);
    const max = Math.round(BUS_OPERATORS[3].dailyRate * days);
    setBusResult({ min, max });
  }

  const filteredCouriers = COURIERS.filter((c) => couType === "local" ? c.local : c.intl);

  function courierPrice(c: typeof COURIERS[0]) {
    const kg = Number(pkgWeight) || 1;
    return Math.round(c.baseRate + kg * c.perKg);
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        {/* Hero */}
        <div style={heroBandStyle}>
          <div style={heroInnerStyle}>
            <span style={tagStyle}>🚚 LOGISTICS & CARGO</span>
            <h1 style={heroTitleStyle}>Gambia Logistics Hub</h1>
            <p style={heroSubStyle}>Freight estimates, courier comparison, and coach hire — all in one place.</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={tabBarStyle}>
          <div style={tabInnerStyle}>
            {[
              { id: "cargo",   label: "📦 Cargo & Freight" },
              { id: "courier", label: "✉️ Courier Services" },
              { id: "bus",     label: "🚌 Bus / Coach Hire" },
            ].map((tab_) => (
              <button
                key={tab_.id}
                type="button"
                onClick={() => setTab(tab_.id as typeof tab)}
                style={{
                  ...tabBtnStyle,
                  borderBottom: tab === tab_.id ? "3px solid #1B4D3E" : "3px solid transparent",
                  color: tab === tab_.id ? "#1B4D3E" : "#64748B",
                  fontWeight: tab === tab_.id ? 800 : 600,
                }}
              >{tab_.label}</button>
            ))}
          </div>
        </div>

        <div style={contentStyle}>

          {/* ── CARGO ── */}
          {tab === "cargo" && (
            <div style={gridStyle}>
              <div style={formCardStyle}>
                <h2 style={cardTitleStyle}>Freight Cost Estimator</h2>
                <div style={fieldsStyle}>
                  <Field label="Total Weight (kg) *" value={weight} onChange={setWeight} placeholder="e.g. 500" type="number" />
                  <Field label="Volume (CBM) — optional" value={volume} onChange={setVolume} placeholder="e.g. 2.5" type="number" />
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Origin *</label>
                    <select className="fortis-input" value={origin} onChange={(e) => setOrigin(e.target.value)}>
                      <option value="">Select origin…</option>
                      {PORTS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Destination *</label>
                    <select className="fortis-input" value={destination} onChange={(e) => setDestination(e.target.value)}>
                      <option value="">Select destination…</option>
                      <optgroup label="Domestic / ECOWAS">
                        {PORTS.map((p) => <option key={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="International">
                        {DESTINATIONS_INT.map((p) => <option key={p}>{p}</option>)}
                      </optgroup>
                    </select>
                  </div>
                  <button type="button" className="btn-primary" disabled={!weight || !origin || !destination} onClick={calcCargo} style={{ opacity: (!weight || !origin || !destination) ? 0.5 : 1 }}>
                    Calculate Freight
                  </button>
                </div>
              </div>

              <div>
                {!cargoResult ? (
                  <div style={emptyStyle}><span style={{ fontSize: "3rem" }}>🚢</span><p style={{ color: "#64748B" }}>Enter shipment details for freight estimates.</p></div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.85rem" }}>
                    {[
                      { mode: "Sea Freight 🚢", time: "15–30 days", price: cargoResult.sea, note: "Most economical for heavy cargo. Via Banjul Port.", best: cargoResult.sea < cargoResult.air },
                      { mode: "Air Freight ✈️", time: "2–5 days", price: cargoResult.air, note: "Fastest option. Via Banjul International Airport.", best: cargoResult.air < cargoResult.sea && cargoResult.air < cargoResult.road },
                      { mode: "Road Freight 🛻", time: "1–7 days", price: cargoResult.road, note: "Best for domestic & ECOWAS routes. Flexible pickup.", best: cargoResult.road < cargoResult.sea && cargoResult.road < cargoResult.air },
                    ].map((r) => (
                      <div key={r.mode} style={{ ...modeCardStyle, borderLeft: r.best ? "4px solid #D4AF37" : "4px solid #E2E8F0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ margin: "0 0 0.2rem", fontWeight: 800, color: "#0A1C2E", fontSize: "0.95rem" }}>{r.mode}</p>
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B" }}>⏱ {r.time} · {r.note}</p>
                          </div>
                          <div style={{ textAlign: "right" as const }}>
                            {r.best && <span style={bestTagStyle}>Best Value</span>}
                            <p style={{ margin: 0, fontWeight: 800, fontSize: "1.3rem", color: "#1B4D3E" }}>D{r.price.toLocaleString()}</p>
                            <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748B" }}>estimated</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#94A3B8", lineHeight: 1.5 }}>
                      * Estimates based on standard rates. Contact operators for confirmed quotes. Fuel surcharges and customs clearance fees may apply.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── COURIER ── */}
          {tab === "courier" && (
            <div>
              <div style={courierFilterStyle}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[
                    { id: "local", label: "🇬🇲 Local / Domestic" },
                    { id: "international", label: "🌍 International" },
                  ].map((t_) => (
                    <button
                      key={t_.id}
                      type="button"
                      onClick={() => setCouType(t_.id as typeof couType)}
                      style={{
                        padding: "0.45rem 0.9rem", borderRadius: "999px", fontFamily: "inherit",
                        border: `1.5px solid ${couType === t_.id ? "#1B4D3E" : "#E2E8F0"}`,
                        background: couType === t_.id ? "#1B4D3E" : "#FFFFFF",
                        color: couType === t_.id ? "#FFFFFF" : "#0A1C2E",
                        fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                      }}
                    >{t_.label}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0A1C2E", whiteSpace: "nowrap" as const }}>Package weight (kg):</label>
                  <input type="number" className="fortis-input" style={{ width: "100px" }} value={pkgWeight} onChange={(e) => setPkgWeight(e.target.value)} placeholder="e.g. 2" min="0.1" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                {filteredCouriers.sort((a, b) => courierPrice(a) - courierPrice(b)).map((c, i) => (
                  <div key={c.id} style={{ ...courierCardStyle, borderLeft: i === 0 ? "4px solid #D4AF37" : "4px solid #E2E8F0" }}>
                    {i === 0 && pkgWeight && <span style={bestTagStyle}>Cheapest</span>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                        <span style={{ fontSize: "1.75rem" }}>{c.logo}</span>
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, color: "#0A1C2E", fontSize: "0.92rem" }}>{c.name}</p>
                          {c.tracking && <span style={trackBadgeStyle}>📍 Live Tracking</span>}
                        </div>
                      </div>
                      {pkgWeight && (
                        <p style={{ margin: 0, fontWeight: 800, fontSize: "1.2rem", color: "#1B4D3E" }}>D{courierPrice(c).toLocaleString()}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.35rem", marginBottom: "0.75rem" }}>
                      {c.services.map((s) => <span key={s} style={serviceBadgeStyle}>{s}</span>)}
                    </div>
                    <a
                      href={`https://wa.me/220${c.phone}?text=${encodeURIComponent(`Hi ${c.name}, I need a courier quote for ${pkgWeight || "?"}kg package going to ${couDest || "destination"}.`)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={waBtnStyle}
                    >💬 WhatsApp for Quote</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BUS HIRE ── */}
          {tab === "bus" && (
            <div style={gridStyle}>
              <div style={formCardStyle}>
                <h2 style={cardTitleStyle}>Bus / Coach Hire</h2>
                <div style={fieldsStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Required Capacity (passengers)</label>
                    <select className="fortis-input" value={busCapacity} onChange={(e) => setBusCapacity(e.target.value)}>
                      <option value="">Select capacity…</option>
                      {[20, 30, 35, 40, 45, 50, 55, 60].map((n) => <option key={n} value={n}>{n} passengers</option>)}
                    </select>
                  </div>
                  <Field label="Number of Days *" value={busDays} onChange={setBusDays} placeholder="e.g. 2" type="number" />
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Route / Destination</label>
                    <input type="text" className="fortis-input" value={busRoute} onChange={(e) => setBusRoute(e.target.value)} placeholder="e.g. Banjul to Basse or Airport Transfer" />
                  </div>
                  <button type="button" className="btn-primary" disabled={!busDays} onClick={calcBus} style={{ opacity: !busDays ? 0.5 : 1 }}>
                    Get Price Estimate
                  </button>
                </div>
              </div>

              <div>
                {busResult && (
                  <div style={{ background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", borderRadius: "0.85rem", padding: "1.75rem", marginBottom: "1rem", color: "#FFFFFF" }}>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Estimated Cost</p>
                    <p style={{ margin: "0 0 0.2rem", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "#D4AF37" }}>
                      D{busResult.min.toLocaleString()} – D{busResult.max.toLocaleString()}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
                      for {busDays} day{Number(busDays) > 1 ? "s" : ""} · includes driver · fuel extra
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                  {BUS_OPERATORS.map((op) => (
                    <div key={op.name} style={busCardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: "0.5rem" }}>
                        <div>
                          <p style={{ margin: "0 0 0.2rem", fontWeight: 800, color: "#0A1C2E", fontSize: "0.92rem" }}>{op.name}</p>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" as const }}>
                            {op.ac && <span style={featureBadgeStyle}>❄️ A/C</span>}
                            {op.driverIncluded && <span style={featureBadgeStyle}>👤 Driver incl.</span>}
                            {op.capacity.map((c) => <span key={c} style={featureBadgeStyle}>{c} seats</span>)}
                          </div>
                        </div>
                        <p style={{ margin: 0, fontWeight: 800, color: "#1B4D3E", fontSize: "1rem" }}>D{op.dailyRate.toLocaleString()}/day</p>
                      </div>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" as const, marginTop: "0.5rem" }}>
                        {op.routes.map((r) => <span key={r} style={{ fontSize: "0.72rem", background: "#f0fdf4", color: "#065f46", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>{r}</span>)}
                      </div>
                      <a
                        href={`https://wa.me/220${op.name === "Gambia Bus Service (GBS)" ? "4201000" : "7701001"}?text=${encodeURIComponent(`Hi, I need to hire a coach from ${op.name}. Route: ${busRoute || "TBD"}, Duration: ${busDays} day(s), Capacity needed: ${busCapacity || "?"}.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ ...waBtnStyle, marginTop: "0.5rem", display: "inline-block" }}
                      >💬 WhatsApp to Book</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <input type={type} className="fortis-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const heroBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "3rem 1.25rem 2.5rem" };
const heroInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const tagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.85rem" };
const heroTitleStyle: React.CSSProperties = { margin: "0 0 0.5rem", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#FFFFFF" };
const heroSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.7 };
const tabBarStyle: React.CSSProperties = { background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 1.25rem" };
const tabInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", display: "flex" };
const tabBtnStyle: React.CSSProperties = { background: "none", border: "none", padding: "0.85rem 1.25rem", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", transition: "all 0.15s" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 5rem" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "380px 1fr", gap: "1.5rem" };
const formCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.75rem", alignSelf: "start" };
const cardTitleStyle: React.CSSProperties = { margin: "0 0 1.25rem", fontSize: "1.05rem", fontWeight: 800, color: "#0A1C2E" };
const fieldsStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "1rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.35rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const emptyStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "4rem 2rem", background: "#F8FAFC", border: "1.5px dashed #E2E8F0", borderRadius: "0.85rem", textAlign: "center" as const };
const modeCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.1rem 1.25rem" };
const bestTagStyle: React.CSSProperties = { display: "inline-block", background: "#fef3c7", color: "#92400e", fontSize: "0.65rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: "999px", marginBottom: "0.35rem" };
const courierFilterStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: "0.75rem", marginBottom: "1.25rem" };
const courierCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.25rem", position: "relative" as const };
const trackBadgeStyle: React.CSSProperties = { display: "inline-block", background: "#dbeafe", color: "#1e40af", fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.45rem", borderRadius: "999px" };
const serviceBadgeStyle: React.CSSProperties = { background: "#f1f5f9", color: "#475569", fontSize: "0.68rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "999px" };
const waBtnStyle: React.CSSProperties = { display: "block", textAlign: "center" as const, background: "#25D366", color: "#FFFFFF", padding: "0.55rem 1rem", borderRadius: "0.45rem", textDecoration: "none", fontWeight: 700, fontSize: "0.82rem" };
const busCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.1rem 1.25rem" };
const featureBadgeStyle: React.CSSProperties = { background: "#f1f5f9", color: "#475569", fontSize: "0.68rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "999px" };
