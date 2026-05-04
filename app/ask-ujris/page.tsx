"use client";

import { useState } from "react";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

const DOC_TYPES = [
  "Employment Contract",
  "Lease / Tenancy Agreement",
  "Loan Agreement",
  "Service Agreement",
  "Supplier Contract",
  "Partnership Agreement",
  "Government Tender Document",
  "MOU / Memorandum of Understanding",
  "Non-Disclosure Agreement (NDA)",
  "Share Purchase / Investment Agreement",
  "Other",
];

interface Analysis {
  integrityScore: number;
  redFlags: string[];
  recommendations: string[];
  summary: string;
}

interface ApiResponse {
  ok: boolean;
  analysis?: Analysis;
  legalDisclaimer?: string;
  error?: string;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const label = score >= 70 ? "Low Risk" : score >= 40 ? "Moderate Risk" : "High Risk";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        border: `6px solid ${color}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "#fff",
      }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: "0.55rem", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>/ 100</span>
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

export default function AskUJRISPage() {
  const [docText, setDocText] = useState("");
  const [docType, setDocType] = useState("");
  const [concern, setConcern] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const charCount = docText.length;
  const wordCount = docText.trim() ? docText.trim().split(/\s+/).length : 0;

  async function handleAnalyse() {
    if (!docText.trim()) { setError("Please paste document text before analysing."); return; }
    if (docText.trim().length < 50) { setError("Document text is too short for meaningful analysis (minimum 50 characters)."); return; }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ask-ujris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: docText, documentType: docType || undefined, concern: concern || undefined }),
      });
      const data = await res.json() as ApiResponse;
      if (!res.ok || !data.ok) {
        setError(data.error || "Analysis failed. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setDocText(""); setDocType(""); setConcern(""); setResult(null); setError(null);
  }

  const analysis = result?.analysis;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <div style={{ background: `linear-gradient(135deg, ${DARK}, ${G})`, padding: "3rem 1.5rem 2.5rem", borderBottom: `2px solid ${GOLD}40` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}50`, borderRadius: 999, padding: "4px 14px", fontSize: "0.72rem", fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              AI Tool
            </div>
            <div style={{ background: "#FEF3C720", border: "1px solid #FCD34D50", borderRadius: 999, padding: "4px 12px", fontSize: "0.72rem", fontWeight: 700, color: "#FCD34D", letterSpacing: "0.08em" }}>
              Beta
            </div>
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "#fff" }}>
            ASK UJRIS™
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", maxWidth: "55ch", lineHeight: 1.65 }}>
            Forensic document analyser. Paste any business or legal document to get an integrity score, red flag analysis, and action recommendations.
          </p>
          <div style={{ marginTop: "1rem", background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "0.6rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}>
            ⚠️ <strong style={{ color: "rgba(255,255,255,0.85)" }}>Legal disclaimer:</strong> ASK UJRIS outputs are analytical indicators only — not legal advice. Consult a qualified lawyer before signing, rejecting, or litigating any contract.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                Document Type
              </label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "0.85rem", color: "#374151", background: "#fff", fontFamily: "inherit" }}
              >
                <option value="">Select type (optional)</option>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                Your Concern (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. unfair termination clause, hidden fees…"
                value={concern}
                onChange={e => setConcern(e.target.value)}
                style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "0.85rem", color: "#374151", fontFamily: "inherit", boxSizing: "border-box" as const }}
              />
            </div>
          </div>

          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
            Document Text *
          </label>
          <textarea
            value={docText}
            onChange={e => setDocText(e.target.value)}
            placeholder="Paste the full text of the document here. You can paste directly from a PDF, Word document, or email…"
            rows={12}
            style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: `1px solid ${docText.length > 0 ? G + "60" : "#d1d5db"}`, fontSize: "0.85rem", color: "#374151", fontFamily: "'DM Sans', system-ui, sans-serif", resize: "vertical" as const, lineHeight: 1.6, boxSizing: "border-box" as const, outline: "none" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: "0.75rem", color: "#9ca3af" }}>
            <span>{wordCount.toLocaleString()} words · {charCount.toLocaleString()} characters</span>
            {charCount > 0 && <button onClick={handleClear} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "0.75rem", padding: 0 }}>Clear ×</button>}
          </div>

          {error && (
            <div style={{ marginTop: 12, background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.83rem", color: "#be123c" }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button
              onClick={handleAnalyse}
              disabled={loading || !docText.trim()}
              style={{
                background: loading || !docText.trim() ? "#d1d5db" : `linear-gradient(135deg, ${DARK}, ${G})`,
                color: "#fff", border: "none", borderRadius: 10, padding: "0.75rem 1.75rem",
                fontSize: "0.9rem", fontWeight: 700, cursor: loading || !docText.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
                transition: "opacity 0.15s",
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                  Analysing…
                </>
              ) : "Analyse Document →"}
            </button>
          </div>
        </div>

        {analysis && (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "1.5rem", display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" as const }}>
              <ScoreRing score={analysis.integrityScore} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>Document Summary</div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#1a1a1a", lineHeight: 1.65, fontWeight: 500 }}>{analysis.summary}</p>
                {result?.legalDisclaimer && (
                  <p style={{ margin: "8px 0 0", fontSize: "0.75rem", color: "#9ca3af", lineHeight: 1.5 }}>{result.legalDisclaimer}</p>
                )}
              </div>
            </div>

            {analysis.redFlags && analysis.redFlags.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #FECDD3", padding: "1.5rem" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "0.9rem", fontWeight: 800, color: "#be123c", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>⚠️</span> Red Flags ({analysis.redFlags.length})
                </h3>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  {analysis.redFlags.map((flag, i) => (
                    <li key={i} style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #86EFAC", padding: "1.5rem" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "0.9rem", fontWeight: 800, color: "#166534", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>✅</span> Recommendations ({analysis.recommendations.length})
                </h3>
                <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>{rec}</li>
                  ))}
                </ol>
              </div>
            )}

            <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 10, padding: "1rem 1.25rem", fontSize: "0.82rem", color: "#92400E" }}>
              <strong>⚠️ Important:</strong> This AI analysis is not legal advice. Do not sign, reject, or litigate a contract solely based on this output. Consult a qualified lawyer — especially for high-value or legally complex documents.
            </div>
          </div>
        )}

        <div style={{ marginTop: "3rem", background: "#fff", border: `1px solid ${G}20`, borderRadius: 12, padding: "1.25rem 1.5rem" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "0.85rem", fontWeight: 800, color: G }}>What ASK UJRIS analyses</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {[
              ["Integrity Score", "0–100 document fairness rating"],
              ["Unfair Clauses", "Non-compete, penalty, and liability traps"],
              ["Missing Protections", "Omissions that disadvantage the signing party"],
              ["Jurisdiction Risk", "Gambian law compliance indicators"],
              ["Termination Terms", "Exit conditions and notice period analysis"],
              ["Dispute Resolution", "Arbitration, governing law, forum clauses"],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: "#f8fafc", borderRadius: 8, padding: "0.75rem 1rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", color: G, marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
