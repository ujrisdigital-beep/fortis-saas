"use client";
import { useState } from "react";
import { useCurrency } from "../../../hooks/useCurrency";

const G = "#1B4D3E";
const GOLD = "#D4AF37";
const NAVY = "#0A1C2E";
const MUT = "#64748B";

type VehicleCat = "economy" | "saloon" | "suv" | "luxury" | "minibus" | "van";

interface Vehicle {
  id: string;
  name: string;
  make: string;
  category: VehicleCat;
  year: number;
  seats: number;
  ac: boolean;
  dailyRate: number;
  weeklyRate: number;
  driverAvailable: boolean;
  driverRate: number;
  available: boolean;
  owner: string;
  phone: string;
  location: string;
  features: string[];
  image: string;
}

const VEHICLES: Vehicle[] = [
  // Economy
  { id: "v1", name: "Toyota Yaris", make: "Toyota", category: "economy", year: 2019, seats: 5, ac: true, dailyRate: 1500, weeklyRate: 9000, driverAvailable: true, driverRate: 800, available: true, owner: "GambiaRent Ltd", phone: "2206001001", location: "Serrekunda", features: ["A/C", "FM Radio", "USB Charging", "Insurance Included"], image: "🚗" },
  { id: "v2", name: "Kia Picanto", make: "Kia", category: "economy", year: 2020, seats: 5, ac: true, dailyRate: 1200, weeklyRate: 7500, driverAvailable: true, driverRate: 800, available: true, owner: "TransGambia Cars", phone: "2206001002", location: "Banjul", features: ["A/C", "Bluetooth", "Fuel Efficient"], image: "🚗" },
  { id: "v3", name: "Dacia Sandero", make: "Dacia", category: "economy", year: 2021, seats: 5, ac: true, dailyRate: 1400, weeklyRate: 8500, driverAvailable: false, driverRate: 0, available: true, owner: "Budget Drive Gambia", phone: "2206001003", location: "Kanifing", features: ["A/C", "Central Locking", "USB Port"], image: "🚗" },
  // Saloon
  { id: "v4", name: "Toyota Camry", make: "Toyota", category: "saloon", year: 2021, seats: 5, ac: true, dailyRate: 2500, weeklyRate: 15000, driverAvailable: true, driverRate: 1000, available: true, owner: "Executive Hire Gambia", phone: "2206002001", location: "Banjul", features: ["A/C", "Leather Seats", "Navigation", "Rear Camera"], image: "🚘" },
  { id: "v5", name: "Honda Accord", make: "Honda", category: "saloon", year: 2020, seats: 5, ac: true, dailyRate: 2200, weeklyRate: 13000, driverAvailable: true, driverRate: 1000, available: true, owner: "GambiaRent Ltd", phone: "2206001001", location: "Serrekunda", features: ["A/C", "Heated Seats", "Sunroof", "CarPlay"], image: "🚘" },
  // SUV
  { id: "v6", name: "Toyota Land Cruiser", make: "Toyota", category: "suv", year: 2022, seats: 8, ac: true, dailyRate: 6500, weeklyRate: 40000, driverAvailable: true, driverRate: 1200, available: true, owner: "4×4 Gambia", phone: "2206003001", location: "Banjul", features: ["4WD", "A/C", "7 Seats", "Navigation", "Roof Rack"], image: "🚙" },
  { id: "v7", name: "Toyota Prado", make: "Toyota", category: "suv", year: 2021, seats: 7, ac: true, dailyRate: 5500, weeklyRate: 33000, driverAvailable: true, driverRate: 1200, available: true, owner: "4×4 Gambia", phone: "2206003001", location: "Brikama", features: ["4WD", "A/C", "Leather", "Dual A/C Zones"], image: "🚙" },
  { id: "v8", name: "Mitsubishi Pajero", make: "Mitsubishi", category: "suv", year: 2020, seats: 7, ac: true, dailyRate: 4800, weeklyRate: 28000, driverAvailable: true, driverRate: 1200, available: false, owner: "Upcountry Safaris Ltd", phone: "2206003002", location: "Farafenni", features: ["4WD", "A/C", "Towbar", "Bull Bar"], image: "🚙" },
  { id: "v9", name: "Hyundai Tucson", make: "Hyundai", category: "suv", year: 2022, seats: 5, ac: true, dailyRate: 3500, weeklyRate: 21000, driverAvailable: true, driverRate: 1000, available: true, owner: "Executive Hire Gambia", phone: "2206002001", location: "Kanifing", features: ["A/C", "AWD", "Panoramic Roof", "Carplay"], image: "🚙" },
  // Luxury
  { id: "v10", name: "Mercedes E-Class", make: "Mercedes", category: "luxury", year: 2023, seats: 5, ac: true, dailyRate: 9500, weeklyRate: 58000, driverAvailable: true, driverRate: 1500, available: true, owner: "VIP Wheels Gambia", phone: "2206004001", location: "Banjul", features: ["A/C", "Full Leather", "Massage Seats", "Ambient Lighting", "Champagne Cooler"], image: "🏎️" },
  { id: "v11", name: "BMW 5 Series", make: "BMW", category: "luxury", year: 2022, seats: 5, ac: true, dailyRate: 8500, weeklyRate: 52000, driverAvailable: true, driverRate: 1500, available: true, owner: "VIP Wheels Gambia", phone: "2206004001", location: "Banjul", features: ["A/C", "Leather", "HUD", "360° Camera"], image: "🏎️" },
  // Minibus
  { id: "v12", name: "Toyota Hiace (14 pax)", make: "Toyota", category: "minibus", year: 2020, seats: 14, ac: true, dailyRate: 5000, weeklyRate: 30000, driverAvailable: true, driverRate: 1000, available: true, owner: "Group Transport Gambia", phone: "2206005001", location: "Serrekunda", features: ["A/C", "Luggage Rack", "Driver Included Option"], image: "🚌" },
  { id: "v13", name: "Mercedes Sprinter (18 pax)", make: "Mercedes", category: "minibus", year: 2021, seats: 18, ac: true, dailyRate: 7000, weeklyRate: 42000, driverAvailable: true, driverRate: 1200, available: true, owner: "Group Transport Gambia", phone: "2206005001", location: "Kanifing", features: ["A/C", "Luggage Hold", "USB Charging Rows", "WiFi Hotspot"], image: "🚌" },
  { id: "v14", name: "Coaster Bus (30 pax)", make: "Toyota", category: "minibus", year: 2019, seats: 30, ac: true, dailyRate: 10000, weeklyRate: 62000, driverAvailable: true, driverRate: 1500, available: true, owner: "Gambia Bus Hire Ltd", phone: "2206005002", location: "Brikama", features: ["A/C", "Luggage Hold", "Reclining Seats", "Intercom System"], image: "🚌" },
  // Van
  { id: "v15", name: "Ford Transit (Cargo)", make: "Ford", category: "van", year: 2020, seats: 3, ac: true, dailyRate: 3200, weeklyRate: 19000, driverAvailable: true, driverRate: 1000, available: true, owner: "Cargo Van Gambia", phone: "2206006001", location: "Banjul Port", features: ["A/C", "4m Cargo Bay", "Roller Shutter", "GPS Tracked"], image: "🚐" },
  { id: "v16", name: "Mercedes Vito (7 pax)", make: "Mercedes", category: "van", year: 2022, seats: 7, ac: true, dailyRate: 3800, weeklyRate: 23000, driverAvailable: true, driverRate: 1000, available: true, owner: "Executive Hire Gambia", phone: "2206002001", location: "Serrekunda", features: ["A/C", "Captain Chairs", "Sliding Door", "Tinted Windows"], image: "🚐" },
];

