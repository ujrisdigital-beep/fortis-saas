"use client";
import { useState } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const SECTIONS = [
  {
    id: "1",
    title: "1. Ownership and Attribution",
    body: "All materials published on FORTIS OS are sourced from publicly available reports, datasets, and publications. Full attribution is provided to original sources including but not limited to: GBoS (Gambia Bureau of Statistics), NAWEC, World Bank, FAO, UNDP, TANGO, PURA, CBG, MoCDE, and respective authors. Copyright in original materials remains with the original rights holders. FORTIS OS makes no claim of ownership over third-party content reproduced for informational purposes.",
  },
  {
    id: "2",
    title: "2. Permitted Use",
    body: "Materials on this platform may be used for research, educational, and non-commercial purposes under the fair use provisions of the Gambia Copyright Act 2004. Reproduction of content for commercial purposes requires written permission from the original rights holder. Where materials are published under Creative Commons or Open Government Licence, those terms apply directly.",
  },
  {
    id: "3",
    title: "3. Data Protection — Gambia Data Protection Act 2018",
    body: "FORTIS OS operates in compliance with the Gambia Data Protection Act 2018 (GDPA 2018). No personal data is collected, stored, or processed without informed consent. All user account data is encrypted at rest using AES-256 standards. User data is not sold or shared with third parties. Access to personal data in law enforcement contexts requires a valid court order, processed through our verified court-order API. Aggregate analytics are fully anonymised and contain no personally identifiable information (PII).",
  },
  {
    id: "4",
    title: "4. Third-Party Content and APIs",
    body: "Some content and data displayed on FORTIS OS is sourced via third-party APIs including OpenAI, Global Forest Watch, GBoS Open Data, World Bank Open Data, GSMA Intelligence, and DataReportal. FORTIS OS does not guarantee the accuracy, completeness, or timeliness of third-party data. Users should verify critical information with original sources. External links are provided for reference only — FORTIS OS is not responsible for the content of external websites.",
  },
  {
    id: "5",
    title: "5. Disclaimer of Warranties",
    body: "FORTIS OS provides the platform and its content 'as is' without warranties of any kind, express or implied. Intelligence reports, AI-generated analysis, market data, and sector briefings are provided for informational purposes only and do not constitute legal, financial, investment, or professional advice. Users should seek qualified professional advice before making decisions based on any content on this platform.",
  },
  {
    id: "6",
    title: "6. UK GDPR Compliance (UJU GROUP LIMITED)",
    body: "UJU GROUP LIMITED is incorporated in England and Wales. As a UK-registered company, we process data in compliance with UK GDPR and the Data Protection Act 2018 (UK). Users in the UK have the right to access, correct, and erase their personal data. Data portability and objection rights apply. Our UK data protection contact is: legal@fortisos.co.uk.",
  },
  {
    id: "7",
    title: "7. Intellectual Property — FORTIS OS™",
    body: "FORTIS OS™, UJU CYCLE™, IKENGA™, ASK UJRIS™, FORTIS INVICTA™, and UJU GROUP™ are trademarks of UJU GROUP LIMITED. The FORTIS OS logo, Gambia Green design system (#1B4D3E), and proprietary AI architectures are protected intellectual property. Unauthorised reproduction of branding, UI components, or proprietary content constitutes infringement.",
  },
  {
    id: "8",
    title: "8. Reporting Copyright or Data Protection Concerns",
    body: "If you believe any material on FORTIS OS infringes copyright, violates data protection rights, or contains inaccurate attribution, please contact us immediately: legal@fortisos.co.uk (UK) · legal@fortisos.cloud (Gambia). We will investigate all valid notices within 5 business days and take appropriate action including removal, correction, or attribution update.",
  },
  {
    id: "9",
    title: "9. AI-Generated Content",
    body: "FORTIS OS uses large language models (LLMs), including OpenAI's GPT models and Anthropic Claude, to generate intelligence briefings, sector summaries, business analysis, and training content. AI-generated content is labelled where applicable and should not be treated as authoritative without independent verification. FORTIS OS applies human editorial review to AI outputs before publication where they relate to sensitive topics including legal, financial, health, or security matters. Users are encouraged to report factual inaccuracies via our feedback channel.",
  },
  {
    id: "10",
    title: "10. Governing Law and Jurisdiction",
    body: "These terms and all legal matters relating to FORTIS OS are governed by the laws of England and Wales in respect of UJU GROUP LIMITED's UK operations, and by the laws of the Republic of The Gambia in respect of FORTIS INVICTA's Gambian operations. Any disputes arising from use of this platform shall first be referred to mediation before any court proceedings. For Gambian matters, the Commercial Court of The Gambia has jurisdiction. For UK matters, the courts of England and Wales have jurisdiction.",
  },
];

const CITATION_TYPES = [
  { value: "report", label: "Report / Briefing" },
  { value: "dataset", label: "Dataset" },
  { value: "article", label: "Article" },
  { value: "tool", label: "AI Tool Output" },
];

