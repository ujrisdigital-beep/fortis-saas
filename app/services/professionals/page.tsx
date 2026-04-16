"use client";
import { useState } from "react";
import { useCurrency } from "../../../hooks/useCurrency";

const G = "#1B4D3E";
const GOLD = "#D4AF37";
const NAVY = "#0A1C2E";
const MUT = "#64748B";

type ProCat = "engineering" | "architecture" | "legal" | "medical" | "ict" | "trades" | "finance" | "education";

interface Professional {
  id: string;
  name: string;
  title: string;
  category: ProCat;
  hourlyRate: number;
  dailyRate: number;
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  serviceAreas: string[];
  skills: string[];
  availability: "available" | "busy" | "by_appointment";
  verified: boolean;
  bio: string;
}

const PROFESSIONALS: Professional[] = [
  // Engineering
  { id: "p1", name: "Momodou Ceesay", title: "Civil & Structural Engineer", category: "engineering", hourlyRate: 1500, dailyRate: 9000, experience: 14, rating: 4.9, reviews: 42, location: "Banjul", phone: "2207001001", serviceAreas: ["Greater Banjul", "West Coast Region"], skills: ["Structural Design", "Foundation Engineering", "CAD/AutoCAD", "Roads & Bridges"], availability: "available", verified: true, bio: "MSc Civil Engineering (University of Ghana). 14 years on major infrastructure projects across The Gambia including Trans-Gambia Highway." },
  { id: "p2", name: "Fatou Jallow-Saho", title: "Electrical Engineer", category: "engineering", hourlyRate: 1200, dailyRate: 7500, experience: 9, rating: 4.8, reviews: 28, location: "Serrekunda", phone: "2207001002", serviceAreas: ["Greater Banjul", "North Bank"], skills: ["Power Systems", "Solar PV Design", "Industrial Wiring", "NAWEC Standards"], availability: "available", verified: true, bio: "BEng Electrical Engineering (UTG). Specialises in renewable energy systems and industrial electrical installations." },
  { id: "p3", name: "Alieu Ndow", title: "Mechanical Engineer", category: "engineering", hourlyRate: 1100, dailyRate: 7000, experience: 11, rating: 4.7, reviews: 31, location: "Kanifing", phone: "2207001003", serviceAreas: ["Greater Banjul", "West Coast Region", "Central River"], skills: ["HVAC Design", "Plant Maintenance", "Pump Systems", "AutoCAD Mechanical"], availability: "by_appointment", verified: true, bio: "Experienced mechanical engineer with expertise in HVAC and water pump systems for commercial buildings." },
  // Architecture
  { id: "p4", name: "Adama Bah", title: "Licensed Architect", category: "architecture", hourlyRate: 1800, dailyRate: 11000, experience: 16, rating: 5.0, reviews: 55, location: "Banjul", phone: "2207002001", serviceAreas: ["All Regions"], skills: ["Architectural Design", "3D Rendering", "Project Management", "Interior Design"], availability: "available", verified: true, bio: "Principal Architect at Bah & Associates. Licensed RIBA. Designed 30+ residential, commercial and government buildings across Gambia." },
  { id: "p5", name: "Isatou Touray-Darboe", title: "Urban Planner & Architect", category: "architecture", hourlyRate: 1600, dailyRate: 9500, experience: 12, rating: 4.9, reviews: 38, location: "Brikama", phone: "2207002002", serviceAreas: ["West Coast Region", "Greater Banjul"], skills: ["Master Planning", "Land Use Planning", "GIS Mapping", "Environmental Design"], availability: "available", verified: true, bio: "MSc Urban Planning (UCL London). Specialises in affordable housing and sustainable urban development in West Africa." },
  // Legal
  { id: "p6", name: "Lamin Sanneh, Esq.", title: "Commercial Lawyer", category: "legal", hourlyRate: 2500, dailyRate: 15000, experience: 20, rating: 4.8, reviews: 64, location: "Banjul", phone: "2207003001", serviceAreas: ["All Regions (Virtual Available)"], skills: ["Contract Law", "Company Incorporation", "Property Law", "Dispute Resolution"], availability: "available", verified: true, bio: "Senior Partner at Sanneh & Associates. Called to the Gambia Bar 2004. Specialist in commercial contracts, land law and company formation." },
  { id: "p7", name: "Mariama Baldeh", title: "Immigration & Employment Lawyer", category: "legal", hourlyRate: 2000, dailyRate: 12000, experience: 13, rating: 4.7, reviews: 47, location: "Serrekunda", phone: "2207003002", serviceAreas: ["All Regions (Virtual Available)"], skills: ["Immigration Law", "Employment Contracts", "Work Permits", "Business Visas"], availability: "by_appointment", verified: true, bio: "Specialises in immigration matters for businesses and individuals. Expert in ECOWAS free movement regulations." },
  // Medical
  { id: "p8", name: "Dr. Ousman Gaye", title: "General Practitioner", category: "medical", hourlyRate: 1800, dailyRate: 10000, experience: 15, rating: 5.0, reviews: 89, location: "Kanifing", phone: "2207004001", serviceAreas: ["Greater Banjul", "North Bank"], skills: ["Primary Care", "Corporate Health", "Occupational Health", "Telemedicine"], availability: "available", verified: true, bio: "MBBS (University of Gambia). 15 years in primary care. Provides corporate health packages and occupational health assessments." },
  { id: "p9", name: "Binta Kuyateh, RN", title: "Registered Nurse (Community Health)", category: "medical", hourlyRate: 800, dailyRate: 5000, experience: 8, rating: 4.9, reviews: 36, location: "Brikama", phone: "2207004002", serviceAreas: ["West Coast Region", "Greater Banjul"], skills: ["Wound Care", "Health Education", "Maternal Health", "Vaccination"], availability: "available", verified: true, bio: "Community health nurse with expertise in maternal and child health. Available for home visits, corporate screenings." },
  // ICT
  { id: "p10", name: "Kebba Drammeh", title: "Full-Stack Developer", category: "ict", hourlyRate: 1200, dailyRate: 7500, experience: 7, rating: 4.8, reviews: 29, location: "Serrekunda", phone: "2207005001", serviceAreas: ["All Regions (Remote Available)"], skills: ["React/Next.js", "Node.js", "PostgreSQL", "Mobile Apps (React Native)"], availability: "available", verified: true, bio: "BSc Computer Science (UTG). Builds web and mobile applications for SMEs. Experienced with payment integrations and e-commerce." },
  { id: "p11", name: "Ndey Fatty", title: "Cybersecurity Consultant", category: "ict", hourlyRate: 2000, dailyRate: 12000, experience: 10, rating: 4.9, reviews: 22, location: "Banjul", phone: "2207005002", serviceAreas: ["All Regions (Remote Available)"], skills: ["Penetration Testing", "Network Security", "ISO 27001", "GDPR Compliance"], availability: "by_appointment", verified: true, bio: "CISSP certified. Specialises in security audits for financial institutions, government agencies and SMEs." },
  // Trades
  { id: "p12", name: "Samba Bojang", title: "Master Plumber", category: "trades", hourlyRate: 600, dailyRate: 3800, experience: 18, rating: 4.7, reviews: 73, location: "Brikama", phone: "2207006001", serviceAreas: ["West Coast Region", "Greater Banjul"], skills: ["Plumbing Installation", "Borehole Systems", "Water Tank Installation", "Emergency Repairs"], availability: "available", verified: true, bio: "City & Guilds certified. 18 years of plumbing experience. Specialises in commercial and residential water systems." },
  { id: "p13", name: "Ebrima Colley", title: "Licensed Electrician", category: "trades", hourlyRate: 700, dailyRate: 4500, experience: 12, rating: 4.8, reviews: 58, location: "Kanifing", phone: "2207006002", serviceAreas: ["Greater Banjul", "West Coast Region"], skills: ["Wiring & Rewiring", "Solar Installations", "Electrical Inspections", "Generator Setup"], availability: "available", verified: true, bio: "City & Guilds Level 3 Electrical. Authorised NAWEC contractor. Expert in solar PV installations for homes and businesses." },
  { id: "p14", name: "Musa Jatta", title: "Welder & Fabricator", category: "trades", hourlyRate: 500, dailyRate: 3200, experience: 14, rating: 4.6, reviews: 44, location: "Banjul", phone: "2207006003", serviceAreas: ["Greater Banjul"], skills: ["MIG/TIG Welding", "Steel Fabrication", "Gates & Grilles", "Structural Metalwork"], availability: "available", verified: true, bio: "14 years fabricating gates, burglar proofing, steel structures and industrial equipment." },
  // Finance
  { id: "p15", name: "Sainabou Njie, ACCA", title: "Chartered Accountant", category: "finance", hourlyRate: 2000, dailyRate: 12000, experience: 16, rating: 4.9, reviews: 51, location: "Banjul", phone: "2207007001", serviceAreas: ["All Regions (Virtual Available)"], skills: ["Financial Statements", "Tax Compliance", "Audit", "Business Valuations"], availability: "available", verified: true, bio: "ACCA qualified. 16 years with Big 4 firms and now independent. Serves SMEs, NGOs and government contractors." },
  { id: "p16", name: "Baboucarr Camara", title: "Financial Advisor & Investment Consultant", category: "finance", hourlyRate: 2200, dailyRate: 13000, experience: 13, rating: 4.8, reviews: 34, location: "Serrekunda", phone: "2207007002", serviceAreas: ["All Regions (Virtual Available)"], skills: ["Investment Planning", "Business Plans", "Grant Writing", "Risk Analysis"], availability: "by_appointment", verified: true, bio: "Former GCBA analyst. Helps businesses structure investment proposals, write bankable business plans and access financing." },
  // Education
  { id: "p17", name: "Dr. Hawa Sanyang", title: "Educational Consultant", category: "education", hourlyRate: 1000, dailyRate: 6000, experience: 20, rating: 5.0, reviews: 67, location: "Banjul", phone: "2207008001", serviceAreas: ["All Regions"], skills: ["Curriculum Design", "Teacher Training", "School Management", "E-Learning"], availability: "available", verified: true, bio: "PhD Education (University of Edinburgh). Former MOBSE officer. Designs curricula and training programmes for schools and corporations." },
];

