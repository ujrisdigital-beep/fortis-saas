"use client";

import { useState } from "react";

export function AskUjrisFab() {
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState("Contract");
  const [concern, setConcern] = useState("");
  const [docText, setDocText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    integrityScore: number;
    redFlags: string[];
    recommendations: string[];
    summary: string;
  }>(null);
  const [error, setError] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => setDocText(String(reader.result ?? ""));
      reader.readAsText(file);
    } else {
      setDocText((prev) => prev || `[Uploaded: ${file.name} — paste key clauses below for analysis]`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docText.trim()) { setError("Please paste document text or upload a .txt file."); return; }
    setError("");
    setLoading(true);
    setResult(null);

    // Save to localStorage for offline sync
    const offlineKey = `offline_ujris_${Date.now()}`;
    localStorage.setItem(offlineKey, JSON.stringify({ docType, concern, docText }));

    try {
      const res = await fetch("/api/ask-ujris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: docType, concern, documentText: docText }),
      });
      const data = await res.json();
      const analysis = data.analysis ?? data;
      setResult({
        integrityScore: analysis.integrityScore ?? analysis.scores?.integrityScore ?? 0,
        redFlags: analysis.redFlags ?? analysis.flaggedClauses ?? [],
        recommendations: analysis.recommendations ?? analysis.recommendedActions ?? [],
        summary: analysis.summary ?? "",
      });
      localStorage.removeItem(offlineKey);
    } catch {
      setError("Analysis failed. Your submission has been saved offline and will sync when reconnected.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={fabStyle}
        aria-label="Open Ask UJRIS document analyzer"
      >
        Ask UJRIS
      </button>

      {open && (
        <div style={overlayStyle} onClick={() => setOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Ask UJRIS Analyzer">
            <div style={modalHeaderStyle}>
              <div>
                <p style={modalEyebrowStyle}>ASK UJRIS</p>
                <h2 style={modalTitleStyle}>Forensic Document Analyzer</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} style={closeStyle} aria-label="Close">✕</button>
            </div>

            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={rowStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="fortis-input"
                  >
                    <option>Contract</option>
                    <option>Agreement</option>
                    <option>Letter of Intent</option>
                    <option>Policy Document</option>
                    <option>Employment Contract</option>
                    <option>MOU</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Your Main Concern</label>
                  <input
                    type="text"
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    placeholder="e.g. Payment terms, ownership rights"
                    className="fortis-input"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Upload Document</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFile}
                  className="fortis-input"
                  style={{ paddingTop: "0.55rem" }}
                />
                {fileName && <p style={fileNameStyle}>Loaded: {fileName}</p>}
              </div>

              <div>
                <label style={labelStyle}>Paste Document Text</label>
                <textarea
                  value={docText}
                  onChange={(e) => setDocText(e.target.value)}
                  placeholder="Paste contract clauses, key terms, or the full document text here..."
                  rows={6}
                  className="fortis-textarea"
                />
              </div>

              {error && <p style={errorStyle}>{error}</p>}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%" }}>
                {loading ? <><span className="spinner" /> Analyzing...</> : "Analyze Document"}
              </button>
            </form>

            {result && (
              <div style={resultWrapStyle}>
                <div style={scoreRowStyle}>
                  <div className="score-badge" style={getScoreStyle(result.integrityScore)}>
                    {result.integrityScore}
                  </div>
                  <div>
                    <p style={scoreLabelStyle}>Integrity Score</p>
                    <p style={summaryStyle}>{result.summary}</p>
                  </div>
                </div>

                {result.redFlags.length > 0 && (
                  <div style={resultBlockStyle}>
                    <p style={resultBlockLabelStyle}>Red Flags</p>
                    <ul style={listStyle}>
                      {result.redFlags.map((flag, i) => (
                        <li key={i} style={redFlagItemStyle}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div style={resultBlockStyle}>
                    <p style={resultBlockLabelStyle}>Recommendations</p>
                    <ul style={listStyle}>
                      {result.recommendations.map((rec, i) => (
                        <li key={i} style={recItemStyle}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function getScoreStyle(score: number): React.CSSProperties {
  if (score >= 70) return { background: "rgba(16, 185, 129, 0.12)", borderColor: "#10B981", color: "#065f46", width: "4rem", height: "4rem", fontSize: "1.25rem" };
  if (score >= 45) return { background: "rgba(212, 175, 55, 0.12)", borderColor: "#D4AF37", color: "#92400e", width: "4rem", height: "4rem", fontSize: "1.25rem" };
  return { background: "rgba(230, 57, 70, 0.10)", borderColor: "#E63946", color: "#991b1b", width: "4rem", height: "4rem", fontSize: "1.25rem" };
}

const fabStyle: React.CSSProperties = {
  position: "fixed",
  right: "1.25rem",
  bottom: "1.5rem",
  zIndex: 1000,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.85rem 1.4rem",
  borderRadius: "999px",
  border: "none",
  background: "var(--color-primary)",
  color: "#FFFFFF",
  fontWeight: 800,
  fontSize: "0.92rem",
  letterSpacing: "0.03em",
  cursor: "pointer",
  boxShadow: "0 6px 24px rgba(27, 77, 62, 0.35)",
  fontFamily: "inherit",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 2000,
  background: "rgba(10, 28, 46, 0.55)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
};

const modalStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "1.25rem",
  width: "100%",
  maxWidth: "680px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "2rem",
  boxShadow: "0 24px 60px rgba(10, 28, 46, 0.22)",
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  marginBottom: "1.5rem",
};

const modalEyebrowStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--color-primary)",
};

const modalTitleStyle: React.CSSProperties = {
  margin: "0.2rem 0 0",
  fontSize: "1.4rem",
  fontWeight: 800,
  color: "var(--color-text)",
};

const closeStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "1.1rem",
  cursor: "pointer",
  color: "var(--color-text-muted)",
  padding: "0.25rem",
  lineHeight: 1,
  fontFamily: "inherit",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const rowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.75rem",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "var(--color-text)",
};

const fileNameStyle: React.CSSProperties = {
  margin: "0.35rem 0 0",
  fontSize: "0.8rem",
  color: "var(--color-primary)",
  fontWeight: 600,
};

const errorStyle: React.CSSProperties = {
  margin: 0,
  padding: "0.75rem 1rem",
  background: "rgba(230, 57, 70, 0.08)",
  border: "1px solid rgba(230, 57, 70, 0.25)",
  borderRadius: "0.5rem",
  color: "#991b1b",
  fontSize: "0.88rem",
};

const resultWrapStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  padding: "1.25rem",
  background: "var(--color-card-bg)",
  borderRadius: "0.75rem",
  border: "1px solid var(--color-border)",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const scoreRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const scoreLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-text-muted)",
};

const summaryStyle: React.CSSProperties = {
  margin: "0.3rem 0 0",
  fontSize: "0.92rem",
  color: "var(--color-text)",
  fontWeight: 500,
};

const resultBlockStyle: React.CSSProperties = {
  borderTop: "1px solid var(--color-border)",
  paddingTop: "0.75rem",
};

const resultBlockLabelStyle: React.CSSProperties = {
  margin: "0 0 0.5rem",
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--color-text-muted)",
};

const listStyle: React.CSSProperties = {
  margin: 0,
  padding: "0 0 0 1.1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
};

const redFlagItemStyle: React.CSSProperties = {
  fontSize: "0.88rem",
  color: "#991b1b",
};

const recItemStyle: React.CSSProperties = {
  fontSize: "0.88rem",
  color: "var(--color-text)",
};
