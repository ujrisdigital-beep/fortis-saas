"use client";
import { useState } from "react";
import Link from "next/link";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) { setSent(true); }
      else { setError(data.error ?? "Something went wrong. Please try again."); }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 22, fontWeight: 900, color: GOLD }}>FI</div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 900, color: DARK }}>Reset Password</h1>
          <p style={{ margin: "0.4rem 0 0", color: "#6B7280", fontSize: "0.88rem" }}>Enter your email and we'll send a 6-digit reset code</p>
        </div>

        <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>📬</div>
              <h2 style={{ margin: "0 0 0.5rem", color: DARK, fontSize: "1.1rem", fontWeight: 800 }}>Check your email</h2>
              <p style={{ color: "#6B7280", fontSize: "0.88rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                If <strong>{email}</strong> has a FORTIS OS account, a 6-digit reset code has been sent. Check your inbox and spam folder.
              </p>
              <Link href="/auth/reset-password" style={{ display: "block", padding: "0.75rem", background: `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                Enter Reset Code →
              </Link>
              <button onClick={() => setSent(false)} style={{ marginTop: "0.75rem", background: "none", border: "none", color: "#9CA3AF", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit" }}>
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                />
              </div>
              {error && (
                <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 8, padding: "0.65rem 0.9rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#991B1B" }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !email.trim()}
                style={{ width: "100%", padding: "0.8rem", background: loading || !email.trim() ? "#9CA3AF" : `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.95rem", fontWeight: 700, cursor: loading || !email.trim() ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              >
                {loading ? "⏳ Sending…" : "Send Reset Code"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.82rem" }}>
            <Link href="/auth/login" style={{ color: PRIMARY, fontWeight: 600, textDecoration: "none" }}>← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
