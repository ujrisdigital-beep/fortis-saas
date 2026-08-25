import Link from "next/link";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={heroSectionStyle}>
          <div style={heroInnerStyle}>
            <div style={heroBadgeStyle}>FORTIS OS™ by UJU GROUP LIMITED</div>
            <h1 style={heroTitleStyle}>
              Operational Intelligence for<br />
              <span style={heroAccentStyle}>African Business Leaders</span>
            </h1>
            <p style={heroCopyStyle}>
              Core, GROW, Academy, Discover, Govern and Partner are on for the pilot. Pay by bank or wallet
              transfer only — live cards stay off.
            </p>
            <div style={heroButtonRowStyle}>
              <Link href="/onboarding" style={primaryLinkStyle}>Create account</Link>
              <Link href="/demo" style={secondaryLinkStyle}>Honest walkthrough</Link>
              <Link href="/pay/transfer" style={tertiaryLinkStyle}>Pay by transfer</Link>
            </div>
          </div>
          <div style={heroGraphicStyle}>
            <div style={graphicCardStyle}>
              <p style={graphicLabelStyle}>Platform Status</p>
              <div style={statusRowStyle}>
                <span style={statusDotStyle} />
                <span style={statusTextStyle}>All systems operational</span>
              </div>
              <div style={statGridStyle}>
                {stats.map((s) => (
                  <div key={s.label} style={statItemStyle}>
                    <span style={statValueStyle}>{s.value}</span>
                    <span style={statLabelStyle}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section style={toolsSectionStyle}>
          <div style={sectionInnerStyle}>
            <div style={sectionHeaderStyle}>
              <p style={sectionKickerStyle}>Core Tools</p>
              <h2 style={sectionTitleStyle}>Six SBN modules. Honest status on each.</h2>
              <p style={sectionSubStyle}>Pilot and preview surfaces — no fake money, no unpublished inventory.</p>
            </div>
            <div style={cardGridStyle}>
              {tools.map((tool) => (
                <article key={tool.href} style={toolCardStyle}>
                  <div style={{ ...toolIconStyle, background: tool.iconBg }}>
                    <span style={{ fontSize: "1.4rem" }}>{tool.icon}</span>
                  </div>
                  <p style={toolTagStyle}>{tool.tag}</p>
                  <h3 style={toolTitleStyle}>{tool.title}</h3>
                  <p style={toolDescStyle}>{tool.description}</p>
                  <div style={toolFeaturesStyle}>
                    {tool.features.map((f) => (
                      <span key={f} style={featureTagStyle}>{f}</span>
                    ))}
                  </div>
                  <Link href={tool.href} style={toolLinkStyle}>{tool.cta} →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Get Started Banner */}
        <section style={ctaBannerStyle}>
          <div style={ctaInnerStyle}>
            <h2 style={ctaTitleStyle}>Buy the GROW full blueprint</h2>
            <p style={ctaSubStyle}>Catalogue price ID only. Transfer evidence unlocks the report. Not a bank credit product.</p>
            <Link href="/pay/transfer" style={ctaButtonStyle}>Pay GMD 250 by transfer →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const stats = [
  { value: "6", label: "Modules" },
  { value: "3", label: "Paid SKUs" },
  { value: "Off", label: "Live cards" },
];

const tools = [
  {
    tag: "GROW",
    title: "Business diagnostic",
    description: "Free preview scores. Full blueprint after GMD 250 transfer. Not a credit product.",
    href: "/grow/workspace",
    cta: "Open GROW",
    icon: "📈",
    iconBg: "rgba(27, 77, 62, 0.1)",
    features: ["Preview free", "GMD 250 full", "Cited public data"],
  },
  {
    tag: "GROW TOOLS",
    title: "Gambia planners",
    description: "Grant watchlist, solar, yield, recycling, mortgage maths. Labelled models — no live NAWEC or credit scores.",
    href: "/grow/tools",
    cta: "Open planners",
    icon: "🧮",
    iconBg: "rgba(212, 175, 55, 0.1)",
    features: ["Illustrative", "Gambia-fit", "No fake GMV"],
  },
  {
    tag: "ACADEMY",
    title: "Skills and credentials",
    description: "Learn without paying. HMAC-signed certificates after a GMD 150 assessment transfer.",
    href: "/academy",
    cta: "Open Academy",
    icon: "🎓",
    iconBg: "rgba(212, 175, 55, 0.1)",
    features: ["Server banks", "Fail-closed verify", "No client keys"],
  },
  {
    tag: "DISCOVER",
    title: "Gambia listings",
    description: "Verified public listings. Ticket checkout stays closed until organiser KYB and a PSP.",
    href: "/discover",
    cta: "Open Discover",
    icon: "🗺️",
    iconBg: "rgba(27, 77, 62, 0.1)",
    features: ["Verified only", "Tickets closed", "Free browse"],
  },
  {
    tag: "GOVERN",
    title: "Complaint intake",
    description: "Consenting case intake and pdf.js extract. No automated judgment.",
    href: "/ombudsman",
    cta: "Open Ombudsman",
    icon: "⚖️",
    iconBg: "rgba(27, 77, 62, 0.1)",
    features: ["Consent required", "Human review", "Dual-control orders"],
  },
  {
    tag: "PARTNER",
    title: "Directory + KYB",
    description: "Development-partner directory is live. Merchant commerce inventory stays empty.",
    href: "/partner",
    cta: "Open Partner",
    icon: "🤝",
    iconBg: "rgba(212, 175, 55, 0.1)",
    features: ["Directory", "KYB machine", "No fake SKUs"],
  },
  {
    tag: "RIDES",
    title: "Hire by transfer",
    description: "Owner-listed trips paid by bank or wallet transfer. Not licensed escrow.",
    href: "/rides",
    cta: "Open Rides",
    icon: "🚗",
    iconBg: "rgba(27, 77, 62, 0.1)",
    features: ["Provisional unlock", "Unique FTS ref", "No card capture"],
  },
];

/* Styles */
const heroSectionStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--color-primary) 0%, #0f3328 100%)",
  padding: "5rem 1.25rem 4rem",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
  gap: "3rem",
  alignItems: "center",
  maxWidth: "100%",
};

const heroInnerStyle: React.CSSProperties = {
  maxWidth: "580px",
  marginLeft: "auto",
  paddingLeft: "calc((100% - 1100px) / 2)",
};

const heroBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(212, 175, 55, 0.2)",
  border: "1px solid rgba(212, 175, 55, 0.4)",
  color: "#D4AF37",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  padding: "0.35rem 0.85rem",
  borderRadius: "999px",
  marginBottom: "1.25rem",
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: "clamp(2rem, 4vw, 3.5rem)",
  lineHeight: 1.1,
  fontWeight: 800,
  color: "#FFFFFF",
  margin: 0,
};

const heroAccentStyle: React.CSSProperties = {
  color: "#D4AF37",
};

const heroCopyStyle: React.CSSProperties = {
  margin: "1.25rem 0 0",
  fontSize: "1.05rem",
  color: "rgba(255,255,255,0.82)",
  lineHeight: 1.7,
  maxWidth: "52ch",
};

const heroButtonRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  marginTop: "2rem",
};

const primaryLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "#D4AF37",
  color: "#0A1C2E",
  padding: "0.85rem 1.5rem",
  borderRadius: "0.6rem",
  fontWeight: 700,
  fontSize: "0.95rem",
};

const secondaryLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "rgba(255,255,255,0.12)",
  color: "#FFFFFF",
  padding: "0.85rem 1.5rem",
  borderRadius: "0.6rem",
  fontWeight: 700,
  fontSize: "0.95rem",
  border: "1px solid rgba(255,255,255,0.25)",
};

const tertiaryLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "transparent",
  color: "rgba(255,255,255,0.75)",
  padding: "0.85rem 1.5rem",
  borderRadius: "0.6rem",
  fontWeight: 600,
  fontSize: "0.95rem",
};

const heroGraphicStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  paddingRight: "calc((100% - 1100px) / 2)",
};

const graphicCardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "1rem",
  padding: "1.5rem",
  backdropFilter: "blur(10px)",
  minWidth: "240px",
  maxWidth: "320px",
  width: "100%",
};

const graphicLabelStyle: React.CSSProperties = {
  margin: "0 0 0.75rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#D4AF37",
};

const statusRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "1.5rem",
};

const statusDotStyle: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#10B981",
  flexShrink: 0,
};

const statusTextStyle: React.CSSProperties = {
  fontSize: "0.88rem",
  color: "rgba(255,255,255,0.85)",
};

const statGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "0.75rem",
};

const statItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  textAlign: "center",
};

const statValueStyle: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: 800,
  color: "#FFFFFF",
};

const statLabelStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  color: "rgba(255,255,255,0.6)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const toolsSectionStyle: React.CSSProperties = {
  padding: "4rem 1.25rem",
  background: "#FFFFFF",
};

const sectionInnerStyle: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const sectionHeaderStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2.5rem",
};

const sectionKickerStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.76rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: "var(--color-primary)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0.5rem 0 0.5rem",
  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
  fontWeight: 800,
  color: "var(--color-text)",
};

const sectionSubStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--color-text-muted)",
  fontSize: "1rem",
};

const cardGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.5rem",
};

const toolCardStyle: React.CSSProperties = {
  background: "#FAFAFA",
  border: "1.5px solid var(--color-border)",
  borderRadius: "1rem",
  padding: "1.75rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.65rem",
  transition: "box-shadow 0.15s, transform 0.15s",
};

const toolIconStyle: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "0.25rem",
};

const toolTagStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "var(--color-primary)",
};

const toolTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1.15rem",
  fontWeight: 800,
  color: "var(--color-text)",
};

const toolDescStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.92rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.65,
  flexGrow: 1,
};

const toolFeaturesStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
};

const featureTagStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 600,
  padding: "0.25rem 0.6rem",
  borderRadius: "999px",
  background: "var(--color-primary-light)",
  color: "var(--color-primary)",
  border: "1px solid rgba(27,77,62,0.15)",
};

const toolLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  display: "inline-block",
  marginTop: "0.5rem",
  color: "var(--color-primary)",
  fontWeight: 700,
  fontSize: "0.92rem",
};

const ctaBannerStyle: React.CSSProperties = {
  background: "var(--color-secondary)",
  padding: "4rem 1.25rem",
};

const ctaInnerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  textAlign: "center",
};

const ctaTitleStyle: React.CSSProperties = {
  margin: "0 0 0.75rem",
  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
  fontWeight: 800,
  color: "var(--color-text)",
};

const ctaSubStyle: React.CSSProperties = {
  margin: "0 0 1.75rem",
  color: "var(--color-text)",
  opacity: 0.75,
  fontSize: "1.05rem",
};

const ctaButtonStyle: React.CSSProperties = {
  textDecoration: "none",
  display: "inline-block",
  background: "var(--color-primary)",
  color: "#FFFFFF",
  padding: "1rem 2.25rem",
  borderRadius: "0.6rem",
  fontWeight: 800,
  fontSize: "1rem",
};