const CATS: { id: ProCat | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All Professionals", icon: "👥" },
  { id: "engineering", label: "Engineering", icon: "⚙️" },
  { id: "architecture", label: "Architecture", icon: "🏛️" },
  { id: "legal", label: "Legal", icon: "⚖️" },
  { id: "medical", label: "Medical & Health", icon: "🏥" },
  { id: "ict", label: "ICT", icon: "💻" },
  { id: "trades", label: "Skilled Trades", icon: "🔧" },
  { id: "finance", label: "Finance", icon: "📊" },
  { id: "education", label: "Education", icon: "🎓" },
];

const AVAIL_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: "Available Now", color: "#065F46", bg: "#D1FAE5" },
  busy: { label: "Currently Busy", color: "#92400E", bg: "#FEF3C7" },
  by_appointment: { label: "By Appointment", color: "#1D4ED8", bg: "#DBEAFE" },
};

export default function ProfessionalsPage() {
  const { fmt } = useCurrency();
  const [cat, setCat] = useState<ProCat | "all">("all");
  const [searchQ, setSearchQ] = useState("");
  const [availFilter, setAvailFilter] = useState<"all" | "available">("all");
  const [selected, setSelected] = useState<Professional | null>(null);
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookHours, setBookHours] = useState(2);
  const [bookProject, setBookProject] = useState("");
  const [bookSent, setBookSent] = useState(false);

  const filtered = PROFESSIONALS.filter(p => {
    if (cat !== "all" && p.category !== cat) return false;
    if (availFilter === "available" && p.availability !== "available") return false;
    if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase()) && !p.title.toLowerCase().includes(searchQ.toLowerCase()) && !p.skills.join(" ").toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const submitBook = () => {
    if (!selected || !bookName || !bookPhone || !bookDate || !bookProject) return;
    setBookSent(true);
  };

  const page: React.CSSProperties = { background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, sans-serif" };
  const hero: React.CSSProperties = { background: `linear-gradient(135deg, ${NAVY} 0%, ${G} 100%)`, color: "#fff", padding: "60px 24px 48px", textAlign: "center" };
  const heroTitle: React.CSSProperties = { fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: -1 };
  const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 16px" };
  const filterBar: React.CSSProperties = { background: "#fff", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 10 };
  const catRow: React.CSSProperties = { display: "flex", gap: 8, overflowX: "auto", padding: "14px 16px 0", maxWidth: 1200, margin: "0 auto" };
  const catBtn = (a: boolean): React.CSSProperties => ({ padding: "8px 16px", borderRadius: 24, border: `2px solid ${a ? G : "#E2E8F0"}`, background: a ? G : "#fff", color: a ? "#fff" : "#374151", cursor: "pointer", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" });
  const controlRow: React.CSSProperties = { display: "flex", gap: 12, padding: "12px 16px", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", alignItems: "center" };
  const searchInput: React.CSSProperties = { flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none" };
  const toggleBtn = (on: boolean): React.CSSProperties => ({ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${on ? G : "#E2E8F0"}`, background: on ? "#ECFDF5" : "#fff", color: on ? G : MUT, cursor: "pointer", fontSize: 13, fontWeight: 600 });
  const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20, padding: "24px 0" };
  const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1.5px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" };
  const badge = (color: string, bg: string): React.CSSProperties => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color, background: bg, marginRight: 4 });
  const btnGreen: React.CSSProperties = { flex: 1, padding: "10px", borderRadius: 8, background: G, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 };
  const btnWa: React.CSSProperties = { padding: "10px 14px", borderRadius: 8, background: "#25D366", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 };
  const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
  const modal: React.CSSProperties = { background: "#fff", borderRadius: 16, padding: 32, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 15, marginBottom: 14, boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: MUT, marginBottom: 4 };

  const stars = (r: number) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  return (
    <div style={page}>
      {/* HERO */}
      <div style={hero}>
        <div style={container}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <h1 style={heroTitle}>Professional Services</h1>
          <p style={{ fontSize: 17, opacity: 0.85, maxWidth: 600, margin: "0 auto 32px" }}>
            Verified engineers, architects, lawyers, doctors, ICT experts and skilled tradespeople across The Gambia
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {["✅ All Verified", "⭐ Rated & Reviewed", "💰 Transparent Pricing", "📅 Flexible Booking"].map(b => (
              <div key={b} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 16px", fontSize: 14 }}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div style={filterBar}>
        <div style={catRow}>
          {CATS.map(c => (
            <button key={c.id} style={catBtn(cat === c.id)} onClick={() => setCat(c.id as ProCat | "all")}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <div style={controlRow}>
          <input style={searchInput} placeholder="Search name, title, skills..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          <button style={toggleBtn(availFilter === "available")} onClick={() => setAvailFilter(availFilter === "available" ? "all" : "available")}>
            ✅ Available Now Only
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div style={container}>
        <div style={{ padding: "20px 0 0" }}>
          <p style={{ color: MUT, fontSize: 14, margin: 0 }}>{filtered.length} professionals found</p>
        </div>

        <div style={grid}>
          {filtered.map(pro => {
            const av = AVAIL_LABEL[pro.availability];
            return (
              <div key={pro.id} style={card}>
                {/* Card Header */}
                <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${G}, ${NAVY})`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
                      {pro.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: 16, color: NAVY }}>{pro.name}</span>
                        {pro.verified && <span style={badge("#065F46", "#D1FAE5")}>✓ Verified</span>}
                      </div>
                      <div style={{ fontSize: 13, color: G, fontWeight: 600, margin: "2px 0" }}>{pro.title}</div>
                      <div style={{ fontSize: 12, color: MUT }}>📍 {pro.location} · {pro.experience} yrs exp</div>
                    </div>
                    <span style={badge(av.color, av.bg)}>{av.label}</span>
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  {/* Rating */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                    <span style={{ color: GOLD, fontSize: 14 }}>{stars(pro.rating)}</span>
                    <span style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>{pro.rating}</span>
                    <span style={{ color: MUT, fontSize: 12 }}>({pro.reviews} reviews)</span>
                  </div>

                  {/* Bio */}
                  <p style={{ fontSize: 13, color: MUT, margin: "0 0 12px", lineHeight: 1.5 }}>{pro.bio}</p>

                  {/* Skills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {pro.skills.map(s => (
                      <span key={s} style={{ background: "#F0F9FF", color: "#0369A1", border: "1px solid #BAE6FD", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>

                  {/* Service Areas */}
                  <div style={{ fontSize: 12, color: MUT, marginBottom: 14 }}>
                    🗺️ Serves: {pro.serviceAreas.join(" · ")}
                  </div>

                  {/* Rates */}
                  <div style={{ background: "#F0FDF4", border: `1.5px solid ${G}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: G }}>{fmt(pro.hourlyRate)}</div>
                      <div style={{ fontSize: 11, color: MUT }}>per hour</div>
                    </div>
                    <div style={{ width: 1, background: "#D1FAE5" }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: G }}>{fmt(pro.dailyRate)}</div>
                      <div style={{ fontSize: 11, color: MUT }}>per day (8h)</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={btnGreen} onClick={() => { setSelected(pro); setBookSent(false); }}>
                      📅 Book Now
                    </button>
                    <button
                      style={btnWa}
                      onClick={() => window.open(`https://wa.me/${pro.phone}?text=${encodeURIComponent(`Hello ${pro.name}, I found your profile on FORTIS OS. I'd like to discuss a project with you.`)}`, "_blank")}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: MUT }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No professionals found</p>
            <p style={{ fontSize: 14 }}>Try different keywords or category filters</p>
          </div>
        )}

        {/* JOIN CTA */}
        <div style={{ background: `linear-gradient(135deg, ${G} 0%, ${NAVY} 100%)`, borderRadius: 16, padding: 32, marginBottom: 40, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Are You a Professional? Join the Network</h3>
            <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>Get verified, showcase your expertise, and connect with clients across The Gambia.</p>
          </div>
          <button
            style={{ padding: "12px 28px", background: GOLD, color: NAVY, border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: "pointer" }}
            onClick={() => window.open("https://wa.me/2203000001?text=Hello%2C%20I%20am%20a%20professional%20and%20I%20want%20to%20list%20my%20services%20on%20FORTIS%20OS", "_blank")}
          >
            Apply to Join →
          </button>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {selected && (
        <div style={overlay} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={modal}>
            {bookSent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
                <h2 style={{ color: G, fontSize: 24, fontWeight: 800 }}>Booking Request Sent!</h2>
                <p style={{ color: MUT, fontSize: 15 }}>
                  Your request has been sent to <strong>{selected.name}</strong>. They will contact you at <strong>{bookPhone}</strong> within 4 hours to confirm.
                </p>
                <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 16, margin: "16px 0", textAlign: "left" }}>
                  <div style={{ fontWeight: 700, color: NAVY, marginBottom: 8 }}>Booking Summary</div>
                  <div style={{ fontSize: 14, color: MUT }}>Professional: {selected.name}</div>
                  <div style={{ fontSize: 14, color: MUT }}>Date: {bookDate}</div>
                  <div style={{ fontSize: 14, color: MUT }}>Duration: {bookHours} hour(s)</div>
                  <div style={{ fontSize: 14, color: MUT }}>Estimated Cost: {fmt(selected.hourlyRate * bookHours)}</div>
                </div>
                <button style={{ padding: "10px 28px", background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }} onClick={() => setSelected(null)}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>Book {selected.name}</h2>
                    <p style={{ color: G, fontSize: 13, fontWeight: 600, margin: "4px 0 0" }}>{selected.title}</p>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: MUT }}>×</button>
                </div>

                <label style={labelStyle}>Your Full Name *</label>
                <input style={inputStyle} placeholder="e.g. Aminata Drammeh" value={bookName} onChange={e => setBookName(e.target.value)} />

                <label style={labelStyle}>Phone Number *</label>
                <input style={inputStyle} placeholder="e.g. 220 XXX XXXX" value={bookPhone} onChange={e => setBookPhone(e.target.value)} />

                <label style={labelStyle}>Preferred Date *</label>
                <input type="date" style={inputStyle} value={bookDate} onChange={e => setBookDate(e.target.value)} />

                <label style={labelStyle}>Number of Hours</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                  <button style={{ padding: "8px 14px", background: G, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }} onClick={() => setBookHours(Math.max(1, bookHours - 1))}>−</button>
                  <span style={{ fontSize: 18, fontWeight: 700, color: NAVY, minWidth: 30, textAlign: "center" }}>{bookHours}</span>
                  <button style={{ padding: "8px 14px", background: G, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }} onClick={() => setBookHours(bookHours + 1)}>+</button>
                  <span style={{ color: MUT, fontSize: 13 }}>hours · {fmt(selected.hourlyRate * bookHours)} total</span>
                </div>

                <label style={labelStyle}>Describe Your Project / Requirements *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  placeholder="e.g. I need structural engineering advice for a 3-storey residential building in Brikama..."
                  value={bookProject}
                  onChange={e => setBookProject(e.target.value)}
                />

                <button
                  style={{ width: "100%", padding: 14, background: G, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: "pointer", opacity: (!bookName || !bookPhone || !bookDate || !bookProject) ? 0.5 : 1 }}
                  onClick={submitBook}
                  disabled={!bookName || !bookPhone || !bookDate || !bookProject}
                >
                  📅 Send Booking Request
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
