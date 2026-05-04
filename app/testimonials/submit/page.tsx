"use client";
import { useState } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

export default function SubmitTestimonialPage() {
  const [form, setForm] = useState({ authorName: "", authorRole: "", businessName: "", content: "", rating: 5, consent: false });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) { setError("Please confirm the disclosure agreement to submit."); return; }
    if (form.content.length < 50) { setError("Please write at least 50 characters about your experience."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: form.authorName, authorRole: form.authorRole, businessName: form.businessName, content: form.content, rating: form.rating }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else setError(data.error ?? "Submission failed. Please try again.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#F0F4F0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2.5rem", maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: "1rem" }}>🙏</div>
          <h2 style={{ margin: "0 0 0.5rem", color: DARK, fontSize: "1.25rem", fontWeight: 800 }}>Thank You!</h2>
          <p style={{ color: "#6B7280", fontSize: "0.88rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Your testimonial has been received and is under review. Approved testimonials are published on the FORTIS OS community page within 2 business days.
          </p>
          <Link href="/testimonials" style={{ display: "inline-block", padding: "0.65rem 1.5rem", background: PRIMARY, color: WHITE, borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
            ← View Testimonials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${PRIMARY} 60%, #2A6B52 100%)`, padding: "2.5rem 1.5rem 2rem", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          <div style={{ flex: 1, background: "#3A7D44" }} /><div style={{ flex: 1, background: WHITE }} /><div style={{ flex: 1, background: "#E63946" }} />
        </div>
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <h1 style={{ margin: "0 0 0.4rem", color: WHITE, fontSize: "1.6rem", fontWeight: 800 }}>✍️ Share Your Story</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>Help other Gambians discover FORTIS OS</p>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem" }}>
          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.5rem" }}>Your Rating</label>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, rating: s }))}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.8rem", color: s <= form.rating ? GOLD : "#E5E7EB", padding: 0 }}>★</button>
                ))}
              </div>
            </div>

            {/* Fields */}
            {[
              { key: "authorName", label: "Your Full Name", placeholder: "e.g. Fatou Camara", required: true },
              { key: "authorRole", label: "Your Role / Title", placeholder: "e.g. Business Owner, Bank Manager, NGO Director", required: true },
              { key: "businessName", label: "Business / Organisation (optional)", placeholder: "e.g. Camara Textiles", required: false },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>{f.label}</label>
                <input
                  type="text" value={form[f.key as keyof typeof form] as string}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} required={f.required}
                  style={{ width: "100%", padding: "0.7rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.88rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                />
              </div>
            ))}

            {/* Content */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>
                Your Testimonial <span style={{ color: "#9CA3AF", fontWeight: 400 }}>({form.content.length}/500)</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value.slice(0, 500) }))}
                placeholder="Tell us how FORTIS OS has helped you or your business. Be specific — what tools did you use? What results did you see?"
                required rows={5}
                style={{ width: "100%", padding: "0.7rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.88rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none", resize: "vertical" }}
              />
            </div>

            {/* Consent */}
            <div style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "1rem", marginBottom: "1.25rem" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input type="checkbox" checked={form.consent} onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))}
                  style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.6 }}>
                  By submitting, I confirm that: (1) this testimonial is based on my genuine experience with FORTIS OS; (2) I grant FORTIS OS and UJU GROUP LIMITED a non-exclusive licence to display this testimonial on their platforms; (3) I retain copyright in my testimonial; (4) I understand this content is subject to FORTIS OS review and may be edited for brevity or clarity. <strong>Testimonials reflect individual user experiences only.</strong>
                </span>
              </label>
            </div>

            {error && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 8, padding: "0.65rem 0.9rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#991B1B" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !form.consent}
              style={{ width: "100%", padding: "0.8rem", background: loading || !form.consent ? "#9CA3AF" : `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.95rem", fontWeight: 700, cursor: loading || !form.consent ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {loading ? "⏳ Submitting…" : "Submit Testimonial"}
            </button>
          </form>
        </div>

        <p style={{ marginTop: "1rem", fontSize: "0.72rem", color: "#9CA3AF", textAlign: "center", lineHeight: 1.6 }}>
          Testimonials require admin approval before publication. We do not publish testimonials that contain false claims, personal data of third parties, or defamatory content.{" "}
          <Link href="/knowledge/disclaimer" style={{ color: PRIMARY, textDecoration: "none" }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
