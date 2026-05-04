// app/resources/afcfta/page.tsx

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const OPPORTUNITIES = [
  {
    sector: "E-Commerce & Digital Retail",
    icon: "🛍️", color: "#1D4ED8",
    opportunity: "Access a 1.4 billion consumer market across 54 countries with reduced tariffs and streamlined customs.",
    gmbAdvantage: "Gambian artisans, fashion designers, and food producers can list on pan-African platforms and export duty-free to AfCFTA member states.",
    actions: ["List on Gamlumo and regional e-commerce platforms", "Obtain certificate of origin from GIEPA", "Register for AfCFTA e-commerce protocols"],
  },
  {
    sector: "Digital Financial Services",
    icon: "💳", color: "#16A34A",
    opportunity: "PAPSS (Pan-African Payment Settlement System) enables real-time cross-border payments in local currencies, eliminating USD conversion costs.",
    gmbAdvantage: "Gambian fintech companies can offer cross-border remittance and payment services to AfCFTA markets without expensive correspondent banking relationships.",
    actions: ["Integrate PAPSS APIs for cross-border payments", "Obtain CBG e-money operator licence", "Register with PAPSS gateway operators"],
  },
  {
    sector: "Digital Services Exports",
    icon: "💻", color: "#7C3AED",
    opportunity: "AfCFTA Protocol on Digital Trade covers cross-border digital services including software, consulting, BPO, and creative services.",
    gmbAdvantage: "English-speaking Gambian tech talent can provide IT services, customer support, and digital marketing to businesses across Africa and the diaspora.",
    actions: ["Register business with GIEPA as service exporter", "Build digital portfolio and credentials", "Certify team with FORTIS OS Digital Skills Hub"],
  },
  {
    sector: "Agriculture & Food Trade",
    icon: "🌾", color: "#D97706",
    opportunity: "Preferential tariff rates for agricultural products traded within AfCFTA. Standardised phytosanitary certificates reduce export barriers.",
    gmbAdvantage: "Gambian groundnuts, sesame, fish products, and fruits can access West African, East African, and North African markets at preferential rates.",
    actions: ["Obtain GIEPA export licence and phytosanitary certificate", "Digital traceability for quality assurance", "Register with African Continental Free Trade Secretariat"],
  },
  {
    sector: "Tourism & Hospitality",
    icon: "✈️", color: "#059669",
    opportunity: "AfCFTA free movement protocols and standardised visa procedures make Gambia more accessible as a hub for African business tourism.",
    gmbAdvantage: "Gambia's stability, English language, and proximity to Europe positions it as a West African conference hub. Digital marketing to African business travellers.",
    actions: ["List on pan-African travel platforms", "Adopt digital payment acceptance for all currencies", "Create packages targeting intra-African business travellers"],
  },
  {
    sector: "MSME Digital Inclusion",
    icon: "🚀", color: "#DC2626",
    opportunity: "AfCFTA's MSME Protocol provides tailored support including simplified customs, preferential financing, and technical assistance for micro and small enterprises.",
    gmbAdvantage: "90% of Gambian businesses are MSMEs. The protocol directly targets this segment with simplified procedures, reducing barriers that previously excluded informal businesses.",
    actions: ["Register informally operating businesses with GIEPA", "Adopt digital documentation (e-invoices, digital contracts)", "Access AfCFTA MSME technical assistance programmes"],
  },
];

const REQUIREMENTS = [
  { req: "Certificate of Origin", body: "Proving Gambian origin of exported goods to access preferential tariff rates. Issued by GIEPA and Gambia Chamber of Commerce.", icon: "📜" },
  { req: "Digital Trade Documentation", body: "E-invoices, e-bills of lading, and digital customs declarations. FORTIS OS document composer supports compliant formats.", icon: "💻" },
  { req: "Product Standards Compliance", body: "Goods must meet ECOWAS and AfCFTA product standards. Contact Gambia Standards Bureau for sector-specific requirements.", icon: "✅" },
  { req: "Business Registration", body: "Must be registered with GIEPA and have valid business licence. Informal traders can access simplified registration for AfCFTA.", icon: "🏢" },
  { req: "Tax Clearance Certificate", body: "Proof of compliance with Gambia Revenue Authority tax requirements. Required for GIEPA export facilitation services.", icon: "📊" },
];

export default function AfcftaPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: "linear-gradient(135deg, #0A1628 0%, #0F3D21 50%, #1B4D3E 100%)", padding: "3rem 1.5rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Trade Intelligence</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800 }}>
            🌍 AfCFTA Digital Trade — Gambia Opportunities
          </h1>
          <p style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "65ch" }}>
            How Gambian businesses can leverage the African Continental Free Trade Area to access a 1.4 billion consumer market through digital channels.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", maxWidth: 700 }}>
            {[
              { v: "1.4B", l: "Consumer market" },
              { v: "54", l: "Member states" },
              { v: "$3.4T", l: "Combined GDP" },
              { v: "0–5%", l: "Tariff range" },
            ].map((s) => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                <div style={{ color: GOLD, fontSize: "1.4rem", fontWeight: 900 }}>{s.v}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Opportunities */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9CA3AF" }}>
            Sector Opportunities for Gambian Businesses
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {OPPORTUNITIES.map((o) => (
              <div key={o.sector} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderTop: `4px solid ${o.color}`, borderRadius: 12, padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: 22 }}>{o.icon}</span>
                  <div style={{ fontWeight: 800, fontSize: "0.88rem", color: DARK }}>{o.sector}</div>
                </div>
                <p style={{ margin: "0 0 0.65rem", fontSize: "0.8rem", color: "#374151", lineHeight: 1.6 }}>{o.opportunity}</p>
                <div style={{ background: "#E8F5EF", border: "1px solid #BBF7D0", borderRadius: 8, padding: "0.6rem 0.8rem", marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: PRIMARY, marginBottom: "0.2rem" }}>🇬🇲 GAMBIA ADVANTAGE</div>
                  <p style={{ margin: 0, fontSize: "0.76rem", color: "#065F46", lineHeight: 1.5 }}>{o.gmbAdvantage}</p>
                </div>
                <div style={{ marginTop: "auto" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9CA3AF", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Action Steps</div>
                  {o.actions.map((a, i) => (
                    <div key={i} style={{ fontSize: "0.75rem", color: "#374151", padding: "0.25rem 0", borderBottom: i < o.actions.length - 1 ? "1px solid #F0F4F0" : "none" }}>
                      {i + 1}. {a}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9CA3AF" }}>
            Export Requirements Checklist
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {REQUIREMENTS.map((r) => (
              <div key={r.req} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0.9rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: DARK, marginBottom: "0.2rem" }}>{r.req}</div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.55 }}>{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, borderRadius: 12, padding: "1.5rem 1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ color: GOLD, fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.25rem" }}>Ready to Export?</div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Use FORTIS OS UJU Cycle™ to build your export readiness strategy.</p>
          </div>
          <a href="/uju-cycle" style={{ padding: "0.7rem 1.5rem", background: GOLD, color: DARK, borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", whiteSpace: "nowrap" }}>
            ⟳ UJU Cycle™ →
          </a>
        </div>
      </div>
    </div>
  );
}
