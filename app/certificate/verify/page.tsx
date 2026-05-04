"use client";

import { useState } from "react";
import Link from "next/link";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

// Sample certificates — in production these would be database records
const VALID_CERTIFICATES = [
  { id: "FORTIS-2024-001", name: "Digital Literacy Basics", recipient: "John Doe", date: "2024-01-15", issuer: "FORTIS OS Training Hub" },
  { id: "FORTIS-2024-002", name: "Cybersecurity Awareness", recipient: "Jane Smith", date: "2024-02-20", issuer: "FORTIS OS Training Hub" },
  { id: "FORTIS-2024-003", name: "Mobile Money & Fintech", recipient: "Amadou Bah", date: "2024-03-10", issuer: "FORTIS OS Training Hub" },
  { id: "FORTIS-2024-004", name: "Agricultural Data & GIS", recipient: "Fatou Jallow", date: "2024-04-05", issuer: "FORTIS OS Training Hub" },
  { id: "FORTIS-2024-005", name: "E-Commerce Foundations", recipient: "Omar Ceesay", date: "2024-05-22", issuer: "FORTIS OS Training Hub" },
];

export default function CertificateVerifyPage() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<null | {
    valid: boolean;
    id?: string;
    name?: string;
    recipient?: string;
    date?: string;
    issuer?: string;
    message: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!certId.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const found = VALID_CERTIFICATES.find(c => c.id === certId.trim().toUpperCase());
      if (found) {
        setResult({
          valid: true,
          id: found.id,
          name: found.name,
          recipient: found.recipient,
          date: found.date,
          issuer: found.issuer,
          message: "Certificate is valid and authentic.",
        });
      } else {
        setResult({
          valid: false,
          message: `Certificate ID "${certId.trim()}" was not found in our records. Please check the ID and try again.`,
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${G} 55%, #2A6B52 100%)`,
        color: "#fff", padding: "52px 24px 44px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎓</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Certificate Verification
          </h1>
          <p style={{ fontSize: "clamp(13px, 3vw, 16px)", opacity: 0.85, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Verify the authenticity of any FORTIS OS training certificate. Enter the Certificate ID printed on the document.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>

        {/* Verification card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.09)", marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 20 }}>
            Enter Certificate ID
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <input
              type="text"
              value={certId}
              onChange={e => setCertId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleVerify()}
              placeholder="e.g. FORTIS-2024-001"
              style={{
                flex: 1, padding: "12px 18px", borderRadius: 30, border: "1.5px solid #E5E7EB",
                fontSize: 14, outline: "none", fontFamily: "inherit",
              }}
              onFocus={e => (e.target.style.borderColor = G)}
              onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
            />
            <button
              onClick={handleVerify}
              disabled={loading || !certId.trim()}
              style={{
                background: loading || !certId.trim() ? "#E5E7EB" : `linear-gradient(135deg, ${G}, #2A6B52)`,
                color: loading || !certId.trim() ? "#9CA3AF" : "#fff",
                padding: "12px 22px", borderRadius: 30, border: "none",
                fontSize: 13, fontWeight: 800, cursor: loading || !certId.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit", whiteSpace: "nowrap",
              }}
            >
              {loading ? "Checking…" : "Verify →"}
            </button>
          </div>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
            Certificate IDs follow the format: FORTIS-YYYY-NNN
          </p>

          {/* Result */}
          {result && (
            <div style={{
              marginTop: 24,
              background: result.valid ? "#F0FDF4" : "#FEF2F2",
              border: `1.5px solid ${result.valid ? "#86EFAC" : "#FCA5A5"}`,
              borderRadius: 14, padding: "20px 22px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: result.valid ? 14 : 0 }}>
                <span style={{ fontSize: 28 }}>{result.valid ? "✅" : "❌"}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: result.valid ? "#166534" : "#991B1B" }}>
                    {result.valid ? "Valid Certificate" : "Certificate Not Found"}
                  </div>
                  <div style={{ fontSize: 12, color: result.valid ? "#166534" : "#991B1B", opacity: 0.8 }}>
                    {result.message}
                  </div>
                </div>
              </div>
              {result.valid && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Certificate ID</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{result.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Issued To</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{result.recipient}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Course</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{result.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Issue Date</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{result.date}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Issuing Authority</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: G }}>{result.issuer}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info card */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: DARK, marginBottom: 10 }}>ℹ️ About FORTIS OS Certificates</div>
          <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
            <li>Certificates are issued upon completion of verified training courses</li>
            <li>Each certificate has a unique ID printed on the document</li>
            <li>Certificates are permanently on record and can be verified at any time</li>
            <li>Employers and institutions can verify here free of charge</li>
          </ul>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, rgba(27,77,62,0.06), rgba(196,148,58,0.06))`, border: "1.5px solid rgba(196,148,58,0.2)", borderRadius: 14, padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: DARK, marginBottom: 8 }}>🎓 Earn a FORTIS OS Certificate</div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 12px" }}>Complete a course in the Training Hub to earn your verified certificate.</p>
          <Link href="/training/hub" style={{ display: "inline-block", padding: "8px 20px", background: G, color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
            Browse Free Courses →
          </Link>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.7 }}>
          For issues or corrections, contact <a href="mailto:certificates@fortisos.cloud" style={{ color: GOLD }}>certificates@fortisos.cloud</a><br />
          © FORTIS INVICTA LTD — FORTIS OS™ · fortisos.cloud
        </p>
      </div>
    </div>
  );
}
