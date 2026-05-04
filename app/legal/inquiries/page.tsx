"use client";
import { useState } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

const INQUIRY_TYPES = [
  { value: "copyright", label: "Copyright / Trademark Inquiry" },
  { value: "licensing", label: "Commercial Licensing" },
  { value: "partnership", label: "Partnership / Collaboration" },
  { value: "data-protection", label: "Data Protection (GDPA 2018)" },
  { value: "court-order", label: "Court Order / Legal Process" },
  { value: "reverse-engineering", label: "Report Suspected IP Violation" },
  { value: "other", label: "Other Legal Inquiry" },
];

export default function LegalInquiriesPage() {
  const [form, setForm] = useState({
    name: "", email: "", organization: "", inquiryType: "copyright", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/legal/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");
      setSubmitted(data.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`, padding: "3rem 1.5rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: "0.75rem" }}>⚖️</div>
          <h1 style={{ margin: "0 0 0.5rem", color: WHITE, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }}>
            Legal Inquiries
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
            FORTIS INVICTA LTD — Licensed Operator of FORTIS OS™ in The Gambia
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* IP Notice */}
        <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E", lineHeight: 1.6 }}>
            <strong>⚠️ Intellectual Property Notice:</strong> FORTIS OS™, IKENGA™, UJU Cycle™, and Ask UJRIS™ are trademarks of UJU GROUP LIMITED,
            operated under exclusive licence by FORTIS INVICTA LTD in The Gambia. This platform contains proprietary algorithms and trade secrets.
            Unauthorised reverse engineering, reproduction, or distribution is prohibited under the
            Gambia Copyright Act 2004 and Cybercrime Act 2021.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ background: WHITE, borderRadius: 14, border: "1.5px solid #E2E8F0", padding: "2rem" }}>
            <h2 style={{ margin: "0 0 1.5rem", color: DARK, fontSize: "1.1rem", fontWeight: 800 }}>
              Submit Legal Inquiry
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.82rem", color: DARK, marginBottom: "0.35rem" }}>Full Name *</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.9rem", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: "0.88rem", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.82rem", color: DARK, marginBottom: "0.35rem" }}>Email *</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.9rem", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: "0.88rem", fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "0.82rem", color: DARK, marginBottom: "0.35rem" }}>Organisation (if applicable)</label>
              <input
                type="text"
                value={form.organization}
                onChange={e => setForm({ ...form, organization: e.target.value })}
                style={{ width: "100%", padding: "0.6rem 0.9rem", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: "0.88rem", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "0.82rem", color: DARK, marginBottom: "0.35rem" }}>Inquiry Type *</label>
              <select
                required
                value={form.inquiryType}
                onChange={e => setForm({ ...form, inquiryType: e.target.value })}
                style={{ width: "100%", padding: "0.6rem 0.9rem", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: "0.88rem", fontFamily: "inherit", background: WHITE, boxSizing: "border-box" }}
              >
                {INQUIRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "0.82rem", color: DARK, marginBottom: "0.35rem" }}>
                Message * <span style={{ color: "#9CA3AF", fontWeight: 400 }}>({form.message.length}/2000)</span>
              </label>
              <textarea
                required rows={6}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value.slice(0, 2000) })}
                placeholder="Provide detailed information about your inquiry..."
                style={{ width: "100%", padding: "0.6rem 0.9rem", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: "0.88rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "0.9rem", marginBottom: "1.25rem", fontSize: "0.77rem", color: "#6B7280" }}>
              <p style={{ margin: "0 0 0.4rem", fontWeight: 700, color: DARK }}>By submitting, you acknowledge:</p>
              <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                <li>FORTIS OS™ contains trade secrets and proprietary algorithms</li>
                <li>Unauthorised reverse engineering is prohibited under Gambian law</li>
                <li>All inquiries will receive a response within 5 business days</li>
                <li>Correspondence may be shared with UJU GROUP LIMITED (UK)</li>
              </ul>
            </div>

            {error && <p style={{ color: "#DC2626", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%", padding: "0.85rem", background: submitting ? "#9CA3AF" : PRIMARY,
                color: WHITE, border: "none", borderRadius: 10, fontWeight: 700,
                fontSize: "0.95rem", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}
            >
              {submitting ? "Submitting…" : "Submit Legal Inquiry →"}
            </button>
          </form>
        ) : (
          <div style={{ background: "#D1FAE5", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "0.75rem" }}>📧</div>
            <h2 style={{ margin: "0 0 0.5rem", color: "#065F46", fontWeight: 800 }}>Inquiry Received</h2>
            <p style={{ margin: "0 0 0.75rem", color: "#16A34A" }}>
              FORTIS INVICTA LTD will respond within 5 business days.
            </p>
            <p style={{ margin: "0 0 1.5rem", fontSize: "0.82rem", color: "#374151" }}>
              Reference: <strong style={{ color: DARK }}>{submitted}</strong>
            </p>
            <p style={{ margin: "0 0 1.5rem", fontSize: "0.8rem", color: "#6B7280" }}>
              For urgent matters, email: <strong>legal@fortisos.gm</strong>
            </p>
            <Link href="/" style={{ padding: "0.65rem 1.5rem", background: PRIMARY, color: WHITE, borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: "0.88rem" }}>
              Return to FORTIS OS
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