function CitationGenerator() {
  const [form, setForm] = useState({ type: "report", title: "", section: "", date: new Date().toISOString().split("T")[0], author: "FORTIS OS" });
  const [citation, setCitation] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    const dateObj = new Date(form.date);
    const formatted = dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const year = dateObj.getFullYear();
    const url = "https://fortisos.cloud";

    let cite = "";
    if (form.type === "report" || form.type === "article") {
      cite = `${form.author} (${year}). ${form.title}${form.section ? ` — ${form.section}` : ""}. FORTIS OS. Retrieved ${formatted}, from ${url}`;
    } else if (form.type === "dataset") {
      cite = `${form.author}. (${year}). ${form.title} [Dataset]. FORTIS OS Data Platform. ${url} (accessed ${formatted})`;
    } else if (form.type === "tool") {
      cite = `${form.author}. (${year}). AI-generated output: ${form.title}${form.section ? ` [${form.section}]` : ""}. FORTIS OS Intelligence Suite. Generated ${formatted}. ${url}`;
    }
    setCitation(cite);
    setCopied(false);
  }

  function copy() {
    navigator.clipboard.writeText(citation).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  }

  return (
    <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginTop: "2rem" }}>
      <div style={{ background: PRIMARY, padding: "0.85rem 1.25rem" }}>
        <p style={{ margin: 0, color: WHITE, fontWeight: 700, fontSize: "0.88rem" }}>📎 Citation Generator</p>
        <p style={{ margin: "0.2rem 0 0", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>Generate APA-style citations for FORTIS OS content</p>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "0.85rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: DARK, marginBottom: "0.3rem" }}>Content Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1.5px solid #D1D5DB", borderRadius: 7, fontSize: "0.82rem", fontFamily: "inherit", boxSizing: "border-box" }}
            >
              {CITATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: DARK, marginBottom: "0.3rem" }}>Title / Report Name</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Gambia Telecom Sector Report"
              style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1.5px solid #D1D5DB", borderRadius: 7, fontSize: "0.82rem", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: DARK, marginBottom: "0.3rem" }}>Section (optional)</label>
            <input
              type="text"
              value={form.section}
              onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))}
              placeholder="e.g. Market Share Analysis"
              style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1.5px solid #D1D5DB", borderRadius: 7, fontSize: "0.82rem", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: DARK, marginBottom: "0.3rem" }}>Access Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1.5px solid #D1D5DB", borderRadius: 7, fontSize: "0.82rem", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>
        </div>
        <button
          onClick={generate}
          disabled={!form.title.trim()}
          style={{ padding: "0.65rem 1.4rem", background: form.title.trim() ? `linear-gradient(135deg, ${PRIMARY}, #2A6B52)` : "#9CA3AF", color: WHITE, border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.82rem", cursor: form.title.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}
        >
          Generate Citation
        </button>

        {citation && (
          <div style={{ marginTop: "1rem", background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0.85rem 1rem" }}>
            <p style={{ margin: "0 0 0.6rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9CA3AF" }}>APA Citation</p>
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#374151", lineHeight: 1.7, fontStyle: "italic" }}>{citation}</p>
            <button
              onClick={copy}
              style={{ padding: "0.45rem 1rem", background: copied ? "#22C55E" : PRIMARY, color: WHITE, border: "none", borderRadius: 7, fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DisclaimerPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`,
        padding: "2.5rem 1.5rem 2rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} />
          <div style={{ flex: 1, background: WHITE }} />
          <div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)", borderRadius: 999, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>Legal · Compliance</span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }}>
            📜 Copyright & Data Protection Notice
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", lineHeight: 1.6 }}>
            FORTIS OS · UJU GROUP LIMITED · Effective April 2026
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Quick nav */}
        <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "2rem" }}>
          <p style={{ margin: "0 0 0.6rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B7280" }}>Contents</p>
          <div style={{ display: "flex", gap: "0.4rem 1rem", flexWrap: "wrap" }}>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#section-${s.id}`} style={{ fontSize: "0.8rem", color: PRIMARY, textDecoration: "none", fontWeight: 600 }}>
                §{s.id}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {SECTIONS.map((s) => (
            <div key={s.id} id={`section-${s.id}`} style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "1.25rem 1.4rem", scrollMarginTop: 80 }}>
              <h2 style={{ margin: "0 0 0.6rem", fontSize: "0.95rem", fontWeight: 800, color: DARK }}>{s.title}</h2>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#374151", lineHeight: 1.75 }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* Citation generator */}
        <CitationGenerator />

        {/* Contact box */}
        <div style={{
          marginTop: "2rem",
          background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`,
          borderRadius: 12, padding: "1.5rem 1.75rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <p style={{ margin: "0 0 0.25rem", color: WHITE, fontWeight: 700, fontSize: "0.95rem" }}>Concerns or enquiries?</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.82rem" }}>
              legal@fortisos.co.uk (UK) · legal@fortisos.cloud (Gambia)
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <a href="mailto:legal@fortisos.co.uk" style={{ padding: "0.55rem 1rem", background: GOLD, color: DARK, borderRadius: 8, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}>
              Email Legal →
            </a>
          </div>
        </div>

        <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#9CA3AF", textAlign: "center" }}>
          © 2026 UJU GROUP LIMITED · Company registered in England and Wales · Gambia operations under GIEPA registration
        </p>
      </div>
    </div>
  );
}
