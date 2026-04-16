"use client";

import { useState } from "react";

export default function InvestorsPage() {
  const [pack, setPack] = useState("");
  const [loading, setLoading] = useState(false);

  async function generatePack() {
    setLoading(true);
    setPack("");

    const response = await fetch("/api/ai/generate-investor-pack", { method: "POST" });
    if (!response.body) {
      setPack("Failed to generate investor pack.");
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        if (!event.startsWith("data: ")) {
          continue;
        }
        const payload = event.slice(6).trim();
        if (payload === "[DONE]") {
          continue;
        }
        const parsed = JSON.parse(payload) as { chunk?: string };
        if (parsed.chunk) {
          setPack((prev) => prev + parsed.chunk);
        }
      }
    }

    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem", display: "grid", gap: "1rem" }}>
      <section className="fortis-card" style={{ padding: "1.25rem" }}>
        <p style={{ color: "var(--fortis-accent)", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem" }}>INVESTOR RELATIONS</p>
        <h1 style={{ marginTop: "0.4rem", fontSize: "2rem" }}>Investor Hub</h1>
        <p style={{ color: "var(--fortis-text-secondary)", marginTop: "0.5rem" }}>
          Fortis traction, capital narrative, and funding ask in one secure workspace.
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0.9rem" }}>
        <article className="fortis-card" style={{ padding: "1rem" }}><strong>$200M+</strong><div style={{ color: "var(--fortis-text-secondary)" }}>Import gap opportunity</div></article>
        <article className="fortis-card" style={{ padding: "1rem" }}><strong>8 Verticals</strong><div style={{ color: "var(--fortis-text-secondary)" }}>Integrated business engines</div></article>
        <article className="fortis-card" style={{ padding: "1rem" }}><strong>2 Active Partners</strong><div style={{ color: "var(--fortis-text-secondary)" }}>MannerInsect and BFB</div></article>
        <article className="fortis-card" style={{ padding: "1rem" }}><strong>3.4M USD</strong><div style={{ color: "var(--fortis-text-secondary)" }}>Current grant pipeline</div></article>
      </section>

      <section className="fortis-card" style={{ padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>AI Investor Pack</h2>
          <button onClick={generatePack} style={{ border: "none", background: "#C9A84C", color: "#112419", padding: "0.65rem 0.9rem", borderRadius: "0.5rem", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Generating..." : "Generate Investor Pack"}
          </button>
        </div>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", color: "#F5F0E8", marginTop: "1rem", minHeight: 240 }}>{pack || "No investor pack generated yet."}</pre>
      </section>

      <section className="fortis-card" style={{ padding: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>Request Meeting</h2>
        <a href="mailto:ceo@fortisinvicta.com?subject=Fortis%20Investor%20Meeting%20Request&body=Name%3A%0AOrganisation%3A%0AInvestment%20Range%3A%0AFocus%20Area%3A%0AMessage%3A" style={{ textDecoration: "none", color: "#112419", background: "#C9A84C", padding: "0.7rem 0.95rem", borderRadius: "0.5rem", fontWeight: 700, display: "inline-block" }}>Open Meeting Request Email</a>
      </section>
    </main>
  );
}
