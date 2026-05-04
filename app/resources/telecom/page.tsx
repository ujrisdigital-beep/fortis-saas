// app/resources/telecom/page.tsx
const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const STATS = [
  { label: "Mobile Penetration", value: "112%", sub: "SIMs per 100 people", icon: "📱" },
  { label: "4G Coverage", value: "~94%", sub: "of populated areas", icon: "📶" },
  { label: "5G Availability", value: "GBA Only", sub: "QCell limited rollout", icon: "🚀" },
  { label: "Active Subscribers", value: "3.2M+", sub: "PURA 2024-2025 data", icon: "👥" },
];

const PROVIDERS = [
  {
    name: "Africell", share: "40–45%", color: "#E63946",
    strengths: ["Best nationwide coverage", "Largest subscriber base", "Strong rural presence", "Competitive pricing"],
    tech: ["2G", "3G", "4G"], status: "Market Leader",
  },
  {
    name: "QCell", share: "28%", color: "#0077B6",
    strengths: ["First 5G in Gambia", "Strongest data speeds", "Premium urban network", "Fibre backhaul"],
    tech: ["2G", "3G", "4G", "5G"], status: "5G Pioneer",
  },
  {
    name: "Comium", share: "20–25%", color: "#F4A261",
    strengths: ["Competitive urban pricing", "Growing LTE footprint", "Strong GBA presence", "Value plans"],
    tech: ["2G", "3G", "4G"], status: "Urban Challenger",
  },
  {
    name: "Gamcel", share: "~5%", color: "#2D6A4F",
    strengths: ["State-owned reliability", "Government contracts", "Rural coverage mandate"],
    tech: ["2G", "3G"], status: "State Operator",
  },
];

const COVERAGE = [
  { region: "Greater Banjul Area", level: "Strong", color: "#16A34A", pct: 95, pop: "~1.2M", note: "5G available (QCell)" },
  { region: "West Coast Region", level: "Strong", color: "#16A34A", pct: 90, pop: "~600K", note: "Strong 4G LTE" },
  { region: "North Bank Region", level: "Moderate", color: "#D97706", pct: 72, pop: "~380K", note: "Patchy 4G" },
  { region: "Lower River Region", level: "Moderate", color: "#D97706", pct: 68, pop: "~120K", note: "3G/4G mixed" },
  { region: "Central River Region", level: "Moderate", color: "#D97706", pct: 64, pop: "~240K", note: "Mainly 3G" },
  { region: "Upper River Region", level: "Weak", color: "#DC2626", pct: 45, pop: "~220K", note: "2G/3G only" },
];

const TECH_LAYERS = [
  { gen: "2G / GSM", coverage: "Universal", description: "Voice and SMS across all populated areas. Legacy backbone.", color: "#6B7280" },
  { gen: "3G / UMTS", coverage: "~99% urban, ~80% rural", description: "Basic mobile data. Still primary technology in rural areas.", color: "#D97706" },
  { gen: "4G / LTE", coverage: "~94% populated areas", description: "Widely available in GBA and major towns. Patchy in rural Gambia.", color: "#16A34A" },
  { gen: "5G / NR", coverage: "GBA Limited", description: "QCell only. Banjul, Kairaba Ave, Bakau-Fajara, Senegambia, Brusubi corridors.", color: "#7C3AED" },
];

