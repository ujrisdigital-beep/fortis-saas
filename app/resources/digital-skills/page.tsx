// app/resources/digital-skills/page.tsx

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const PROGRAMMES = [
  {
    name: "Smart Africa Digital Academy (SADA)",
    type: "Government / AU",
    focus: "Cloud, AI, Data Science, Cybersecurity",
    cost: "Free",
    audience: "All adults",
    link: "https://sada.smartafrica.org",
    color: "#1D4ED8",
    desc: "Continental platform offering online certifications in high-demand digital skills. Backed by African Union and Smart Africa Alliance.",
  },
  {
    name: "FORTIS OS Digital Skills Hub",
    type: "Private Platform",
    focus: "Banking, Telecom, Agriculture, Energy, Government, SME",
    cost: "Free",
    audience: "All sectors",
    link: "/training/hub",
    color: PRIMARY,
    desc: "Gambia's AI-powered national training platform with industry simulations, blockchain certificates, and auto-enrollment by sector.",
  },
  {
    name: "Youth Empowerment Project (YEP / SkYE Fund)",
    type: "UNDP / EU",
    focus: "Digital Marketing, E-Commerce, Mobile Money",
    cost: "Free (sponsored)",
    audience: "Youth 16–35",
    link: "https://www.yep.gm",
    color: "#059669",
    desc: "EU-funded programme targeting youth entrepreneurship with digital skills training and business development support.",
  },
  {
    name: "IIHT Gambia",
    type: "Private",
    focus: "Networking, Web Development, Hardware",
    cost: "Paid",
    audience: "Career changers",
    link: "https://iiht.com/gambia",
    color: "#7C3AED",
    desc: "International IT training franchise offering industry-recognised certifications in networking, programming, and cybersecurity.",
  },
  {
    name: "YMCA Gambia Digital Skills",
    type: "NGO",
    focus: "Basic ICT, Internet, MS Office",
    cost: "Low-cost",
    audience: "All ages",
    link: "https://ymca.gm",
    color: "#D97706",
    desc: "Accessible ICT literacy training provided at multiple community centres across The Gambia.",
  },
  {
    name: "The Hub Gambia",
    type: "Private / Tech Community",
    focus: "Web Dev, App Development, Digital Design",
    cost: "Mixed",
    audience: "Tech entrepreneurs",
    link: "https://thehubgambia.com",
    color: "#0891B2",
    desc: "Innovation hub and co-working space offering bootcamps, workshops, and mentorship for Gambian tech entrepreneurs.",
  },
  {
    name: "UTG ICT Centre",
    type: "University of The Gambia",
    focus: "Computer Science, Networking, Databases",
    cost: "Academic",
    audience: "Students",
    link: "https://utg.edu.gm",
    color: "#DC2626",
    desc: "University-level ICT programmes providing academic qualifications and short courses for professionals.",
  },
  {
    name: "GIEPA Digital Entrepreneurship",
    type: "Government / GIEPA",
    focus: "E-Commerce, Digital Marketing, Business Tech",
    cost: "Free / subsidised",
    audience: "SMEs & Entrepreneurs",
    link: "https://giepa.gm",
    color: "#16A34A",
    desc: "GIEPA's enterprise development programmes with a growing digital component targeting export-ready SMEs.",
  },
  {
    name: "Gambia Digital Innovation Sprint (UNICEF)",
    type: "UNICEF / Government",
    focus: "Social Innovation, Digital Solutions, Hackathons",
    cost: "Free",
    audience: "Youth innovators",
    link: "https://unicef.org/gambia",
    color: "#0891B2",
    desc: "Youth-focused innovation programme identifying digital solutions to local development challenges in health, education, and agriculture.",
  },
  {
    name: "World Bank Tourism Digital Skills",
    type: "World Bank",
    focus: "Online Marketing, Booking Systems, Payment Acceptance",
    cost: "Free (project-funded)",
    audience: "Tourism sector workers",
    link: "https://worldbank.org",
    color: "#1D4ED8",
    desc: "Targeted programme equipping tourism operators with digital tools to improve visibility, bookings, and guest experience.",
  },
];

const TYPE_COLOR: Record<string, string> = {
  "Government / AU": "#1D4ED8",
  "Private Platform": PRIMARY,
  "UNDP / EU": "#059669",
  "Private": "#7C3AED",
  "NGO": "#D97706",
  "Private / Tech Community": "#0891B2",
  "University of The Gambia": "#DC2626",
  "Government / GIEPA": "#16A34A",
  "UNICEF / Government": "#0891B2",
  "World Bank": "#1D4ED8",
};

export default function DigitalSkillsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`,
        padding: "3rem 1.5rem 2.5rem", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Skills Directory</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800 }}>
            🎓 Digital Skills Training — The Gambia
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "60ch" }}>
            Every digital training programme, bootcamp, and online platform available to Gambians — from free government initiatives to private providers.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { label: `${PROGRAMMES.length} Programmes`, icon: "📚" },
              { label: "6 Free / Gov-funded", icon: "✅" },
              { label: "All Levels", icon: "📈" },
              { label: "Updated April 2026", icon: "🔄" },
            ].map((b) => (
              <div key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.45rem 0.85rem", fontSize: "0.8rem", color: WHITE, fontWeight: 600 }}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1rem" }}>
          {PROGRAMMES.map((p) => {
            const tc = TYPE_COLOR[p.type] ?? "#6B7280";
            return (
              <div key={p.name} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderTop: `4px solid ${p.color}`, borderRadius: 12, padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "0.5rem" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: DARK, lineHeight: 1.3, flex: 1 }}>{p.name}</div>
                  <span style={{ flexShrink: 0, fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: `${tc}12`, color: tc, border: `1px solid ${tc}25` }}>{p.type}</span>
                </div>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.55, flex: 1 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: p.cost === "Free" || p.cost.startsWith("Free") ? "#D1FAE5" : "#FEF3C7", color: p.cost === "Free" || p.cost.startsWith("Free") ? "#065F46" : "#92400E" }}>{p.cost}</span>
                  <span style={{ fontSize: "0.68rem", padding: "2px 7px", borderRadius: 999, background: "#F3F4F6", color: "#374151" }}>{p.audience}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "#6B7280", marginBottom: "0.6rem" }}>📚 {p.focus}</div>
                <a href={p.link.startsWith("http") ? p.link : p.link} target={p.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "0.5rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}>
                  {p.link.startsWith("/") ? "Enroll Free →" : "Visit Programme →"}
                </a>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "2.5rem", background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, borderRadius: 12, padding: "1.5rem 1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ color: GOLD, fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.25rem" }}>Start Your Digital Journey Today</div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>FORTIS OS Digital Skills Hub is free, sector-specific, and Gambia-focused.</p>
          </div>
          <a href="/training/hub" style={{ padding: "0.7rem 1.5rem", background: GOLD, color: DARK, borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", whiteSpace: "nowrap" }}>
            🎓 Enroll Free →
          </a>
        </div>
      </div>
    </div>
  );
}
