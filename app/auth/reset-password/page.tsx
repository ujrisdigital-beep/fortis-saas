"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PRIMARY = "#1B4D3E";
const GOLD    = "#C4943A";
const DARK    = "#0F3D21";
const WHITE   = "#FFFFFF";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", code: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), code: form.code.trim(), newPassword: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 2500);
      } else {
        setError(data.error ?? "Reset failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F0", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${DARK}, ${PRIMARY})`, border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 22, fontWeight: 900, color: GOLD }}>FI</div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 900, color: DARK }}>Set New Password</h1>
          <p style={{ margin: "0.4rem 0 0", color: "#6B7280", fontSize: "0.88rem" }}>Enter your email, the 6-digit code, and a new password</p>
        </div>

        <div style={{ background: WHITE, border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "2rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>✅</div>
              <h2 style={{ margin: "0 0 0.5rem", color: "#065F46", fontSize: "1.1rem", fontWeight: 800 }}>Password Reset!</h2>
              <p style={{ color: "#6B7280", fontSize: "0.88rem" }}>Redirecting to login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {[
                { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                { key: "code", label: "6-Digit Reset Code", type: "text", placeholder: "123456" },
              ].map((f) => (
                <div key={f.key} style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    required
                    maxLength={f.key === "code" ? 6 : undefined}
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: f.key === "code" ? "1.2rem" : "0.9rem", fontFamily: f.key === "code" ? "monospace" : "inherit", letterSpacing: f.key === "code" ? "0.3rem" : "normal", boxSizing: "border-box", outline: "none", textAlign: f.key === "code" ? "center" : "left" }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                    style={{ width: "100%", padding: "0.75rem 2.75rem 0.75rem 1rem", border: "1.5px solid #D1D5DB", borderRadius: 8, fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "1rem" }}>{showPw ? "🙈" : "👁"}</button>
                </div>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: DARK, marginBottom: "0.4rem" }}>Confirm Password</label>
                <input
                  type={showPw ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="Repeat new password"
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
                disabled={loading}
                style={{ width: "100%", padding: "0.8rem", background: loading ? "#9CA3AF" : `linear-gradient(135deg, ${PRIMARY}, #2A6B52)`, color: WHITE, border: "none", borderRadius: 10, fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              >
                {loading ? "⏳ Resetting…" : "Reset Password"}
              </button>
            </form>
          )}

          <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.82rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link href="/auth/forgot-password" style={{ color: "#6B7280", textDecoration: "none" }}>Resend code</Link>
            <Link href="/auth/login" style={{ color: PRIMARY, fontWeight: 600, textDecoration: "none" }}>← Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
