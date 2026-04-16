import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { grantsDatabase } from "../../data/grants-database";

function amountLabel(min: number, max: number, currency: string) {
  return `${currency} ${min.toLocaleString()} – ${currency} ${max.toLocaleString()}`;
}

function MatchRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 26;
  const circ = 2 * Math.PI * r;
  const fill = (clamped / 100) * circ;
  const color = clamped >= 80 ? "#10B981" : clamped >= 60 ? "#D4AF37" : "#E63946";
  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }} aria-label={`Match ${clamped}%`}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ - fill}`}
          transform="rotate(-90 36 36)"
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontWeight: 800, fontSize: "1rem", color, lineHeight: 1 }}>{clamped}</span>
        <span style={{ fontSize: "0.6rem", color: "#64748B", letterSpacing: "0.04em" }}>%</span>
      </div>
    </div>
  );
}

const priorityColors: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: "#dcfce7", text: "#065f46" },
  MEDIUM: { bg: "#fef3c7", text: "#92400e" },
  LOW: { bg: "#f1f5f9", text: "#475569" },
};

export default function FundingPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#1B4D3E" }}>
            FUNDING HUB
          </p>
          <h1 style={{ margin: "0.4rem 0 0.75rem", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "#0A1C2E" }}>
            Grant Intelligence Engine
          </h1>
          <p style={{ margin: 0, color: "#64748B", maxWidth: "60ch", lineHeight: 1.7 }}>
            Grant opportunities pre-scored for Fortis strategic fit. Click any grant to generate a full, institution-aligned application with AI assistance.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem", padding: "1rem 1.25rem", background: "var(--color-primary)", borderRadius: "0.75rem" }}>
          {[
            { label: "Active Grants", value: grantsDatabase.length },
            { label: "High Priority", value: grantsDatabase.filter(g => g.priority === "HIGH").length },
            { label: "Avg Match Score", value: Math.round(grantsDatabase.reduce((s, g) => s + g.fortisEligibilityScore, 0) / grantsDatabase.length) + "%" },
          ].map(s => (
            <div key={s.label}>
              <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#D4AF37" }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grant cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.25rem" }}>
          {grantsDatabase.map((grant) => {
            const pc = priorityColors[grant.priority] ?? priorityColors.LOW;
            return (
              <article key={grant.id} style={{
                background: "#FFFFFF", border: "1.5px solid #E2E8F0",
                borderLeft: "4px solid #D4AF37", borderRadius: "0.85rem",
                padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem",
                boxShadow: "0 2px 10px rgba(10,28,46,0.05)",
              }}>
                {/* Title row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "#1B4D3E", lineHeight: 1.3 }}>
                      {grant.title}
                    </h2>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.84rem", color: "#64748B", fontWeight: 600 }}>
                      {grant.funder}
                    </p>
                  </div>
                  <MatchRing score={grant.fortisEligibilityScore} />
                </div>

                <p style={{ margin: 0, color: "#0A1C2E", fontSize: "0.88rem", lineHeight: 1.65 }}>
                  {grant.description}
                </p>

                {/* Meta */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.82rem" }}>
                  <div>
                    <p style={{ margin: 0, color: "#64748B", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Deadline</p>
                    <p style={{ margin: "0.15rem 0 0", fontWeight: 700, color: "#0A1C2E" }}>{grant.deadline}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: "#64748B", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount</p>
                    <p style={{ margin: "0.15rem 0 0", fontWeight: 700, color: "#0A1C2E" }}>{amountLabel(grant.amountMin, grant.amountMax, grant.currency)}</p>
                  </div>
                </div>

                {/* Priority + Match label */}
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: pc.bg, color: pc.text }}>
                    {grant.priority} PRIORITY
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#D4AF37", fontWeight: 700 }}>
                    {grant.fortisEligibilityScore}% Match
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748B", fontStyle: "italic" }}>
                  {grant.fitAnalysis}
                </p>

                <Link
                  href={`/funding/${grant.id}/apply`}
                  style={{
                    display: "block", textAlign: "center", padding: "0.75rem",
                    borderRadius: "0.55rem", textDecoration: "none",
                    fontWeight: 700, fontSize: "0.9rem",
                    background: "var(--color-primary)", color: "#FFFFFF",
                    marginTop: "auto",
                  }}
                >
                  Generate Full Application →
                </Link>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
