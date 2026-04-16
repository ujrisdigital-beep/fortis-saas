import Link from "next/link";

export function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={footerInnerStyle}>
        <div style={footerGridStyle}>
          <div>
            <p style={footerBrandStyle}>FORTIS OS</p>
            <p style={footerTaglineStyle}>Operational intelligence for transformation, brand power, and forensic review.</p>
          </div>
          <div>
            <p style={footerHeadingStyle}>Tools</p>
            <nav style={footerNavStyle}>
              <Link href="/uju-cycle" style={footerLinkStyle}>UJU Cycle</Link>
              <Link href="/ikenga" style={footerLinkStyle}>Ikenga</Link>
              <Link href="/ask-ujris" style={footerLinkStyle}>Ask UJRIS</Link>
            </nav>
          </div>
          <div>
            <p style={footerHeadingStyle}>Account</p>
            <nav style={footerNavStyle}>
              <Link href="/payment" style={footerLinkStyle}>Get Access</Link>
              <Link href="/admin/diagnostics" style={footerLinkStyle}>Diagnostics</Link>
            </nav>
          </div>
        </div>
        <div style={footerBottomStyle}>
          <p style={copyrightStyle}>
            © 2026 UJU GROUP LIMITED. FORTIS OS™, UJU CYCLE™, IKENGA™, ASK UJRIS™ are trademarks of UJU GROUP LIMITED.
          </p>
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
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "3rem 1.25rem 1.5rem",
};

const footerGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  gap: "2rem",
};

const footerBrandStyle: React.CSSProperties = {
  margin: 0,
  fontWeight: 800,
  fontSize: "1.1rem",
  letterSpacing: "0.08em",
  color: "var(--color-secondary)",
};

const footerTaglineStyle: React.CSSProperties = {
  margin: "0.6rem 0 0",
  fontSize: "0.86rem",
  color: "rgba(255,255,255,0.72)",
  maxWidth: "28ch",
  lineHeight: 1.6,
};

const footerHeadingStyle: React.CSSProperties = {
  margin: "0 0 0.75rem",
  fontWeight: 700,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-secondary)",
};

const footerNavStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const footerLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "rgba(255,255,255,0.8)",
  fontSize: "0.9rem",
};

const footerBottomStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.15)",
  marginTop: "2rem",
  paddingTop: "1.25rem",
};

const copyrightStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  color: "rgba(255,255,255,0.55)",
  lineHeight: 1.7,
};
