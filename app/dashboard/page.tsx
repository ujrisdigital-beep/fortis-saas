import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
      <section className="fortis-card" style={{ padding: "1.25rem" }}>
        <p style={{ color: "var(--fortis-accent)", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem" }}>FORTIS OPERATIONS</p>
        <h1 style={{ marginTop: "0.4rem", fontSize: "2rem" }}>Authenticated Dashboard</h1>
        <p style={{ color: "var(--fortis-text-secondary)", marginTop: "0.5rem" }}>
          Entry point into the secure Fortis operating platform.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <Link href="/board/dashboard" style={primaryLink}>Board Dashboard</Link>
          <Link href="/funding" style={secondaryLink}>Funding Hub</Link>
          <Link href="/investors" style={secondaryLink}>Investor Hub</Link>
          <Link href="/payments" style={secondaryLink}>Payments Hub</Link>
        </div>
      </section>

      {/* ── NEW MODULES ─────────────────────────────────────────── */}
      <section className="fortis-card" style={{ padding: "1.25rem", marginTop: "1rem" }}>
        <p style={{ color: "var(--fortis-accent)", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.72rem", margin: "0 0 0.75rem" }}>
          CONTENT & GROWTH SUITE
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/brands" style={secondaryLink}>🏷 Brands</Link>
          <Link href="/content" style={secondaryLink}>⚡ Chi Engine</Link>
          <Link href="/inbox" style={secondaryLink}>📬 Unified Inbox</Link>
          <Link href="/guarantee" style={secondaryLink}>🛡 Success Guarantee</Link>
        </div>
      </section>
    </main>
  );
}

const primaryLink = {
  background: "#C9A84C",
  color: "#112419",
  padding: "0.7rem 0.95rem",
  borderRadius: "0.5rem",
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryLink = {
  border: "1px solid rgba(201,168,76,0.4)",
  color: "#F5F0E8",
  padding: "0.7rem 0.95rem",
  borderRadius: "0.5rem",
  textDecoration: "none",
  fontWeight: 600,
};
