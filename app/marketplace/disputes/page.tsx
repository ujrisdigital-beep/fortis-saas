"use client";

import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";

const REASONS = [
  "Item not received",
  "Item not as described",
  "Wrong item delivered",
  "Item damaged on arrival",
  "Seller unresponsive",
  "Fraudulent listing",
  "Duplicate charge",
  "Other",
];

export default function DisputesPage() {
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [disputeId, setDisputeId] = useState("");
  const [loading, setLoading] = useState(false);

  async function file(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const id = `DIS-${Date.now().toString(36).toUpperCase()}`;
    setDisputeId(id);
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main style={pageStyle}>
          <div style={successCardStyle}>
            <div style={{ fontSize: "3rem" }}>⚖️</div>
            <h1 style={{ margin: "0.75rem 0 0.4rem", fontSize: "1.4rem", fontWeight: 800, color: "#0A1C2E" }}>Dispute Filed Successfully</h1>
            <p style={{ color: "#64748B", margin: "0 0 0.25rem", fontSize: "0.92rem" }}>Dispute ID: <strong style={{ color: "#1B4D3E" }}>{disputeId}</strong></p>

            <div style={timelineCardStyle}>
              {[
                { step: "1", title: "Dispute Received", detail: "Your case has been logged", done: true },
                { step: "2", title: "Evidence Collection", detail: "Upload chat logs, photos within 24hrs", done: false },
                { step: "3", title: "UJRIS AI Analysis", detail: "AI reviews all evidence", done: false },
                { step: "4", title: "Resolution", detail: "Decision within 72 hours", done: false },
              ].map((s) => (
                <div key={s.step} style={timelineItemStyle}>
                  <div style={{ ...timelineCircleStyle, background: s.done ? "#1B4D3E" : "#E2E8F0", color: s.done ? "#FFFFFF" : "#64748B" }}>{s.done ? "✓" : s.step}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#0A1C2E", fontSize: "0.88rem" }}>{s.title}</p>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B" }}>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.82rem", color: "#64748B", margin: "0.5rem 0 0", lineHeight: 1.6, textAlign: "center" as const }}>
              Seller has been notified. If admin review is needed (amounts {">"} D5,000), additional time may apply.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={contentStyle}>
          {/* Header */}
          <div style={heroBandStyle}>
            <div style={heroInnerStyle}>
              <span style={tagStyle}>⚖️ DISPUTE CENTRE</span>
              <h1 style={heroTitleStyle}>File a Dispute</h1>
              <p style={heroSubStyle}>
                Problem with an order? File a dispute within <strong>7 days</strong> of receipt. UJRIS AI will analyse your case and resolve within <strong>72 hours</strong>.
              </p>
            </div>
          </div>

          <div style={formWrapStyle}>
            <div style={formCardStyle}>
              <h2 style={cardTitleStyle}>Dispute Details</h2>

              <form onSubmit={file} style={fieldsStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Order ID *</label>
                  <input type="text" className="fortis-input" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. ORD-1A2B3C" required />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Reason for Dispute *</label>
                  <select className="fortis-input" value={reason} onChange={(e) => setReason(e.target.value)} required>
                    <option value="">Select a reason…</option>
                    {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Amount in Dispute (GMD) *</label>
                  <input type="number" className="fortis-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" min="1" required />
                  {Number(amount) > 5000 && (
                    <p style={{ margin: "0.3rem 0 0", fontSize: "0.78rem", color: "#92400e" }}>
                      ⚠️ Amounts over D5,000 require admin review and may take longer.
                    </p>
                  )}
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Describe What Happened *</label>
                  <textarea
                    className="fortis-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide as much detail as possible: dates, communications with seller, what was promised vs delivered…"
                    required
                    style={{ minHeight: "120px", resize: "vertical" as const, fontFamily: "inherit" }}
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Upload Evidence (Optional)</label>
                  <div style={uploadBoxStyle}>
                    <span style={{ fontSize: "1.75rem" }}>📎</span>
                    <p style={{ margin: "0.4rem 0 0.2rem", fontWeight: 600, color: "#0A1C2E", fontSize: "0.85rem" }}>Attach screenshots, photos, or documents</p>
                    <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748B" }}>JPG, PNG, PDF — max 10MB total</p>
                    <input type="file" multiple accept="image/*,.pdf" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Filing dispute…" : "⚖️ File Dispute"}
                </button>
              </form>
            </div>

            {/* Policy side panel */}
            <div style={sidePanelStyle}>
              <h3 style={{ margin: "0 0 0.85rem", fontSize: "0.95rem", fontWeight: 800, color: "#0A1C2E" }}>Dispute Policy</h3>
              {[
                { icon: "⏰", title: "File within 7 days", body: "Disputes must be filed within 7 days of delivery confirmation." },
                { icon: "🤖", title: "UJRIS AI Analysis", body: "Our AI reviews all evidence including chat logs, photos, and transaction records." },
                { icon: "⚡", title: "72-hour resolution", body: "Standard disputes resolved within 72 hours. Complex cases may take longer." },
                { icon: "👨‍⚖️", title: "Admin review >D5,000", body: "Disputes over D5,000 are reviewed by a human administrator." },
                { icon: "🔒", title: "Escrow protection", body: "Funds remain held until dispute is fully resolved. Neither party can access them." },
              ].map((p) => (
                <div key={p.title} style={policyItemStyle}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "0.82rem", color: "#1B4D3E" }}>{p.title}</p>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748B", lineHeight: 1.5 }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#F8FAFC" };
const contentStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "0 0 5rem" };
const heroBandStyle: React.CSSProperties = { background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)", padding: "3rem 1.25rem 2.5rem", marginBottom: 0 };
const heroInnerStyle: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const tagStyle: React.CSSProperties = { display: "inline-block", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "999px", marginBottom: "0.85rem" };
const heroTitleStyle: React.CSSProperties = { margin: "0 0 0.5rem", fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 };
const heroSubStyle: React.CSSProperties = { margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "55ch" };
const formWrapStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.75rem", padding: "2rem 1.25rem" };
const formCardStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.75rem" };
const cardTitleStyle: React.CSSProperties = { margin: "0 0 1.5rem", fontSize: "1.05rem", fontWeight: 800, color: "#0A1C2E" };
const fieldsStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "1rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: "0.35rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.88rem", fontWeight: 700, color: "#0A1C2E" };
const uploadBoxStyle: React.CSSProperties = { border: "2px dashed #E2E8F0", borderRadius: "0.65rem", padding: "1.5rem", textAlign: "center" as const, cursor: "pointer", position: "relative" as const, display: "flex", flexDirection: "column" as const, alignItems: "center" };
const sidePanelStyle: React.CSSProperties = { background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "0.85rem", padding: "1.5rem", display: "flex", flexDirection: "column" as const, gap: "0.85rem", alignSelf: "start", position: "sticky" as const, top: "80px" };
const policyItemStyle: React.CSSProperties = { display: "flex", gap: "0.65rem", alignItems: "flex-start" };
const successCardStyle: React.CSSProperties = { maxWidth: 520, margin: "5rem auto", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "1rem", padding: "3rem 2.5rem", display: "flex", flexDirection: "column" as const, alignItems: "center", textAlign: "center" as const };
const timelineCardStyle: React.CSSProperties = { width: "100%", display: "flex", flexDirection: "column" as const, gap: "0.85rem", marginTop: "1rem", padding: "1.25rem", background: "#F8FAFC", borderRadius: "0.65rem", textAlign: "left" as const };
const timelineItemStyle: React.CSSProperties = { display: "flex", gap: "0.75rem", alignItems: "flex-start" };
const timelineCircleStyle: React.CSSProperties = { width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.78rem", flexShrink: 0 };
