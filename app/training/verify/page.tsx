"use client";
// app/training/verify/page.tsx
// Public certificate verification page
import { useState } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

export default function VerifyCertificatePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; message: string; hash?: string; checkedAt?: string } | null>(null);

  async function handleVerify() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/training/verify?hash=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, message: "Verification service unavailable. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, padding: "2.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: "0.75rem" }}>🏅</div>
        <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800 }}>
          Certificate Verification
        </h1>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>
          Verify any FORTIS Digital Skills Certificate instantly
        </p>
      </header>

      <div style={{ maxWidth: 560, margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem" }}>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: DARK, marginBottom: "0.5rem" }}>
            Certificate Hash or Number
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. FORTIS-2026-12345 or SHA-256 hash"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: "1.5px solid #D1D5DB",
              fontSize: "0.9rem",
              fontFamily: "inherit",
              boxSizing: "border-box",
              outline: "none",
              marginBottom: "1rem",
            }}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          />
          <button
            onClick={handleVerify}
            disabled={loading || !input.trim()}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: loading ? "#9CA3AF" : `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`,
              color: WHITE,
              border: "none",
              borderRadius: 8,
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {loading ? "⏳ Verifying…" : "🔍 Verify Certificate"}
          </button>

          {result && (
            <div style={{
              marginTop: "1.25rem",
              background: result.valid ? "#D1FAE5" : "#FEE2E2",
              border: `1px solid ${result.valid ? "#6EE7B7" : "#FECACA"}`,
              borderRadius: 10,
              padding: "1rem 1.25rem",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{result.valid ? "✅" : "❌"}</div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: result.valid ? "#065F46" : "#991B1B", marginBottom: "0.3rem" }}>
                {result.valid ? "Certificate Valid" : "Certificate Not Found"}
              </div>
              <div style={{ fontSize: "0.82rem", color: result.valid ? "#065F46" : "#991B1B", lineHeight: 1.5 }}>
                {result.message}
              </div>
              {result.checkedAt && (
                <div style={{ fontSize: "0.72rem", color: "#6B7280", marginTop: "0.5rem" }}>
                  Checked at: {new Date(result.checkedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: "1.5rem", background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "1.25rem" }}>
          <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", fontWeight: 700, color: DARK }}>About FORTIS Certificates</h3>
          <ul style={{ margin: 0, padding: "0 0 0 1.1rem" }}>
            {[
              "Each certificate has a unique ID in the format FORTIS-YYYY-XXXXX",
              "Certificates are SHA-256 hashed for tamper-evidence",
              "AI-proctored assessments ensure credibility",
              "Issued by UJU GROUP LIMITED, Gambia",
              "Recognised by partner employers across the region",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "0.8rem", color: "#4B5563", marginBottom: "0.4rem", lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="/training/hub" style={{ fontSize: "0.82rem", color: PRIMARY, fontWeight: 600, textDecoration: "none" }}>
            ← Back to Digital Skills Hub
          </a>
        </div>
      </div>
    </div>
  );
}
