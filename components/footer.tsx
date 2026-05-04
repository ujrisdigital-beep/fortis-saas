import Link from "next/link";
import FortisLogo from "./FortisLogo";

const ecosystemLinks: { href: string; label: string }[] = [
  { href: "https://discover.fortisos.cloud", label: "🇬🇲 Discover Gambia" },
  { href: "https://fortisinvicta.com",       label: "🏢 FORTIS CORPORATE" },
  { href: "https://ujris.org",               label: "⚖️ UJRIS" },
  { href: "/professional-bodies/itag",       label: "🖥️ ITAG" },
];

export function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={footerInnerStyle}>
        <div style={footerGridStyle}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "0.75rem" }}>
              <FortisLogo variant="full" white />
            </div>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
              Sovereign Digital Infrastructure for The Gambia
            </p>
            <p style={footerTaglineStyle}>
              Gambia&apos;s national economic intelligence platform — AI-powered analysis, training, and business tools.
            </p>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["GDPA 2018", "UK GDPR", "ISO 27001"].map((badge) => (
                <span key={badge} style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>{badge}</span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <p style={footerHeadingStyle}>Tools</p>
            <nav style={footerNavStyle}>
              <Link href="/uju-cycle" style={footerLinkStyle}>UJU Cycle</Link>
              <Link href="/ikenga" style={footerLinkStyle}>IKENGA AI</Link>
              <Link href="/ikenga/identity" style={footerLinkStyle}>Identity Suite</Link>
              <Link href="/ask-ujris" style={footerLinkStyle}>Ask UJRIS</Link>
            </nav>
          </div>

          {/* Training */}
          <div>
            <p style={footerHeadingStyle}>Training</p>
            <nav style={footerNavStyle}>
              <Link href="/training/hub" style={footerLinkStyle}>Digital Skills Hub</Link>
              <Link href="/training/my-learning" style={footerLinkStyle}>My Learning</Link>
              <Link href="/training/simulate/general" style={footerLinkStyle}>Simulations</Link>
              <Link href="/training/verify" style={footerLinkStyle}>Verify Certificate</Link>
              <Link href="/employers" style={footerLinkStyle}>Employer Partners</Link>
            </nav>
          </div>

          {/* Knowledge */}
          <div>
            <p style={footerHeadingStyle}>Knowledge</p>
            <nav style={footerNavStyle}>
              <Link href="/knowledge" style={footerLinkStyle}>Knowledge Hub</Link>
              <Link href="/knowledge/tango" style={footerLinkStyle}>TANGO Directory</Link>
              <Link href="/resources/forest" style={footerLinkStyle}>Forest Data</Link>
              <Link href="/resources/cybersecurity" style={footerLinkStyle}>Cybersecurity</Link>
              <Link href="/resources/telecom" style={footerLinkStyle}>Telecom</Link>
              <Link href="/resources/digital-economy" style={footerLinkStyle}>Digital Economy</Link>
            </nav>
          </div>

          {/* Account & Legal */}
          <div>
            <p style={footerHeadingStyle}>Account & Legal</p>
            <nav style={footerNavStyle}>
              <Link href="/payment" style={footerLinkStyle}>Get Access</Link>
              <Link href="/auth/login" style={footerLinkStyle}>Sign In</Link>
              <Link href="/auth/forgot-password" style={footerLinkStyle}>Forgot Password</Link>
              <Link href="/knowledge/disclaimer" style={footerLinkStyle}>Disclaimer & Copyright</Link>
              <Link href="/knowledge/disclaimer#section-3" style={footerLinkStyle}>Data Protection</Link>
              <Link href="/admin/diagnostics" style={footerLinkStyle}>Diagnostics</Link>
            </nav>
          </div>
        </div>

        {/* Ecosystem Cross-Links */}
        <div style={ecosystemRowStyle}>
          {ecosystemLinks.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={ecosystemLinkStyle}>
              {l.label}
            </a>
          ))}
        </div>

        <div style={footerBottomStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <p style={copyrightStyle}>
              © {new Date().getFullYear()} FORTIS INVICTA LTD · UJU GROUP LIMITED. FORTIS OS™, UJU CYCLE™, IKENGA™, ASK UJRIS™ are trademarks of UJU GROUP LIMITED.
              Gambia Data Protection Act 2018 compliant · UK GDPR compliant.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexShrink: 0 }}>
              <Link href="/knowledge/disclaimer" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy</Link>
              <Link href="/knowledge/disclaimer#section-5" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms</Link>
              <a href="mailto:legal@fortisos.cloud" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Legal</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerStyle: React.CSSProperties = {
  background: "var(--color-primary)",
  color: "#FFFFFF",
  marginTop: "4rem",
};

const footerInnerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "3rem 1.25rem 1.5rem",
};

const footerGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
  gap: "2rem",
};

const footerBrandStyle: React.CSSProperties = {
  margin: 0,
  fontWeight: 900,
  fontSize: "1.1rem",
  letterSpacing: "0.08em",
  color: "var(--color-secondary)",
};

const footerTaglineStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.82rem",
  color: "rgba(255,255,255,0.65)",
  maxWidth: "28ch",
  lineHeight: 1.65,
};

const footerHeadingStyle: React.CSSProperties = {
  margin: "0 0 0.75rem",
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-secondary)",
};

const footerNavStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.45rem",
};

const footerLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "rgba(255,255,255,0.72)",
  fontSize: "0.84rem",
};

const footerBottomStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.12)",
  marginTop: "2.5rem",
  paddingTop: "1.25rem",
};

const ecosystemRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.25rem",
  flexWrap: "wrap",
  justifyContent: "center",
  paddingBottom: "1.5rem",
  marginBottom: "1.5rem",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const ecosystemLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "var(--color-secondary)",
  fontSize: "0.82rem",
  fontWeight: 600,
};

const copyrightStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.75rem",
  color: "rgba(255,255,255,0.45)",
  lineHeight: 1.7,
  maxWidth: "70ch",
};
