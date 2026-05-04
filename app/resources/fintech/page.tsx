// app/resources/fintech/page.tsx

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const STARTUPS = [
  { name: "Ping Money", type: "Remittance & Payments", status: "Active", color: "#1D4ED8", desc: "Cross-border mobile money from UK/US/EU directly to Gambian wallets. Zero-fee P2P transfers.", founded: "2021" },
  { name: "CashUp (CASHUP App)", type: "P2P Payments", status: "Active", color: "#7C3AED", desc: "Gambian P2P payment app. Instant transfers, utility bills, merchant payments.", founded: "2022" },
  { name: "Wave Mobile Money", type: "Mobile Money", status: "Active", color: "#059669", desc: "Zero-fee P2P transfers. The disruptor of traditional mobile money pricing in West Africa.", founded: "2018" },
  { name: "QMoney (Qcell)", type: "Mobile Wallet", status: "Active", color: "#D97706", desc: "Qcell's mobile wallet offering P2P, merchant payments, and airtime top-up.", founded: "2018" },
  { name: "AfriMoney (Africell)", type: "Mobile Wallet", status: "Active", color: "#DC2626", desc: "Africell's mobile financial service with national agent network and diaspora remittance features.", founded: "2020" },
  { name: "Nafa (Access Bank)", type: "Digital Banking", status: "Active", color: "#0891B2", desc: "Access Bank Gambia's digital financial inclusion product targeting the unbanked.", founded: "2021" },
  { name: "APS Wallet", type: "Payment Platform", status: "Active", color: "#16A34A", desc: "All-Purpose Solutions digital wallet supporting merchant payments and bulk disbursements.", founded: "2020" },
  { name: "Gambia Interoperability Switch (GISP)", type: "Infrastructure", status: "Active", color: "#CA8A04", desc: "CBG-operated switch enabling real-time transactions across all mobile money providers and banks.", founded: "2023" },
];

const TRAINING = [
  { name: "CBG Digital Financial Literacy", org: "Central Bank of The Gambia", desc: "Mobile money safety, fraud prevention, consumer rights, and digital banking use cases. Branch-based and community outreach delivery." },
  { name: "GISP Merchant & Agent Training", org: "CBG / Gambia Interoperability Switch", desc: "Training merchants and agents on the unified interoperable payment infrastructure. Cross-network payment acceptance." },
  { name: "Visa Africa FinTech Accelerator", org: "Visa Inc.", desc: "Supports Gambian fintech startups with mentorship, technical resources, and Visa's global payment network access." },
  { name: "UNDP Cybersecurity for Finance", org: "UNDP West Africa", desc: "Covers financial sector threats, incident response protocols, and digital fraud prevention for banking and fintech practitioners." },
  { name: "BANTABA 2.0 Technical Training", org: "CBG / Mojaloop", desc: "Open-source interoperability framework. Technical training for financial institution teams on API integration and settlement procedures." },
  { name: "FORTIS OS Banking Simulation", org: "FORTIS OS", desc: "Interactive sector simulation covering loan analysis, KYC/AML compliance, fraud detection, dispute resolution, and mobile money auditing.", link: "/training/simulate/banking_finance" },
];

const REGULATIONS = [
  { title: "Electronic Communications Act 2009", body: "Governs electronic transactions, digital signatures, and online commerce in The Gambia. Provides legal framework for e-contracts." },
  { title: "CBG E-Money Guidelines (2022)", body: "Regulations covering mobile money operators, agent banking, float management, and consumer protection requirements." },
  { title: "GDPA 2018", body: "Gambia Data Protection Act — governs personal data processing by fintech companies. Requires explicit consent, data minimisation, and breach notification." },
  { title: "Anti-Money Laundering Act (AML/CFT)", body: "Requires all financial institutions and mobile money operators to implement KYC procedures, transaction monitoring, and suspicious activity reporting." },
];

export default function FintechPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: "linear-gradient(135deg, #0A1628 0%, #1D4ED8 60%, #2563EB 100%)", padding: "3rem 1.5rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Fintech Intelligence</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800 }}>
            💳 Gambia Fintech Ecosystem
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "60ch" }}>
            Startups, mobile money operators, regulatory framework, training programmes, and interoperability infrastructure.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Startups */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9CA3AF" }}>Fintech Operators & Startups</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {STARTUPS.map((s) => (
              <div key={s.name} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderTop: `4px solid ${s.color}`, borderRadius: 12, padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: DARK }}>{s.name}</div>
                  <span style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 999, background: "#D1FAE5", color: "#065F46", fontWeight: 700 }}>Active</span>
                </div>
                <span style={{ fontSize: "0.68rem", padding: "2px 7px", borderRadius: 999, background: `${s.color}12`, color: s.color, fontWeight: 700, marginBottom: "0.6rem", display: "inline-block" }}>{s.type}</span>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Training */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9CA3AF" }}>Fintech Training Programmes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {TRAINING.map((t) => (
              <div key={t.name} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderLeft: `4px solid ${PRIMARY}`, borderRadius: 8, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: DARK }}>{t.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginBottom: "0.3rem" }}>{t.org}</div>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#374151", lineHeight: 1.55 }}>{t.desc}</p>
                </div>
                {t.link && (
                  <a href={t.link} style={{ flexShrink: 0, padding: "0.45rem 0.9rem", background: PRIMARY, color: WHITE, borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                    Try Now →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Regulatory Framework */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9CA3AF" }}>Regulatory Framework</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {REGULATIONS.map((r) => (
              <div key={r.title} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1.1rem 1.25rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: DARK, marginBottom: "0.4rem" }}>{r.title}</div>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.6 }}>{r.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
