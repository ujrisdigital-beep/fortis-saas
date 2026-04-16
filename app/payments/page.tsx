import { financialInstitutions, securityPrinciples } from "../../data/gambia-financial-institutions";

export default function PaymentsPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1rem" }}>
      <section className="fortis-card" style={{ padding: "1.25rem" }}>
        <p style={{ color: "var(--fortis-accent)", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem" }}>PAYMENTS & SECURITY</p>
        <h1 style={{ marginTop: "0.4rem", fontSize: "2rem" }}>Gambian Payment Rails & Data Security</h1>
        <p style={{ color: "var(--fortis-text-secondary)", marginTop: "0.5rem" }}>
          Recommended institutions for collections and payouts, with the security controls Fortis should enforce from day one.
        </p>
      </section>

      <section className="fortis-card" style={{ padding: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>Recommended Institutions</h2>
        <div style={{ display: "grid", gap: "0.8rem" }}>
          {financialInstitutions.map((institution) => (
            <article key={institution.name} style={{ padding: "0.9rem", borderRadius: "0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <strong>{institution.name}</strong>
                  <div style={{ color: "var(--fortis-text-secondary)", fontSize: "0.9rem", marginTop: "0.2rem" }}>{institution.category} · {institution.role}</div>
                </div>
                <div style={{ color: institution.fit === "HIGH" ? "#10B981" : "#C9A84C", fontWeight: 700 }}>{institution.fit} FIT</div>
              </div>
              <div style={{ marginTop: "0.55rem", color: "var(--fortis-text-secondary)", fontSize: "0.9rem" }}>
                <strong>Use cases:</strong> {institution.useCases.join(", ")}
              </div>
              <div style={{ marginTop: "0.35rem", color: "var(--fortis-text-secondary)", fontSize: "0.9rem" }}>
                <strong>Notes:</strong> {institution.notes}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "1rem" }}>
        <div className="fortis-card" style={{ padding: "1rem" }}>
          <h2 style={{ marginTop: 0 }}>Recommended Processing Architecture</h2>
          <ol style={{ color: "var(--fortis-text-secondary)", lineHeight: 1.7, paddingLeft: "1.2rem" }}>
            <li>Use Stripe for international investors, diaspora contributions, and external subscriptions.</li>
            <li>Use Ecobank Gambia as the core settlement and treasury account.</li>
            <li>Use QMoney and Africell Money for agent collections and field payouts.</li>
            <li>Introduce Trust Bank or GTBank as secondary banking redundancy.</li>
            <li>Keep reconciliation in the SaaS backend, never in browser-only logic.</li>
          </ol>
        </div>
        <div className="fortis-card" style={{ padding: "1rem" }}>
          <h2 style={{ marginTop: 0 }}>Absolute Security Controls</h2>
          <ul style={{ color: "var(--fortis-text-secondary)", lineHeight: 1.7, paddingLeft: "1.2rem" }}>
            {securityPrinciples.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