// Fixed airport transfer rates (GMD)
const AIRPORT_TRANSFERS = [
  { destination: "Senegambia/Kololi Hotels", rate: 1500, distance: "15km" },
  { destination: "Kololi / Palma Rima", rate: 1200, distance: "12km" },
  { destination: "Serrekunda / Kanifing", rate: 800, distance: "8km" },
  { destination: "Banjul City Centre", rate: 600, distance: "5km" },
  { destination: "Barra Ferry Terminal", rate: 2000, distance: "45km via ferry" },
  { destination: "Brikama", rate: 2500, distance: "35km" },
  { destination: "Farafenni", rate: 8000, distance: "170km" },
  { destination: "Basse Santa Su", rate: 14000, distance: "380km" },
];

const CATS: { id: VehicleCat | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All Vehicles", icon: "🚗" },
  { id: "economy", label: "Economy", icon: "💰" },
  { id: "saloon", label: "Saloon", icon: "🚘" },
  { id: "suv", label: "SUV / 4×4", icon: "🚙" },
  { id: "luxury", label: "Luxury", icon: "🏎️" },
  { id: "minibus", label: "Minibus / Coach", icon: "🚌" },
  { id: "van", label: "Van", icon: "🚐" },
];

type Tab = "hire" | "airport";

export default function CarHirePage() {
  const { fmt } = useCurrency();
  const [tab, setTab] = useState<Tab>("hire");
  const [cat, setCat] = useState<VehicleCat | "all">("all");
  const [withDriver, setWithDriver] = useState(false);
  const [availOnly, setAvailOnly] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [days, setDays] = useState(1);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [renterPickup, setRenterPickup] = useState("");
  const [wantDriver, setWantDriver] = useState(false);
  const [bookSent, setBookSent] = useState(false);
  const [airportCars, setAirportCars] = useState(0); // airport tab: num cars
  const [airportTransfer, setAirportTransfer] = useState<typeof AIRPORT_TRANSFERS[0] | null>(null);
  const [airportFlight, setAirportFlight] = useState("");
  const [airportName, setAirportName] = useState("");
  const [airportPhone, setAirportPhone] = useState("");
  const [airportSent, setAirportSent] = useState(false);

  const filtered = VEHICLES.filter(v => {
    if (cat !== "all" && v.category !== cat) return false;
    if (availOnly && !v.available) return false;
    if (withDriver && !v.driverAvailable) return false;
    if (searchQ && !v.name.toLowerCase().includes(searchQ.toLowerCase()) && !v.make.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const totalCost = selected ? (selected.dailyRate * days) + (wantDriver ? selected.driverRate * days : 0) : 0;

  const page: React.CSSProperties = { background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
  const hero: React.CSSProperties = { background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, color: "#fff", padding: "60px 24px 48px", textAlign: "center" };
  const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 16px" };
  const tabRow: React.CSSProperties = { display: "flex", gap: 0, background: "#fff", borderBottom: "2px solid #E2E8F0" };
  const tabBtn = (a: boolean): React.CSSProperties => ({ flex: 1, padding: "16px", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, color: a ? G : MUT, borderBottom: `3px solid ${a ? G : "transparent"}`, transition: "all 0.2s" });
  const filterBar: React.CSSProperties = { background: "#fff", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 10 };
  const catRow: React.CSSProperties = { display: "flex", gap: 8, overflowX: "auto", padding: "14px 16px 0", maxWidth: 1200, margin: "0 auto" };
  const catBtn = (a: boolean): React.CSSProperties => ({ padding: "8px 16px", borderRadius: 24, border: `2px solid ${a ? G : "#E2E8F0"}`, background: a ? G : "#fff", color: a ? "#fff" : "#374151", cursor: "pointer", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" });
  const controlRow: React.CSSProperties = { display: "flex", gap: 12, padding: "12px 16px", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", alignItems: "center" };
  const searchInput: React.CSSProperties = { flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none" };
  const toggleBtn = (on: boolean): React.CSSProperties => ({ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${on ? G : "#E2E8F0"}`, background: on ? "#ECFDF5" : "#fff", color: on ? G : MUT, cursor: "pointer", fontSize: 13, fontWeight: 600 });
  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, padding: "24px 0" };
  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" };
  const badge = (color: string, bg: string): React.CSSProperties => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color, background: bg, marginRight: 4 });
  const btnGreen: React.CSSProperties = { flex: 1, padding: "10px", borderRadius: 8, background: G, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 };
  const btnWa: React.CSSProperties = { padding: "10px 14px", borderRadius: 8, background: "#25D366", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 };
  const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
  const modal: React.CSSProperties = { background: "#fff", borderRadius: 16, padding: 32, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 15, marginBottom: 14, boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: MUT, marginBottom: 4 };

  return (
    <div style={page}>
      {/* HERO */}
      <div style={hero}>
        <div style={container}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: -1 }}>Car Hire & Airport Transfers</h1>
          <p style={{ fontSize: 17, opacity: 0.85, maxWidth: 600, margin: "0 auto 16px" }}>
            Catalogue below is illustrative only. Live booking and transfer pay: <a href="/rides" style={{ color: GOLD }}>/rides</a>.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {["✈️ Airport Transfers", "👨‍✈️ Optional Driver", "🛡️ Fully Insured", "📱 Instant Booking"].map(b => (
              <div key={b} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 16px", fontSize: 14 }}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={tabRow}>
        <button style={tabBtn(tab === "hire")} onClick={() => setTab("hire")}>🚗 Self-Drive & Chauffeured Hire</button>
        <button style={tabBtn(tab === "airport")} onClick={() => setTab("airport")}>✈️ Airport Transfer</button>
      </div>

      {tab === "hire" && (
        <>
          {/* FILTER BAR */}
          <div style={filterBar}>
            <div style={catRow}>
              {CATS.map(c => (
                <button key={c.id} style={catBtn(cat === c.id)} onClick={() => setCat(c.id as VehicleCat | "all")}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <div style={controlRow}>
              <input style={searchInput} placeholder="Search make or model..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              <button style={toggleBtn(withDriver)} onClick={() => setWithDriver(!withDriver)}>👨‍✈️ Driver Available</button>
              <button style={toggleBtn(availOnly)} onClick={() => setAvailOnly(!availOnly)}>✅ Available Now</button>
            </div>
          </div>

          {/* VEHICLES GRID */}
          <div style={container}>
            <div style={{ padding: "20px 0 0" }}>
              <p style={{ color: MUT, fontSize: 14, margin: 0 }}>{filtered.length} vehicles available</p>
            </div>
            <div style={grid}>
              {filtered.map(v => (
                <div key={v.id} style={card}>
                  <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, padding: "20px 20px 16px", color: "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 40 }}>{v.image}</span>
                      <div style={{ textAlign: "right" }}>
                        <span style={badge(v.available ? "#065F46" : "#991B1B", v.available ? "#D1FAE5" : "#FEE2E2")}>
                          {v.available ? "Available" : "Booked"}
                        </span>
                        {v.driverAvailable && <span style={badge("#78350F", "#FEF3C7")}>👨‍✈️ Driver</span>}
                      </div>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: "10px 0 4px" }}>{v.name} ({v.year})</h3>
                    <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>
                      {v.seats} seats · {v.ac ? "A/C" : "No A/C"} · {v.category.toUpperCase()}
                    </p>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 12, color: MUT, marginBottom: 10 }}>📍 {v.location} · 🏢 {v.owner}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                      {v.features.map(f => <span key={f} style={{ background: "#F0F9FF", color: "#0369A1", border: "1px solid #BAE6FD", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{f}</span>)}
                    </div>
                    <div style={{ background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: G }}>{fmt(v.dailyRate)}<span style={{ fontSize: 12, color: MUT }}>/day</span></div>
                          <div style={{ fontSize: 12, color: MUT }}>Week: {fmt(v.weeklyRate)}</div>
                        </div>
                        {v.driverAvailable && (
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>+ Driver: {fmt(v.driverRate)}/day</div>
                            <div style={{ fontSize: 11, color: MUT }}>optional</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button style={{ ...btnGreen, opacity: v.available ? 1 : 0.5 }} disabled={!v.available} onClick={() => { setSelected(v); setBookSent(false); setWantDriver(false); }}>
                        {v.available ? "📋 Book Now" : "📅 Waitlist"}
                      </button>
                      <button style={btnWa} onClick={() => window.open(`https://wa.me/${v.phone}?text=${encodeURIComponent(`Hello, I'd like to hire the ${v.name} from ${v.owner}. Can you confirm availability?`)}`, "_blank")}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "airport" && (
        <div style={container}>
          <div style={{ padding: "32px 0" }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E2E8F0", padding: 28, marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 4 }}>✈️ Banjul International Airport Transfers</h2>
              <p style={{ color: MUT, fontSize: 14, marginBottom: 20 }}>Fixed-price transfers — no surge pricing, no surprises. Professional drivers, meet-and-greet service.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 24 }}>
                {AIRPORT_TRANSFERS.map(t => (
                  <button
                    key={t.destination}
                    onClick={() => { setAirportTransfer(t); setAirportSent(false); }}
                    style={{ background: airportTransfer?.destination === t.destination ? "#F0FDF4" : "#F8FAFC", border: `2px solid ${airportTransfer?.destination === t.destination ? G : "#E2E8F0"}`, borderRadius: 12, padding: 16, cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: NAVY, fontSize: 15, marginBottom: 4 }}>{t.destination}</div>
                        <div style={{ fontSize: 12, color: MUT }}>📍 {t.distance}</div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: G }}>{fmt(t.rate)}</div>
                    </div>
                  </button>
                ))}
              </div>

              {airportTransfer && !airportSent && (
                <div style={{ background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 12, padding: 24 }}>
                  <h3 style={{ color: NAVY, fontWeight: 800, marginBottom: 16 }}>Book Transfer to: {airportTransfer.destination}</h3>

                  <label style={labelStyle}>Passenger Name *</label>
                  <input style={inputStyle} placeholder="e.g. Ousman Jallow" value={airportName} onChange={e => setAirportName(e.target.value)} />

                  <label style={labelStyle}>Phone Number *</label>
                  <input style={inputStyle} placeholder="e.g. 220 XXX XXXX" value={airportPhone} onChange={e => setAirportPhone(e.target.value)} />

                  <label style={labelStyle}>Flight Number / Arrival Time *</label>
                  <input style={inputStyle} placeholder="e.g. TC 302 arriving 14:30" value={airportFlight} onChange={e => setAirportFlight(e.target.value)} />

                  <label style={labelStyle}>Number of Cars Needed</label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                    <button style={{ padding: "8px 14px", background: G, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }} onClick={() => setAirportCars(Math.max(1, airportCars - 1))}>−</button>
                    <span style={{ fontSize: 18, fontWeight: 700, color: NAVY, minWidth: 30, textAlign: "center" }}>{Math.max(1, airportCars)}</span>
                    <button style={{ padding: "8px 14px", background: G, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }} onClick={() => setAirportCars(airportCars + 1)}>+</button>
                    <span style={{ color: MUT, fontSize: 13 }}>Total: {fmt(airportTransfer.rate * Math.max(1, airportCars))}</span>
                  </div>

                  <button
                    style={{ width: "100%", padding: 14, background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: "pointer", opacity: (!airportName || !airportPhone || !airportFlight) ? 0.5 : 1 }}
                    disabled={!airportName || !airportPhone || !airportFlight}
                    onClick={() => setAirportSent(true)}
                  >
                    ✈️ Book Airport Transfer
                  </button>
                </div>
              )}

              {airportSent && airportTransfer && (
                <div style={{ background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 12, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3 style={{ color: G, fontWeight: 800, fontSize: 20 }}>Transfer Booked!</h3>
                  <p style={{ color: MUT }}>Your driver will meet you at arrivals hall with a name board for <strong>{airportName}</strong>. Contact: <strong>{airportPhone}</strong>.</p>
                  <p style={{ color: NAVY, fontWeight: 700 }}>To: {airportTransfer.destination} · {fmt(airportTransfer.rate * Math.max(1, airportCars))}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOOK MODAL */}
      {selected && (
        <div style={overlay} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={modal}>
            {bookSent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🚗</div>
                <h2 style={{ color: G, fontSize: 24, fontWeight: 800 }}>Booking Confirmed!</h2>
                <p style={{ color: MUT }}><strong>{selected.name}</strong> booked for {days} day(s). {selected.owner} will confirm with you at <strong>{renterPhone}</strong>.</p>
                <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 14, margin: "14px 0", textAlign: "left" }}>
                  <div style={{ fontSize: 14, color: MUT }}>Pickup: {renterPickup} · {pickupDate}</div>
                  <div style={{ fontSize: 14, color: MUT }}>Return: {returnDate}</div>
                  {wantDriver && <div style={{ fontSize: 14, color: MUT }}>Driver included</div>}
                  <div style={{ fontSize: 16, fontWeight: 800, color: G, marginTop: 6 }}>Total: {fmt(totalCost)}</div>
                </div>
                <button style={{ padding: "10px 28px", background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }} onClick={() => setSelected(null)}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>Book {selected.name}</h2>
                    <p style={{ color: MUT, fontSize: 13, margin: "4px 0 0" }}>{selected.owner} · {selected.location}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: MUT }}>×</button>
                </div>

                <label style={labelStyle}>Your Full Name *</label>
                <input style={inputStyle} placeholder="e.g. Aminata Camara" value={renterName} onChange={e => setRenterName(e.target.value)} />

                <label style={labelStyle}>Phone Number *</label>
                <input style={inputStyle} placeholder="e.g. 220 XXX XXXX" value={renterPhone} onChange={e => setRenterPhone(e.target.value)} />

                <label style={labelStyle}>Pickup Location *</label>
                <input style={inputStyle} placeholder="e.g. Senegambia Hotel or Banjul Airport" value={renterPickup} onChange={e => setRenterPickup(e.target.value)} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Pickup Date *</label>
                    <input type="date" style={inputStyle} value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Return Date *</label>
                    <input type="date" style={inputStyle} value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                  </div>
                </div>

                <label style={labelStyle}>Number of Days</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                  <button style={{ padding: "8px 14px", background: G, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }} onClick={() => setDays(Math.max(1, days - 1))}>−</button>
                  <span style={{ fontSize: 18, fontWeight: 700, color: NAVY, minWidth: 30, textAlign: "center" }}>{days}</span>
                  <button style={{ padding: "8px 14px", background: G, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }} onClick={() => setDays(days + 1)}>+</button>
                </div>

                {selected.driverAvailable && (
                  <div style={{ background: "#FEF3C7", borderRadius: 10, padding: 14, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#92400E" }}>👨‍✈️ Add Professional Driver?</div>
                      <div style={{ fontSize: 12, color: MUT }}>+{fmt(selected.driverRate)}/day</div>
                    </div>
                    <button
                      style={{ padding: "8px 16px", background: wantDriver ? GOLD : "#fff", border: `2px solid ${GOLD}`, borderRadius: 8, cursor: "pointer", fontWeight: 700, color: wantDriver ? NAVY : MUT }}
                      onClick={() => setWantDriver(!wantDriver)}
                    >
                      {wantDriver ? "✓ Added" : "Add Driver"}
                    </button>
                  </div>
                )}

                <div style={{ background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 10, padding: 14, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                    <span style={{ color: MUT }}>Vehicle ({days} days):</span>
                    <span style={{ fontWeight: 700 }}>{fmt(selected.dailyRate * days)}</span>
                  </div>
                  {wantDriver && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                      <span style={{ color: MUT }}>Driver ({days} days):</span>
                      <span style={{ fontWeight: 700 }}>{fmt(selected.driverRate * days)}</span>
                    </div>
                  )}
                  <div style={{ borderTop: "1.5px solid #D1FAE5", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                    <span style={{ fontWeight: 700, color: NAVY }}>Total:</span>
                    <span style={{ fontWeight: 800, color: G }}>{fmt(totalCost)}</span>
                  </div>
                </div>

                <button
                  style={{ width: "100%", padding: 14, background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: "pointer", opacity: (!renterName || !renterPhone || !renterPickup || !pickupDate || !returnDate) ? 0.5 : 1 }}
                  disabled={!renterName || !renterPhone || !renterPickup || !pickupDate || !returnDate}
                  onClick={() => { window.location.href = "/rides"; }}
                >
                  Continue on live booking →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
