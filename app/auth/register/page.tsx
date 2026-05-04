"use client";

import { useState } from "react";
import Link from "next/link";
import type { CSSProperties, FormEvent } from "react";

const G = "#1B4D3E";
const DARK = "#0A2E1A";
const GOLD = "#C4943A";

const disposableDomains = ["mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com"];
function isDisposable(email: string) {
  return disposableDomains.some((d) => email.toLowerCase().endsWith(`@${d}`));
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isDisposable(email)) {
      setError("Disposable email addresses are not allowed.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
      } else {
        setSuccess(data.message ?? "Account created! You can now sign in.");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F5F5F0", display: "grid", placeItems: "center", padding: "1.5rem", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo mark */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${DARK}, ${G})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: GOLD, fontWeight: 900, fontSize: 16, fontFamily: "serif" }}>F</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: DARK, letterSpacing: "0.05em" }}>FORTIS OS</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "1.65rem", fontWeight: 900, color: DARK }}>Create your account</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>Free access to all AI tools</p>
        </div>

        <form onSubmit={onSubmit} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e5e7eb", padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Fatou Jallow"
                style={inputStyle}
                autoComplete="name"
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
                style={inputStyle}
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#991b1b" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 13, color: "#166534" }}>
              {success}
              {" "}
              <Link href="/auth/login" style={{ color: G, fontWeight: 700, textDecoration: "underline" }}>Sign in now →</Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 18,
              width: "100%",
              padding: "0.85rem",
              borderRadius: 10,
              border: "none",
              fontWeight: 800,
              fontSize: 15,
              background: loading ? "#9ca3af" : `linear-gradient(135deg, ${G}, #2E7D64)`,
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Creating account…" : "Create Free Account"}
          </button>

          <p style={{ margin: "14px 0 0", textAlign: "center", fontSize: 12, color: "#9ca3af" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: G, fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        </form>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 16 }}>
          By registering you agree to our{" "}
          <Link href="/legal" style={{ color: G }}>Terms & Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 5,
  letterSpacing: "0.03em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.85rem",
  borderRadius: 8,
  border: "1.5px solid #d1d5db",
  background: "#fafafa",
  color: "#111",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};
