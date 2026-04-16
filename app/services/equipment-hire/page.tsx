"use client";
import { useState, useCallback } from "react";
import { useLang } from "../../../hooks/useLang";
import { useCurrency } from "../../../hooks/useCurrency";

const G = "#1B4D3E";
const GOLD = "#D4AF37";
const NAVY = "#0A1C2E";
const MUT = "#64748B";

type Category = "construction" | "transport" | "power" | "agricultural" | "events";

interface Equipment {
  id: string;
  name: string;
  category: Category;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  deposit: number;
  operator: boolean;
  available: boolean;
  owner: string;
  phone: string;
  location: string;
  specs: string;
  image: string;
}

const EQUIPMENT: Equipment[] = [
  // Construction
  { id: "eq1", name: "Excavator (20T)", category: "construction", dailyRate: 8500, weeklyRate: 52000, monthlyRate: 180000, deposit: 25000, operator: true, available: true, owner: "Gambia Heavy Equipment Ltd", phone: "2203001001", location: "Kanifing", specs: "20-tonne, 1.2m³ bucket, GPS-tracked", image: "🚜" },
  { id: "eq2", name: "Bulldozer D6", category: "construction", dailyRate: 9500, weeklyRate: 60000, monthlyRate: 210000, deposit: 30000, operator: true, available: true, owner: "West Africa Plant Hire", phone: "2203001002", location: "Brikama", specs: "CAT D6, 6-way blade, ROPS cab", image: "🚧" },
  { id: "eq3", name: "Tower Crane (50T)", category: "construction", dailyRate: 18000, weeklyRate: 110000, monthlyRate: 380000, deposit: 60000, operator: true, available: false, owner: "Gambia Heavy Equipment Ltd", phone: "2203001001", location: "Serekunda", specs: "50T capacity, 60m jib, certified operator", image: "🏗️" },
  { id: "eq4", name: "Mobile Crane (25T)", category: "construction", dailyRate: 12000, weeklyRate: 75000, monthlyRate: 260000, deposit: 40000, operator: true, available: true, owner: "Atlantic Cranes Ltd", phone: "2203001003", location: "Banjul", specs: "25T, 360° slew, 30m boom", image: "🏗️" },
  { id: "eq5", name: "Concrete Mixer (500L)", category: "construction", dailyRate: 2500, weeklyRate: 14000, monthlyRate: 48000, deposit: 8000, operator: false, available: true, owner: "BuildRight Gambia", phone: "2203001004", location: "Serrekunda", specs: "500L drum, diesel, tow-behind", image: "⚙️" },
  { id: "eq6", name: "Scaffolding Set (500m²)", category: "construction", dailyRate: 3500, weeklyRate: 20000, monthlyRate: 70000, deposit: 12000, operator: false, available: true, owner: "Safe Build Ltd", phone: "2203001005", location: "Kanifing", specs: "500m² tube & coupler, boards included", image: "🔩" },
  { id: "eq7", name: "Vibrating Compactor", category: "construction", dailyRate: 1800, weeklyRate: 10000, monthlyRate: 35000, deposit: 5000, operator: false, available: true, owner: "BuildRight Gambia", phone: "2203001004", location: "Brikama", specs: "Plate 60cm × 90cm, 15kN force", image: "⚙️" },
  // Transport
  { id: "eq8", name: "Flatbed Truck (20T)", category: "transport", dailyRate: 7000, weeklyRate: 42000, monthlyRate: 145000, deposit: 20000, operator: true, available: true, owner: "Trans-Gambia Logistics", phone: "2203002001", location: "Serekunda", specs: "20T GVW, 8m flat, drop-sides", image: "🚛" },
  { id: "eq9", name: "Refrigerated Truck (10T)", category: "transport", dailyRate: 9000, weeklyRate: 55000, monthlyRate: 190000, deposit: 28000, operator: true, available: true, owner: "ColdChain Gambia Ltd", phone: "2203002002", location: "Banjul Port", specs: "-20°C to +5°C, 10T payload, ATP certified", image: "🧊" },
  { id: "eq10", name: "Tipper Truck (15T)", category: "transport", dailyRate: 6500, weeklyRate: 38000, monthlyRate: 130000, deposit: 18000, operator: true, available: true, owner: "Gambia Earthworks", phone: "2203002003", location: "Brikama", specs: "15T, hydraulic rear-tip, 6m body", image: "🚛" },
  { id: "eq11", name: "Forklift (3T)", category: "transport", dailyRate: 4500, weeklyRate: 26000, monthlyRate: 90000, deposit: 14000, operator: false, available: true, owner: "Warehouse Pro Ltd", phone: "2203002004", location: "Kanifing Industrial", specs: "3T, 4.5m lift, LPG powered", image: "🏭" },
  { id: "eq12", name: "Cargo Van (2T)", category: "transport", dailyRate: 2200, weeklyRate: 12000, monthlyRate: 40000, deposit: 6000, operator: false, available: true, owner: "Trans-Gambia Logistics", phone: "2203002001", location: "Serekunda", specs: "2T payload, 10m³, sliding door", image: "🚐" },
  // Power
  { id: "eq13", name: "Generator 100KVA", category: "power", dailyRate: 5500, weeklyRate: 33000, monthlyRate: 115000, deposit: 16000, operator: false, available: true, owner: "PowerRent Gambia", phone: "2203003001", location: "Serekunda", specs: "100KVA, silent type, auto-start, fuel not included", image: "⚡" },
  { id: "eq14", name: "Generator 250KVA", category: "power", dailyRate: 11000, weeklyRate: 66000, monthlyRate: 230000, deposit: 35000, operator: false, available: true, owner: "PowerRent Gambia", phone: "2203003001", location: "Kanifing", specs: "250KVA, containerised, 72hr tank", image: "⚡" },
  { id: "eq15", name: "Solar+Battery Pack (20KW)", category: "power", dailyRate: 3800, weeklyRate: 22000, monthlyRate: 75000, deposit: 10000, operator: false, available: true, owner: "SolarRent Ltd", phone: "2203003002", location: "Brikama", specs: "20KW panels + 40KWh LiFePO4 battery", image: "☀️" },
  { id: "eq16", name: "Welding Machine Set", category: "power", dailyRate: 1200, weeklyRate: 6500, monthlyRate: 22000, deposit: 3500, operator: false, available: true, owner: "TechRent Gambia", phone: "2203003003", location: "Serekunda", specs: "MIG/MMA 400A inverter, cables & mask", image: "🔧" },
  // Agricultural
  { id: "eq17", name: "Tractor 80HP + Plough", category: "agricultural", dailyRate: 5000, weeklyRate: 30000, monthlyRate: 105000, deposit: 15000, operator: true, available: true, owner: "Gambia Agri-Hire", phone: "2203004001", location: "Basse", specs: "80HP 4WD, 3-disc plough included", image: "🚜" },
  { id: "eq18", name: "Rice Harvester Combine", category: "agricultural", dailyRate: 12000, weeklyRate: 72000, monthlyRate: 250000, deposit: 38000, operator: true, available: true, owner: "Gambia Agri-Hire", phone: "2203004001", location: "Farafenni", specs: "2.5m cut, 10T/hr, GPS yield monitor", image: "🌾" },
  { id: "eq19", name: "Irrigation Pump (50m³/hr)", category: "agricultural", dailyRate: 2000, weeklyRate: 11000, monthlyRate: 38000, deposit: 6000, operator: false, available: true, owner: "WaterWorks Gambia", phone: "2203004002", location: "Basse", specs: "50m³/hr, 6 bar, diesel, hose kit", image: "💧" },
  // Events
  { id: "eq20", name: "PA System (5000W)", category: "events", dailyRate: 4500, weeklyRate: 25000, monthlyRate: 88000, deposit: 12000, operator: true, available: true, owner: "Sound Pro Gambia", phone: "2203005001", location: "Serekunda", specs: "5KW line array, 4 subs, wireless mics ×4", image: "🎵" },
  { id: "eq21", name: "Generator + Lighting Rig", category: "events", dailyRate: 5500, weeklyRate: 32000, monthlyRate: 110000, deposit: 16000, operator: true, available: true, owner: "Events Tech Ltd", phone: "2203005002", location: "Banjul", specs: "50KVA gen + 80-head LED rig, truss 12m", image: "💡" },
  { id: "eq22", name: "Marquee Tent (200 pax)", category: "events", dailyRate: 6000, weeklyRate: 36000, monthlyRate: 125000, deposit: 18000, operator: true, available: true, owner: "EventSpace Gambia", phone: "2203005003", location: "Kanifing", specs: "20×10m PVC, flooring, linings, setup included", image: "⛺" },
  { id: "eq23", name: "Stage Platform (8m × 6m)", category: "events", dailyRate: 7500, weeklyRate: 44000, monthlyRate: 155000, deposit: 22000, operator: true, available: true, owner: "Stage Pro Ltd", phone: "2203005004", location: "Serekunda", specs: "8×6m aluminium stage, 1.2m high, barrier", image: "🎪" },
];