const INVESTMENTS = [
  {
    title: "Rural 4G/5G Densification",
    tier: "HIGH PRIORITY",
    tierColor: "#DC2626",
    icon: "📡",
    description: "85% of the population remains in connectivity-limited areas. Government PPP incentives via PURA and GIEPA available.",
    return: "High demand, govt incentives, USAF subsidy potential",
  },
  {
    title: "National Fibre Backbone",
    tier: "HIGH PRIORITY",
    tierColor: "#DC2626",
    icon: "🔗",
    description: "800 Gbps ACE submarine cable severely under-monetised. Domestic fibre rings incomplete across all 7 administrative regions.",
    return: "First-mover advantage, monopoly pricing in underserved corridors",
  },
  {
    title: "5G Nationwide Rollout",
    tier: "STRATEGIC",
    tierColor: "#7C3AED",
    icon: "🚀",
    description: "QCell limited GBA deployment creates opportunity for Africell or new entrant to leapfrog to nationwide 5G coverage.",
    return: "Enterprise, IoT, smart city contracts",
  },
  {
    title: "Fixed Broadband / FTTH",
    tier: "STRATEGIC",
    tierColor: "#7C3AED",
    icon: "🏠",
    description: "Secondary cities (Brikama, Basse, Farafenni) have near-zero fixed broadband. FTTH greenfield opportunity.",
    return: "Recurring subscription revenue, enterprise anchor tenants",
  },
  {
    title: "Mobile Money & Fintech Integration",
    tier: "GROWING",
    tierColor: "#0077B6",
    icon: "💳",
    description: "Telecoms are primary channels for mobile money (Wave, Africell Money). API banking infrastructure needed urgently.",
    return: "Transaction fees, float income, lending products",
  },
  {
    title: "Data Centres & IXPs",
    tier: "GROWING",
    tierColor: "#0077B6",
    icon: "🖥️",
    description: "No tier-3 data centre in Gambia. All enterprise data routes via Dakar or London. Local IXP would reduce latency 40-60%.",
    return: "Colocation, cloud hosting, transit fees",
  },
  {
    title: "Satellite Backup (LEO)",
    tier: "EMERGING",
    tierColor: "#16A34A",
    icon: "🛰️",
    description: "Starlink-class LEO satellite for remote communities and government backup communications. PURA licensing pathway exists.",
    return: "Government contracts, premium enterprise backup",
  },
];

const SOURCES = [
  { name: "PURA Annual Report", year: "2024–2025", url: "#" },
  { name: "GSMA Intelligence", year: "2025", url: "#" },
  { name: "DataReportal Digital Gambia", year: "2026", url: "#" },
  { name: "nPerf Coverage Maps", year: "2025", url: "#" },
  { name: "World Bank Digital Economy Diagnostic", year: "2024", url: "#" },
];

