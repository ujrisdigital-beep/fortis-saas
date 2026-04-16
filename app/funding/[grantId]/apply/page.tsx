"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "../../../../components/navbar";
import { Footer } from "../../../../components/footer";
import { grantsDatabase } from "../../../../data/grants-database";

const WATERMARK = "\n\n---\n[FORTIS OS™ | UJU GROUP LIMITED | Confidential Draft — Not for Distribution]\n";

export default function GrantApplyPage() {
  const params = useParams<{ grantId: string }>();
  const grant = useMemo(() => grantsDatabase.find((g) => g.id === params.grantId), [params.grantId]);

  // Form fields
  const [orgName, setOrgName] = useState("Fortis Invicta Ltd");
  const [orgMission, setOrgMission] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [targetBeneficiaries, setTargetBeneficiaries] = useState("");
  const [expectedOutcomes, setExpectedOutcomes] = useState("");
  const [budgetOutline, setBudgetOutline] = useState("");
  const [implementationTimeline, setImplementationTimeline] = useState("");
  const [previousWork, setPreviousWork] = useState("");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setError("");
    setOutput("");

    if (!projectDescription || !budgetOutline) {
      setError("Project description and budget outline are required.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate-grant-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grantId: params.grantId,
          grantTitle: grant?.title,
          funder: grant?.funder,
          requirements: grant?.requirements,
          amountRange: grant ? `${grant.currency} ${grant.amountMin.toLocaleString()} – ${grant.currency} ${grant.amountMax.toLocaleString()}` : "",
          orgName,
          orgMission,
          projectTitle,
          projectDescription,
          targetBeneficiaries,
          expectedOutcomes,
          budgetOutline,
          implementationTimeline,
          previousWork,
        }),
      });

      if (!res.ok || !res.body) {
        setError("Generation failed. Please try again.");
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          if (!event.startsWith("data: ")) continue;
          const payload = event.slice(6).trim();
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload) as { chunk?: string };
            if (parsed.chunk) setOutput((prev) => prev + parsed.chunk);
          } catch { /* skip malformed */ }
        }
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output + WATERMARK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function exportEmail() {
    const subject = encodeURIComponent(`Grant Application — ${grant?.title ?? params.grantId}`);
    const body = encodeURIComponent((output + WATERMARK).slice(0, 2000));
    window.location.href = `mailto:ceo@fortisinvicta.com?subject=${subject}&body=${body}`;
  }

  function downloadPdf() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>${grant?.title} Application</title>
      <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 2rem auto; padding: 2rem; color: #0A1C2E; line-height: 1.8; }
        h1 { color: #1B4D3E; } pre { white-space: pre-wrap; font-family: inherit; font-size: 1rem; }
        .watermark { margin-top: 3rem; font-size: 0.75rem; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 1rem; }
      </style></head><body>
      <h1>${grant?.title ?? "Grant Application"}</h1>
      <p><strong>Funder:</strong> ${grant?.funder}</p>
      <pre>${output}</pre>
      <div class="watermark">FORTIS OS™ | UJU GROUP LIMITED | Generated ${new Date().toLocaleDateString()} | Confidential Draft</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  }

  if (!grant) {
    return (
      <>
        <Navbar />
        <main style={{ padding: "4rem 1.25rem", textAlign: "center" }}>
          <h2 style={{ color: "var(--color-text)" }}>Grant not found</h2>
          <a href="/funding" style={{ color: "var(--color-primary)", fontWeight: 700 }}>← Back to Funding Hub</a>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <a href="/funding" style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>← Back to Funding Hub</a>
          <p style={{ margin: "1rem 0 0", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--color-primary)" }}>APPLICATION BUILDER</p>
          <h1 style={{ margin: "0.3rem 0 0.5rem", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "var(--color-text)" }}>{grant.title}</h1>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>{grant.funder} · Deadline: <strong>{grant.deadline}</strong> · Match: <strong style={{ color: "var(--color-secondary)" }}>{grant.fortisEligibilityScore}%</strong></p>
        </div>

        {/* Requirements callout */}
        <div style={{ padding: "1rem 1.25rem", background: "rgba(27,77,62,0.06)", border: "1px solid rgba(27,77,62,0.2)", borderRadius: "0.6rem", marginBottom: "1.5rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontWeight: 700, fontSize: "0.88rem", color: "var(--color-primary)" }}>Funder Requirements</p>
          <ul style={{ margin: 0, padding: "0 0 0 1.1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {grant.requirements.map((r, i) => <li key={i} style={{ fontSize: "0.88rem", color: "var(--color-text)" }}>{r}</li>)}
          </ul>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
          {/* Form */}
          <section style={{ background: "#FFFFFF", border: "1.5px solid var(--color-border)", borderRadius: "0.85rem", padding: "1.75rem" }}>
            <h2 style={{ margin: "0 0 1.25rem", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>Application Details</h2>
            <div style={formGridStyle}>
              <Field label="Organisation Name *" value={orgName} onChange={setOrgName} placeholder="e.g. Fortis Invicta Ltd" />
              <Field label="Organisation Mission" value={orgMission} onChange={setOrgMission} placeholder="Brief mission statement" />
              <Field label="Project Title *" value={projectTitle} onChange={setProjectTitle} placeholder="A compelling title for this grant" />
              <Field label="Target Beneficiaries" value={targetBeneficiaries} onChange={setTargetBeneficiaries} placeholder="Who will benefit? How many?" />
            </div>
            <TextArea label="Project Description *" value={projectDescription} onChange={setProjectDescription} rows={6} placeholder={`Describe the project in detail. Address the funder's requirements:\n${grant.requirements.join(", ")}`} />
            <TextArea label="Expected Outcomes & Impact" value={expectedOutcomes} onChange={setExpectedOutcomes} rows={4} placeholder="What measurable outcomes will be achieved?" />
            <TextArea label="Budget Outline (${grant.currency})" value={budgetOutline} onChange={setBudgetOutline} rows={5} placeholder={`Breakdown of costs. Total range: ${grant.currency} ${grant.amountMin.toLocaleString()} – ${grant.currency} ${grant.amountMax.toLocaleString()}`} />
            <TextArea label="Implementation Timeline" value={implementationTimeline} onChange={setImplementationTimeline} rows={3} placeholder="Month-by-month plan" />
            <TextArea label="Previous Relevant Work" value={previousWork} onChange={setPreviousWork} rows={3} placeholder="Track record, past projects, evidence of capability" />

            {error && <p style={errorStyle}>{error}</p>}

            <button
              type="button"
              className="btn-primary"
              onClick={generate}
              disabled={loading || !projectDescription || !budgetOutline}
              style={{ minWidth: "240px", marginTop: "0.5rem" }}
            >
              {loading ? <><span className="spinner" /> Generating Application...</> : "Generate Full Application →"}
            </button>
          </section>

          {/* Output */}
          {(output || loading) && (
            <section style={{ background: "#FFFFFF", border: "1.5px solid var(--color-border)", borderRadius: "0.85rem", padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>Generated Application Draft</h2>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button type="button" onClick={handleCopy} style={outlineBtnStyle}>{copied ? "Copied!" : "Copy with Watermark"}</button>
                  <button type="button" onClick={exportEmail} style={outlineBtnStyle}>📧 Email Draft</button>
                  <button type="button" onClick={downloadPdf} style={outlineBtnStyle}>🖨️ Print / PDF</button>
                </div>
              </div>
              <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", borderRadius: "0.6rem", padding: "1.25rem" }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", fontSize: "0.92rem", color: "var(--color-text)", lineHeight: 1.8 }}>{output}</pre>
                {output && <p style={watermarkStyle}>FORTIS OS™ | UJU GROUP LIMITED | Confidential Draft — Not for Distribution</p>}
              </div>
              {output && (
                <p style={{ margin: "0.75rem 0 0", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                  This draft was generated by AI and should be reviewed and edited before submission. The watermark is automatically added to all copies except official submissions.
                </p>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)" }}>{label}</label>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} className="fortis-input"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows: number; placeholder?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem" }}>
      <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text)" }}>{label}</label>
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)}
        rows={rows} placeholder={placeholder}
        className="fortis-textarea"
      />
    </div>
  );
}

const formGridStyle: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1rem",
};
const errorStyle: React.CSSProperties = {
  padding: "0.75rem 1rem", background: "rgba(230,57,70,0.08)",
  border: "1px solid rgba(230,57,70,0.25)", borderRadius: "0.5rem",
  color: "#991b1b", fontSize: "0.88rem", marginBottom: "0.75rem",
};
const outlineBtnStyle: React.CSSProperties = {
  border: "1.5px solid var(--color-border)", borderRadius: "0.5rem",
  padding: "0.5rem 0.85rem", background: "#FFFFFF",
  color: "var(--color-text)", fontWeight: 600, fontSize: "0.82rem",
  cursor: "pointer", fontFamily: "inherit",
};
const watermarkStyle: React.CSSProperties = {
  marginTop: "1.5rem", paddingTop: "0.75rem",
  borderTop: "1px solid var(--color-border)",
  fontSize: "0.72rem", color: "var(--color-text-muted)",
  fontFamily: "monospace",
};
