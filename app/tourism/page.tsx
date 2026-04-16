"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

const LOCATIONS = ["Banjul / Atlantic Coast", "Kololi / Senegambia", "Kartong / South Coast", "Brikama Area", "Basse / Upper River", "Janjanbureh / Central River", "Other"];

const PEAK_SEASONS: Record<string, string[]> = {
  "hotel": ["November", "December", "January", "February", "March"],
  "lodge": ["November", "December", "January", "February"],
  "guesthouse": ["November", "December", "January", "February", "March", "April"],
};

const RATE_MODIFIERS: Record<string, number> = {
  "Banjul / Atlantic Coast": 1.3,
  "Kololi / Senegambia": 1.5,
  "Kartong / South Coast": 1.2,
  "Brikama Area": 0.9,
  "Basse / Upper River": 0.8,
  "Janjanbureh / Central River": 0.85,
  "Other": 1.0,
};

const BASE_RATES: Record<string, number> = { hotel: 3500, lodge: 2500, guesthouse: 1500 };

type TourismResult = {
  monthlyVisitors: number;
  annualVisitors: number;
  peakMonths: string[];
  recommendedRate: number;
  monthlyRevenue: number;
  peakRevenue: number;
  offPeakRevenue: number;
  occupancyTarget: number;
  advice: string;
};