export default function TelecomPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`,
        padding: "3rem 1.5rem 2.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} />
          <div style={{ flex: 1, background: WHITE }} />
          <div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, borderRadius: "50%", border: "2px solid rgba(196,148,58,0.15)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>National Intelligence</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800 }}>
            📡 Telecommunications Infrastructure
          </h1>
          <p style={{ margin: "0 0 2rem", color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "60ch" }}>
            Coverage maps, provider market share, 5G rollout, and investment opportunities across The Gambia.
          </p>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(196,148,58,0.2)", borderRadius: 10, padding: "1rem 1.1rem" }}>
                <div style={{ fontSize: 22, marginBottom: "0.35rem" }}>{s.icon}</div>
                <div style={{ color: GOLD, fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: WHITE, fontSize: "0.85rem", fontWeight: 600, marginTop: "0.25rem" }}>{s.label}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: "0.2rem" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Provider Comparison */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Provider Market Share
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {PROVIDERS.map((p) => (
              <div key={p.name} style={{ background: WHITE, border: `2px solid ${p.color}20`, borderTop: `4px solid ${p.color}`, borderRadius: 10, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: DARK }}>{p.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: 2 }}>{p.status}</div>
                  </div>
                  <div style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, borderRadius: 8, padding: "4px 10px", fontSize: "0.95rem", fontWeight: 800, color: p.color }}>
                    {p.share}
                  </div>
                </div>
                {/* Tech badges */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {p.tech.map((t) => (
                    <span key={t} style={{ padding: "2px 8px", borderRadius: 999, background: t === "5G" ? "#7C3AED15" : "#E8F5EF", color: t === "5G" ? "#7C3AED" : PRIMARY, fontSize: "0.72rem", fontWeight: 700, border: `1px solid ${t === "5G" ? "#7C3AED30" : "#16A34A20"}` }}>
                      {t}
                    </span>
                  ))}
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 1rem" }}>
                  {p.strengths.map((s) => (
                    <li key={s} style={{ fontSize: "0.8rem", color: "#374151", marginBottom: 3, lineHeight: 1.4 }}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage Map */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Regional Coverage Map
          </h2>
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            {/* SVG Gambia shape mockup */}
            <div style={{ background: "#E8F5EF", padding: "1.5rem", display: "flex", justifyContent: "center" }}>
              <svg viewBox="0 0 600 180" style={{ width: "100%", maxWidth: 580, height: "auto" }}>
                {/* Gambia geographic shape - simplified strip */}
                <defs>
                  <linearGradient id="gbagrd" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#16A34A" stopOpacity="0.7" />
                    <stop offset="65%" stopColor="#D97706" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Gambia strip shape */}
                <path d="M 30 70 Q 80 50 160 55 Q 240 45 320 60 Q 400 50 480 65 Q 550 60 580 70 Q 570 85 550 100 Q 480 110 400 105 Q 320 95 240 110 Q 160 120 80 110 Q 40 100 30 85 Z"
                  fill="url(#gbagrd)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                {/* Region labels */}
                {[
                  { x: 75,  y: 82, label: "GBA",     dot: "#16A34A" },
                  { x: 165, y: 80, label: "WCR",     dot: "#16A34A" },
                  { x: 260, y: 75, label: "NBR",     dot: "#D97706" },
                  { x: 345, y: 78, label: "LRR",     dot: "#D97706" },
                  { x: 435, y: 80, label: "CRR",     dot: "#D97706" },
                  { x: 535, y: 82, label: "URR",     dot: "#DC2626" },
                ].map((r) => (
                  <g key={r.label}>
                    <circle cx={r.x} cy={r.y - 4} r={4} fill={r.dot} />
                    <text x={r.x} y={r.y + 12} textAnchor="middle" fontSize="10" fontWeight="700" fill={WHITE} fontFamily="DM Sans, system-ui">{r.label}</text>
                  </g>
                ))}
                {/* River Gambia line */}
                <path d="M 30 78 Q 150 82 300 80 Q 450 78 580 78" stroke="rgba(59,130,246,0.5)" strokeWidth="2" fill="none" strokeDasharray="4,3" />
              </svg>
            </div>
            {/* Coverage table */}
            <div style={{ padding: "0 1.25rem 1.25rem" }}>
              {COVERAGE.map((r) => (
                <div key={r.region} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.65rem 0", borderBottom: "1px solid #F0F4F0" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", color: DARK }}>{r.region}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{r.note} · Pop. {r.pop}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: r.color }}>{r.level}</div>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{r.pct}% coverage</div>
                  </div>
                  <div style={{ width: 100, background: "#F0F4F0", borderRadius: 4, height: 6, flexShrink: 0 }}>
                    <div style={{ width: `${r.pct}%`, height: "100%", background: r.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div style={{ padding: "0.75rem 1.25rem 1rem", background: "#F8FAFC", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[["Strong", "#16A34A"], ["Moderate", "#D97706"], ["Weak", "#DC2626"]].map(([l, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "#374151" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Breakdown */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Technology Breakdown
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.85rem" }}>
            {TECH_LAYERS.map((t) => (
              <div key={t.gen} style={{ background: WHITE, border: `2px solid ${t.color}20`, borderLeft: `4px solid ${t.color}`, borderRadius: 8, padding: "1rem 1.1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: DARK }}>{t.gen}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 999, background: `${t.color}15`, color: t.color, fontSize: "0.7rem", fontWeight: 700 }}>ACTIVE</span>
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: t.color, marginBottom: "0.35rem" }}>{t.coverage}</div>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.5 }}>{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Investment Opportunities */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Investment Opportunities
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {INVESTMENTS.map((inv) => (
              <div key={inv.title} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1.25rem", transition: "box-shadow 0.15s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{inv.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: DARK }}>{inv.title}</div>
                    <span style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", borderRadius: 999, background: `${inv.tierColor}12`, color: inv.tierColor, fontSize: "0.7rem", fontWeight: 700, border: `1px solid ${inv.tierColor}25` }}>
                      {inv.tier}
                    </span>
                  </div>
                </div>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#374151", lineHeight: 1.6 }}>{inv.description}</p>
                <div style={{ background: "#F0F9F4", border: "1px solid #D1FAE5", borderRadius: 6, padding: "0.5rem 0.75rem", fontSize: "0.76rem", color: "#065F46" }}>
                  💰 {inv.return}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1.25rem" }}>
            <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>
              Data Sources
            </h3>
            <div style={{ display: "flex", gap: "0.5rem 1.5rem", flexWrap: "wrap" }}>
              {SOURCES.map((src) => (
                <div key={src.name} style={{ fontSize: "0.78rem", color: "#374151" }}>
                  <span style={{ fontWeight: 600 }}>{src.name}</span>
                  <span style={{ color: "#9CA3AF" }}> ({src.year})</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
