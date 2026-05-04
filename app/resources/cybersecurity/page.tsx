// app/resources/cybersecurity/page.tsx
const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const CURRENT_STATE = [
  { label: "National Policy", value: "Cybersecurity Policy 2022–2026", icon: "📋", color: "#0077B6" },
  { label: "Key Institutions", value: "NCA + GM-CSIRT", icon: "🏛️", color: "#7C3AED" },
  { label: "Threat Landscape", value: "Mobile fraud, phishing, scams", icon: "⚠️", color: "#DC2626" },
  { label: "Legislation Status", value: "Communications Bill 2025 pending", icon: "⚖️", color: "#D97706" },
];

const OPPORTUNITIES = [
  {
    rank: 1,
    title: "Critical Infrastructure Protection (CIIP) & SOC-as-a-Service",
    icon: "🛡️",
    color: "#DC2626",
    revenue: "Managed security services — recurring retainer",
    synergy: "Secure circular-economy hubs + national platform protection",
    description: "Gambia's power grid, banking system, and telecoms infrastructure have no dedicated security operations centre. Enterprise SOC-as-a-Service with 24/7 threat monitoring is entirely absent from the market.",
    maturity: "Critical Gap",
  },
  {
    rank: 2,
    title: "Capacity Building & Training",
    icon: "🎓",
    color: "#7C3AED",
    revenue: "Corporate training, e-learning subscriptions, certification fees",
    synergy: "National training portals + skills certification engine",
    description: "PURA and NCA have publicly acknowledged severe skill shortages. Only a handful of certified cybersecurity professionals in the country. Demand for CISSP, CEH, and Security+ training is immediate.",
    maturity: "High Demand",
  },
  {
    rank: 3,
    title: "Secure Digital Public Services",
    icon: "🏛️",
    color: "#0077B6",
    revenue: "White-label secure portals, government SaaS contracts",
    synergy: "Government-as-a-Service modules in Fortis OS",
    description: "MyGov portal and Digital Addressing System require secure API gateways, identity verification, and data residency compliance. Zero viable local vendors currently serving this need.",
    maturity: "Policy-Backed",
  },
  {
    rank: 4,
    title: "Mobile Money & Fintech Security",
    icon: "💳",
    color: "#D97706",
    revenue: "Threat intelligence feeds, fraud detection SaaS, API security",
    synergy: "Secure marketplace transactions in Fortis OS marketplace",
    description: "Mobile money fraud is the #1 reported cybercrime in Gambia. Wave, Africell Money, and QMoney lack advanced fraud detection. AI-powered anomaly detection is a high-value B2B product.",
    maturity: "Urgent Need",
  },
  {
    rank: 5,
    title: "Cybersecurity for SMEs",
    icon: "💼",
    color: "#16A34A",
    revenue: "Bundled SaaS — security layer add-on per business",
    synergy: "Built-in security module for all Fortis OS business accounts",
    description: "SMEs are the most attacked and least protected segment. A simple, affordable security bundle (endpoint protection, phishing awareness, backup) has no local competitor.",
    maturity: "Market Gap",
  },
  {
    rank: 6,
    title: "Incident Response & Consulting",
    icon: "🔍",
    color: "#E4405F",
    revenue: "Retainer services, pentest engagements, breach response",
    synergy: "Automated incident reporting and compliance tools",
    description: "No dedicated incident response firm in Gambia. When breaches occur (and they do), organisations call international consultants at premium rates. A local IR team commands significant trust and margin.",
    maturity: "Greenfield",
  },
];

const PARTNERS = [
  {
    name: "PURA",
    full: "Public Utilities Regulatory Authority",
    status: "Active Partner Seeker",
    statusColor: "#16A34A",
    icon: "📡",
    detail: "Signed MoU with CTM360 (Jan 2026) for threat intelligence. Actively seeking local cybersecurity partnerships for licensed operators.",
    opportunity: "Become preferred cybersecurity vendor for all PURA-licensed operators",
  },
  {
    name: "MoCDE",
    full: "Ministry of Communications & Digital Economy",
    status: "Strategic Enabler",
    statusColor: "#0077B6",
    icon: "🏛️",
    detail: "Drives the National Digital Economy Master Plan 2024-2034. Cybersecurity is a named pillar. Favours local-first procurement under GIEPA framework.",
    opportunity: "White-label security services for all e-government initiatives",
  },
  {
    name: "GM-CSIRT",
    full: "Gambia Computer Security Incident Response Team",
    status: "Technical Partner",
    statusColor: "#7C3AED",
    icon: "🔒",
    detail: "National CSIRT under NCA. Resource-constrained but politically connected. Seeks private sector capacity augmentation.",
    opportunity: "Provide technical capacity and tooling under shared service model",
  },
  {
    name: "CBG",
    full: "Central Bank of the Gambia",
    status: "Regulatory Driver",
    statusColor: "#D97706",
    icon: "🏦",
    detail: "Issued cybersecurity guidelines for financial institutions. Enforcing compliance across licensed banks and mobile money operators.",
    opportunity: "Compliance-as-a-Service for CBG-regulated entities",
  },
];

