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
              Three AI-powered tools — business transformation analysis, brand intelligence assessment, and forensic document review — built for founders, operators, and strategists across Africa.
            </p>
            <div style={heroButtonRowStyle}>
              <Link href="/uju-cycle" style={primaryLinkStyle}>Launch UJU Cycle™</Link>
              <Link href="/ikenga" style={secondaryLinkStyle}>Run Ikenga™</Link>
              <Link href="/ask-ujris" style={tertiaryLinkStyle}>Ask UJRIS™</Link>
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
              <h2 style={sectionTitleStyle}>Three tools. One operating system.</h2>
              <p style={sectionSubStyle}>Click any tool to open the full interactive interface.</p>
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
            <h2 style={ctaTitleStyle}>Ready to activate FORTIS OS?</h2>
            <p style={ctaSubStyle}>Start with one tool. Transform your entire operation.</p>
            <Link href="/payment" style={ctaButtonStyle}>Get Full Access →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const stats = [
  { value: "GPT-4", label: "AI Engine" },
  { value: "3", label: "Active Tools" },
  { value: "∞", label: "Analyses" },
];

const tools = [
  {
    tag: "UJU CYCLE™",
    title: "Business Transformation Analyzer",
    description: "Diagnose your operational readiness across Digitise, Optimise, Scale, and Dominate phases. Get a personalised transformation roadmap in under 60 seconds.",
    href: "/uju-cycle",
    cta: "Launch UJU Cycle",
    icon: "⚙️",
    iconBg: "rgba(27, 77, 62, 0.1)",
    features: ["Digitise Score", "Scale Channels", "Dominate Strategy"],
  },
  {
    tag: "IKENGA™",
    title: "Brand Intelligence Assessor",
    description: "Score your brand strength, message clarity, and market distinctiveness. Identify growth opportunities across your channels and positioning.",
    href: "/ikenga",
    cta: "Run Ikenga",
    icon: "🎯",
    iconBg: "rgba(212, 175, 55, 0.1)",
    features: ["Brand Strength 0–100", "Content Strategy", "Opportunities"],
  },
  {
    tag: "ASK UJRIS™",
    title: "Forensic Document Analyzer",
    description: "Upload contracts, agreements, and policy documents for an integrity score, red-flag detection, and actionable recommendations before you sign.",
    href: "/ask-ujris",
    cta: "Ask UJRIS",
    icon: "🔍",
    iconBg: "rgba(27, 77, 62, 0.1)",
    features: ["Integrity Score", "Red Flag Detection", "Recommendations"],
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