export default function TourismPage() {
  const [propertyType, setPropertyType] = useState<"hotel" | "lodge" | "guesthouse">("hotel");
  const [rooms, setRooms] = useState("");
  const [location, setLocation] = useState("Kololi / Senegambia");
  const [currentOccupancy, setCurrentOccupancy] = useState("");
  const [result, setResult] = useState<TourismResult | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const roomCount = Number(rooms);
    const occupancy = Number(currentOccupancy) / 100;
    if (!roomCount || occupancy < 0) return;

    const baseRate = BASE_RATES[propertyType];
    const modifier = RATE_MODIFIERS[location];
    const recommendedRate = Math.round(baseRate * modifier / 100) * 100;

    const peakOccupancy = Math.min(0.95, occupancy + 0.35);
    const offPeakOccupancy = Math.max(0.1, occupancy - 0.15);
    const avgOccupancy = (peakOccupancy * 5 + offPeakOccupancy * 7) / 12;

    const monthlyVisitors = Math.round(roomCount * avgOccupancy * 30);
    const annualVisitors = monthlyVisitors * 12;

    const peakMonths = PEAK_SEASONS[propertyType];
    const monthlyRevenue = Math.round(roomCount * avgOccupancy * 30 * recommendedRate);
    const peakRevenue = Math.round(roomCount * peakOccupancy * 30 * recommendedRate * 1.2);
    const offPeakRevenue = Math.round(roomCount * offPeakOccupancy * 30 * recommendedRate * 0.85);
    const occupancyTarget = Math.round(peakOccupancy * 100);

    const advice = `With ${roomCount} rooms in ${location}, targeting a ${occupancyTarget}% peak occupancy at GMD ${recommendedRate.toLocaleString()}/night could generate GMD ${peakRevenue.toLocaleString()}/month during peak season (${peakMonths.slice(0, 2).join("–")}). Consider OTA listings on Booking.com and Airbnb to increase visibility. Offer discounted rates for longer stays in the off-peak months (${["May", "June", "July", "August", "September", "October"].filter((m) => !peakMonths.includes(m)).slice(0, 2).join("–")}).`;

    setResult({ monthlyVisitors, annualVisitors, peakMonths, recommendedRate, monthlyRevenue, peakRevenue, offPeakRevenue, occupancyTarget, advice });
  }

  const typeIcons: Record<string, string> = { hotel: "🏨", lodge: "🏕️", guesthouse: "🏡" };

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={headerBandStyle}>
          <div style={headerInnerStyle}>
            <span style={sectorTagStyle}>✈️ TOURISM SECTOR</span>
            <h1 style={pageTitleStyle}>Visitor & Revenue Predictor</h1>
            <p style={pageSubStyle}>
              Forecast visitor numbers, peak season revenue, and optimal pricing for your Gambian hospitality property.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          <div style={gridStyle}>
            {/* Form */}
            <div className="fortis-card" style={formCardStyle}>
              <h2 style={cardTitleStyle}>Property Details</h2>
              <form onSubmit={calculate} style={formStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Property Type</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {(["hotel", "lodge", "guesthouse"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setPropertyType(t)}
                        style={{
                          flex: 1, padding: "0.75rem 0.3rem", borderRadius: "0.5rem",
                          border: `2px solid ${propertyType === t ? "#1B4D3E" : "#E2E8F0"}`,
                          background: propertyType === t ? "#1B4D3E" : "#FFFFFF",
                          color: propertyType === t ? "#FFFFFF" : "#0A1C2E",
                          fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit", textAlign: "center" as const,
                        }}
                      >{typeIcons[t]}<br />{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                    ))}
                  </div>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Number of Rooms</label>
                  <input type="number" className="fortis-input" value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder="e.g. 12" min="1" required />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Location</label>
                  <select className="fortis-input" value={location} onChange={(e) => setLocation(e.target.value)}>
                    {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Current Occupancy Rate (%)</label>
                  <input type="number" className="fortis-input" value={currentOccupancy} onChange={(e) => setCurrentOccupancy(e.target.value)} placeholder="e.g. 45" min="0" max="100" required />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                  ✈️ Predict Visitors & Revenue
                </button>
              </form>
            </div>

            {/* Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!result && (
                <div style={emptyCardStyle}>
                  <p style={{ fontSize: "2.5rem", margin: 0 }}>🌅</p>
                  <p style={emptyTextStyle}>Enter your property details to forecast tourism revenue</p>
                </div>
              )}
              {result && (
                <>
                  <div style={resultBannerStyle}>
                    <Stat label="Monthly Visitors" value={result.monthlyVisitors.toLocaleString()} />
                    <Stat label="Annual Visitors" value={result.annualVisitors.toLocaleString()} />
                    <Stat label="Recommended Rate" value={`GMD ${result.recommendedRate.toLocaleString()}/night`} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <InfoBox label="Monthly Revenue Est." value={`GMD ${result.monthlyRevenue.toLocaleString()}`} />
                    <InfoBox label="Peak Season Revenue" value={`GMD ${result.peakRevenue.toLocaleString()}/mo`} highlight />
                    <InfoBox label="Off-Peak Revenue" value={`GMD ${result.offPeakRevenue.toLocaleString()}/mo`} />
                    <InfoBox label="Peak Occupancy Target" value={`${result.occupancyTarget}%`} />
                  </div>

                  {/* Peak Months */}
                  <div style={sectionCardStyle}>
                    <p style={sectionLabelStyle}>Peak Season Months</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => {
                        const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const isPeak = result.peakMonths.includes(fullMonths[i]);
                        return (
                          <span key={m} style={{
                            padding: "0.3rem 0.7rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700,
                            background: isPeak ? "#1B4D3E" : "#F8FAFC",
                            color: isPeak ? "#D4AF37" : "#64748B",
                            border: `1.5px solid ${isPeak ? "#1B4D3E" : "#E2E8F0"}`,
                          }}>{m}</span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Advice */}
                  <div style={{ background: "rgba(27,77,62,0.05)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
                    <p style={{ margin: "0 0 0.5rem", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#1B4D3E" }}>Revenue Strategy</p>
                    <p style={{ margin: 0, fontSize: "0.92rem", color: "#0A1C2E", lineHeight: 1.7 }}>{result.advice}</p>
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
      <p style={{ margin: 0, fontSize: "clamp(1.1rem,2.5vw,1.6rem)", fontWeight: 800, color: "#D4AF37", lineHeight: 1 }}>{value}</p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)" }}>{label}</p>
    </div>
  );
}

function InfoBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? "#1B4D3E" : "#FFFFFF", border: `1.5px solid ${highlight ? "#1B4D3E" : "#E2E8F0"}`, borderRadius: "0.75rem", padding: "1rem 1.25rem" }}>
      <p style={{ margin: "0 0 0.3rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: highlight ? "#D4AF37" : "#1B4D3E" }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 800, fontSize: "0.98rem", color: highlight ? "#FFFFFF" : "#0A1C2E" }}>{value}</p>
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
const sectionCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" };
const sectionLabelStyle: React.CSSProperties = { margin: "0 0 0.75rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#1B4D3E" };