const CATS: { id: Category | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All Equipment", icon: "🏭" },
  { id: "construction", label: "Construction", icon: "🏗️" },
  { id: "transport", label: "Transport", icon: "🚛" },
  { id: "power", label: "Power & Energy", icon: "⚡" },
  { id: "agricultural", label: "Agricultural", icon: "🌾" },
  { id: "events", label: "Events & Media", icon: "🎵" },
];

type Period = "daily" | "weekly" | "monthly";

export default function EquipmentHirePage() {
  const { t } = useLang();
  const { fmt } = useCurrency();
  const [cat, setCat] = useState<Category | "all">("all");
  const [period, setPeriod] = useState<Period>("daily");
  const [searchQ, setSearchQ] = useState("");
  const [operatorOnly, setOperatorOnly] = useState(false);
  const [availOnly, setAvailOnly] = useState(false);
  const [enquiry, setEnquiry] = useState<Equipment | null>(null);
  const [days, setDays] = useState(1);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquiryDate, setEnquiryDate] = useState("");
  const [enquirySent, setEnquirySent] = useState(false);

  const rate = useCallback((eq: Equipment) => {
    if (period === "daily") return eq.dailyRate;
    if (period === "weekly") return eq.weeklyRate;
    return eq.monthlyRate;
  }, [period]);

  const periodLabel = period === "daily" ? "day" : period === "weekly" ? "week" : "month";

  const filtered = EQUIPMENT.filter(e => {
    if (cat !== "all" && e.category !== cat) return false;
    if (operatorOnly && !e.operator) return false;
    if (availOnly && !e.available) return false;
    if (searchQ && !e.name.toLowerCase().includes(searchQ.toLowerCase()) && !e.specs.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const handleBook = (eq: Equipment) => {
    setEnquiry(eq);
    setEnquirySent(false);
    setDays(period === "daily" ? 1 : period === "weekly" ? 7 : 30);
  };

  const handleWhatsApp = (eq: Equipment) => {
    const msg = encodeURIComponent(`Hello, I'd like to hire: ${eq.name}\nOwner: ${eq.owner}\nRate: ${fmt(rate(eq))}/${periodLabel}\nSpecs: ${eq.specs}\n\nPlease advise availability.`);
    window.open(`https://wa.me/${eq.phone}?text=${msg}`, "_blank");
  };

  const submitEnquiry = () => {
    if (!enquiry || !enquiryName || !enquiryPhone || !enquiryDate) return;
    setEnquirySent(true);
  };

  const totalCost = enquiry ? enquiry.dailyRate * days : 0;

  // styles
  const page: React.CSSProperties = { background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
  const hero: React.CSSProperties = { background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, color: "#fff", padding: "60px 24px 48px", textAlign: "center" };
  const heroTitle: React.CSSProperties = { fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: -1 };
  const heroSub: React.CSSProperties = { fontSize: 17, opacity: 0.85, maxWidth: 600, margin: "0 auto 32px" };
  const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 16px" };
  const filterBar: React.CSSProperties = { background: "#fff", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 10 };
  const catRow: React.CSSProperties = { display: "flex", gap: 8, overflowX: "auto", padding: "14px 16px 0", maxWidth: 1200, margin: "0 auto" };
  const controlRow: React.CSSProperties = { display: "flex", gap: 12, padding: "12px 16px", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", alignItems: "center" };
  const catBtn = (active: boolean): React.CSSProperties => ({ padding: "8px 16px", borderRadius: 24, border: `2px solid ${active ? G : "#E2E8F0"}`, background: active ? G : "#fff", color: active ? "#fff" : "#374151", cursor: "pointer", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", transition: "all 0.2s" });
  const searchInput: React.CSSProperties = { flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none" };
  const periodBtn = (active: boolean): React.CSSProperties => ({ padding: "8px 18px", borderRadius: 8, border: `2px solid ${active ? GOLD : "#E2E8F0"}`, background: active ? GOLD : "#fff", color: active ? NAVY : "#374151", cursor: "pointer", fontWeight: 700, fontSize: 13 });
  const toggleBtn = (on: boolean): React.CSSProperties => ({ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${on ? G : "#E2E8F0"}`, background: on ? "#ECFDF5" : "#fff", color: on ? G : MUT, cursor: "pointer", fontSize: 13, fontWeight: 600 });
  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, padding: "24px 0" };
  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" };
  const cardHead: React.CSSProperties = { background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, padding: "20px 20px 16px", color: "#fff" };
  const cardBody: React.CSSProperties = { padding: 20 };
  const badge = (color: string, bg: string): React.CSSProperties => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color, background: bg, marginRight: 6 });
  const rateBox: React.CSSProperties = { background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 10, padding: "12px 16px", marginBottom: 14 };
  const actionRow: React.CSSProperties = { display: "flex", gap: 10 };
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
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏭</div>
          <h1 style={heroTitle}>Equipment Hire Marketplace</h1>
          <p style={heroSub}>Construction machinery, transport vehicles, power solutions & event equipment — all across The Gambia</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "✅", label: "Vetted Operators" },
              { icon: "📋", label: "Insured Fleet" },
              { icon: "🔧", label: "Maintenance Included" },
              { icon: "📞", label: "24/7 Support" },
            ].map(b => (
              <div key={b.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 16px", fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}>
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={filterBar}>
        <div style={catRow}>
          {CATS.map(c => (
            <button key={c.id} style={catBtn(cat === c.id)} onClick={() => setCat(c.id as Category | "all")}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <div style={controlRow}>
          <input style={searchInput} placeholder="Search equipment, specs..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          <div style={{ display: "flex", gap: 6 }}>
            {(["daily", "weekly", "monthly"] as Period[]).map(p => (
              <button key={p} style={periodBtn(period === p)} onClick={() => setPeriod(p)}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
            ))}
          </div>
          <button style={toggleBtn(operatorOnly)} onClick={() => setOperatorOnly(!operatorOnly)}>👷 With Operator</button>
          <button style={toggleBtn(availOnly)} onClick={() => setAvailOnly(!availOnly)}>✅ Available Now</button>
        </div>
      </div>

      {/* RESULTS */}
      <div style={container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 0" }}>
          <p style={{ color: MUT, fontSize: 14, margin: 0 }}>{filtered.length} equipment listed · Showing {period} rates</p>
          <p style={{ color: MUT, fontSize: 13, margin: 0 }}>Prices in {fmt(0).replace("0.00", "").replace("0", "").trim()} · All quotes inclusive of VAT</p>
        </div>

        <div style={grid}>
          {filtered.map(eq => (
            <div key={eq.id} style={card}>
              <div style={cardHead}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 36 }}>{eq.image}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={badge(eq.available ? "#065F46" : "#991B1B", eq.available ? "#D1FAE5" : "#FEE2E2")}>
                      {eq.available ? "Available" : "Booked"}
                    </span>
                    {eq.operator && <span style={badge("#78350F", "#FEF3C7")}>👷 Operator</span>}
                  </div>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "10px 0 4px" }}>{eq.name}</h3>
                <p style={{ fontSize: 13, opacity: 0.8, margin: 0 }}>{eq.specs}</p>
              </div>
              <div style={cardBody}>
                <div style={{ fontSize: 12, color: MUT, marginBottom: 10 }}>
                  📍 {eq.location} &nbsp;|&nbsp; 🏢 {eq.owner}
                </div>
                <div style={rateBox}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: G }}>{fmt(rate(eq))}</div>
                      <div style={{ fontSize: 12, color: MUT }}>per {periodLabel} · deposit: {fmt(eq.deposit)}</div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12, color: MUT }}>
                      <div>Day: {fmt(eq.dailyRate)}</div>
                      <div>Week: {fmt(eq.weeklyRate)}</div>
                      <div>Month: {fmt(eq.monthlyRate)}</div>
                    </div>
                  </div>
                </div>
                <div style={actionRow}>
                  <button style={{ ...btnGreen, opacity: eq.available ? 1 : 0.5 }} onClick={() => eq.available && handleBook(eq)} disabled={!eq.available}>
                    {eq.available ? "📋 Get Quote" : "📅 Join Waitlist"}
                  </button>
                  <button style={btnWa} onClick={() => handleWhatsApp(eq)} title="WhatsApp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: MUT }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No equipment found</p>
            <p style={{ fontSize: 14 }}>Try adjusting your filters or search term</p>
          </div>
        )}

        {/* HOW IT WORKS */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E2E8F0", padding: 32, margin: "32px 0" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 24, textAlign: "center" }}>How Equipment Hire Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { step: "1", icon: "🔍", title: "Find & Quote", desc: "Browse by category, filter by availability and get a customised quote" },
              { step: "2", icon: "📋", title: "Book & Confirm", desc: "Submit booking form, pay deposit via Wave/Afrimoney/Bank" },
              { step: "3", icon: "🚚", title: "Delivery & Setup", desc: "Equipment delivered to site — operator arrives same time if booked" },
              { step: "4", icon: "✅", title: "Use & Return", desc: "Use as agreed. Return or extend. Deposit refunded on inspection" },
            ].map(s => (
              <div key={s.step} style={{ textAlign: "center", padding: 16 }}>
                <div style={{ width: 40, height: 40, background: G, color: "#fff", borderRadius: "50%", fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{s.step}</div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: MUT }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LIST YOUR EQUIPMENT */}
        <div style={{ background: `linear-gradient(135deg, ${G} 0%, ${NAVY} 100%)`, borderRadius: 16, padding: 32, marginBottom: 40, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Own Equipment? List It Free</h3>
            <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>Earn income from idle machinery. Verified listings, insured hires, payments secured.</p>
          </div>
          <button
            style={{ padding: "12px 28px", background: GOLD, color: NAVY, border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: "pointer" }}
            onClick={() => window.open("https://wa.me/2203000001?text=Hello%2C%20I%20want%20to%20list%20my%20equipment%20on%20FORTIS%20OS", "_blank")}
          >
            List My Equipment →
          </button>
        </div>
      </div>

      {/* ENQUIRY MODAL */}
      {enquiry && (
        <div style={overlay} onClick={e => e.target === e.currentTarget && setEnquiry(null)}>
          <div style={modal}>
            {enquirySent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h2 style={{ color: G, fontSize: 24, fontWeight: 800 }}>Enquiry Sent!</h2>
                <p style={{ color: MUT, fontSize: 15 }}>
                  Your booking request for <strong>{enquiry.name}</strong> has been sent to <strong>{enquiry.owner}</strong>.
                  They will contact you at <strong>{enquiryPhone}</strong> within 2 hours.
                </p>
                <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 16, margin: "16px 0", textAlign: "left" }}>
                  <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8 }}>Booking Summary</div>
                  <div style={{ fontSize: 14, color: MUT }}>Equipment: {enquiry.name}</div>
                  <div style={{ fontSize: 14, color: MUT }}>Duration: {days} day(s)</div>
                  <div style={{ fontSize: 14, color: MUT }}>Estimated Cost: {fmt(totalCost)}</div>
                  <div style={{ fontSize: 14, color: MUT }}>Deposit Required: {fmt(enquiry.deposit)}</div>
                  <div style={{ fontSize: 14, color: MUT }}>Start Date: {enquiryDate}</div>
                </div>
                <button style={{ ...btnGreen, maxWidth: 200 }} onClick={() => setEnquiry(null)}>Close</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>{enquiry.name}</h2>
                    <p style={{ color: MUT, fontSize: 13, margin: "4px 0 0" }}>{enquiry.owner} · {enquiry.location}</p>
                  </div>
                  <button onClick={() => setEnquiry(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: MUT }}>×</button>
                </div>

                <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 13, color: MUT }}>
                  <strong style={{ color: NAVY }}>Specs:</strong> {enquiry.specs}
                </div>

                <label style={labelStyle}>Your Full Name *</label>
                <input style={inputStyle} placeholder="e.g. Ousman Jallow" value={enquiryName} onChange={e => setEnquiryName(e.target.value)} />

                <label style={labelStyle}>Phone Number *</label>
                <input style={inputStyle} placeholder="e.g. 220 XXX XXXX" value={enquiryPhone} onChange={e => setEnquiryPhone(e.target.value)} />

                <label style={labelStyle}>Required Start Date *</label>
                <input type="date" style={inputStyle} value={enquiryDate} onChange={e => setEnquiryDate(e.target.value)} />

                <label style={labelStyle}>Number of Days</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                  <button style={{ ...btnGreen, maxWidth: 36, padding: "8px" }} onClick={() => setDays(Math.max(1, days - 1))}>−</button>
                  <span style={{ fontSize: 18, fontWeight: 700, color: NAVY, minWidth: 30, textAlign: "center" }}>{days}</span>
                  <button style={{ ...btnGreen, maxWidth: 36, padding: "8px" }} onClick={() => setDays(days + 1)}>+</button>
                  <span style={{ color: MUT, fontSize: 13 }}>days</span>
                </div>

                <div style={{ background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 10, padding: 14, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                    <span style={{ color: MUT }}>Daily Rate:</span>
                    <span style={{ fontWeight: 700 }}>{fmt(enquiry.dailyRate)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                    <span style={{ color: MUT }}>Duration:</span>
                    <span style={{ fontWeight: 700 }}>{days} day(s)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                    <span style={{ color: MUT }}>Refundable Deposit:</span>
                    <span style={{ fontWeight: 700 }}>{fmt(enquiry.deposit)}</span>
                  </div>
                  <div style={{ borderTop: "1.5px solid #D1FAE5", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                    <span style={{ fontWeight: 700, color: NAVY }}>Estimated Total:</span>
                    <span style={{ fontWeight: 800, color: G }}>{fmt(totalCost + enquiry.deposit)}</span>
                  </div>
                  <p style={{ fontSize: 11, color: MUT, margin: "6px 0 0" }}>Deposit fully refunded after equipment returned in good condition</p>
                </div>

                <button
                  style={{ ...btnGreen, width: "100%", padding: "14px", fontSize: 16, opacity: (!enquiryName || !enquiryPhone || !enquiryDate) ? 0.5 : 1 }}
                  onClick={submitEnquiry}
                  disabled={!enquiryName || !enquiryPhone || !enquiryDate}
                >
                  📋 Submit Booking Enquiry
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