const THREAT_LANDSCAPE = [
  { threat: "Mobile Money Fraud", severity: "High", trend: "↑ Rising", color: "#DC2626", pct: 85 },
  { threat: "Phishing & Social Engineering", severity: "High", trend: "↑ Rising", color: "#DC2626", pct: 78 },
  { threat: "Online Scams & Fraud", severity: "High", trend: "↑ Rising", color: "#DC2626", pct: 72 },
  { threat: "Ransomware (Enterprise)", severity: "Medium", trend: "→ Stable", color: "#D97706", pct: 45 },
  { threat: "Data Breaches", severity: "Medium", trend: "↑ Rising", color: "#D97706", pct: 40 },
  { threat: "DDoS Attacks", severity: "Medium", trend: "→ Stable", color: "#D97706", pct: 35 },
  { threat: "Supply Chain Attacks", severity: "Low", trend: "↑ Emerging", color: "#16A34A", pct: 20 },
];

export default function CybersecurityPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #0A1628 0%, #1B2D4E 55%, #1B4D3E 100%)",
        padding: "3rem 1.5rem 2.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} />
          <div style={{ flex: 1, background: WHITE }} />
          <div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, borderRadius: "50%", border: "2px solid rgba(196,148,58,0.12)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>National Intelligence</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800 }}>
            🔒 Cybersecurity Intelligence
          </h1>
          <p style={{ margin: "0 0 2rem", color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "60ch" }}>
            Policy framework, threat landscape, market gaps, and revenue opportunities for The Gambia.
          </p>
          {/* Current State Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {CURRENT_STATE.map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${s.color}30`, borderTop: `3px solid ${s.color}`, borderRadius: 10, padding: "1rem 1.1rem" }}>
                <div style={{ fontSize: 22, marginBottom: "0.35rem" }}>{s.icon}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>{s.label}</div>
                <div style={{ color: WHITE, fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.4 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Threat Landscape */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Threat Landscape
          </h2>
          <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            {THREAT_LANDSCAPE.map((t, i) => (
              <div key={t.threat} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1.25rem", borderBottom: i < THREAT_LANDSCAPE.length - 1 ? "1px solid #F0F4F0" : "none" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.88rem", color: DARK }}>{t.threat}</span>
                </div>
                <span style={{ padding: "2px 8px", borderRadius: 999, background: `${t.color}12`, color: t.color, fontSize: "0.7rem", fontWeight: 700, border: `1px solid ${t.color}25`, flexShrink: 0 }}>
                  {t.severity}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#6B7280", width: 80, textAlign: "right", flexShrink: 0 }}>{t.trend}</span>
                <div style={{ width: 100, background: "#F0F4F0", borderRadius: 4, height: 6, flexShrink: 0 }}>
                  <div style={{ width: `${t.pct}%`, height: "100%", background: t.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Opportunity Table */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Revenue Opportunity Ranking
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {OPPORTUNITIES.map((opp) => (
              <div key={opp.rank} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderLeft: `5px solid ${opp.color}`, borderRadius: 10, padding: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${opp.color}12`, border: `2px solid ${opp.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: opp.color }}>#{opp.rank}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: "0.45rem" }}>
                    <span style={{ fontSize: 18 }}>{opp.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: "0.97rem", color: DARK }}>{opp.title}</span>
                    <span style={{ padding: "2px 8px", borderRadius: 999, background: `${opp.color}12`, color: opp.color, fontSize: "0.7rem", fontWeight: 700, border: `1px solid ${opp.color}25` }}>
                      {opp.maturity}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 0.65rem", fontSize: "0.82rem", color: "#374151", lineHeight: 1.6 }}>{opp.description}</p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 6, padding: "0.4rem 0.75rem", fontSize: "0.75rem", color: "#92400E" }}>
                      💰 {opp.revenue}
                    </div>
                    <div style={{ background: "#F0F9F4", border: "1px solid #D1FAE5", borderRadius: 6, padding: "0.4rem 0.75rem", fontSize: "0.75rem", color: "#065F46" }}>
                      ⚡ {opp.synergy}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Government Partners */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PRIMARY }}>
            Government Partners
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {PARTNERS.map((p) => (
              <div key={p.name} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: 24 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1rem", color: DARK }}>{p.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>{p.full}</div>
                  </div>
                  <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: 999, background: `${p.statusColor}12`, color: p.statusColor, fontSize: "0.68rem", fontWeight: 700, border: `1px solid ${p.statusColor}25`, flexShrink: 0 }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ margin: "0 0 0.6rem", fontSize: "0.78rem", color: "#4B5563", lineHeight: 1.5 }}>{p.detail}</p>
                <div style={{ background: "#F0F9F4", border: "1px solid #D1FAE5", borderRadius: 6, padding: "0.45rem 0.75rem", fontSize: "0.75rem", color: "#065F46" }}>
                  🎯 {p.opportunity}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{
            background: "linear-gradient(135deg, #0A1628 0%, #1B2D4E 55%, #1B4D3E 100%)",
            borderRadius: 14, padding: "2rem 2.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1.5rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", border: "2px solid rgba(196,148,58,0.15)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ margin: "0 0 0.4rem", color: WHITE, fontSize: "1.25rem", fontWeight: 800 }}>
                Fortis OS is uniquely positioned
              </h2>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", maxWidth: "52ch", lineHeight: 1.6 }}>
                To become The Gambia&apos;s secure national platform — serving government, enterprises, and SMEs under one compliance-ready architecture.
              </p>
            </div>
            <a href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "0.8rem 1.6rem",
              background: GOLD, color: DARK,
              borderRadius: 10, fontWeight: 800, fontSize: "0.95rem",
              textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, position: "relative",
            }}>
              🤝 Partner with Fortis OS
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
