"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const G = "#1B4D3E";
const GOLD = "#C4943A";
const DARK = "#0A2E1A";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${DARK} 0%, ${G} 60%, #2A6B52 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Background circles */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(196,148,58,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(196,148,58,0.15)", border: "1px solid rgba(196,148,58,0.3)",
            borderRadius: 999, padding: "5px 16px", marginBottom: "1rem",
          }}>
            <span style={{ fontSize: 14 }}>🇬🇲</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em" }}>FORTIS OS PLATFORM</span>
          </div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
            Welcome back
          </h1>
          <p style={{ margin: "0.4rem 0 0", color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "2rem",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        }}>
          {error && (
            <div style={{
              background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA",
              borderRadius: 10, padding: "0.75rem 1rem", fontSize: 13, marginBottom: "1.25rem",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: "0.4rem" }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: 10,
                  border: "1.5px solid #E5E7EB", fontSize: 15, outline: "none",
                  boxSizing: "border-box", background: "#F9FAFB", color: "#111827",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = G)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>Password</label>
                <Link href="/auth/forgot-password" style={{ fontSize: 12, color: GOLD, textDecoration: "none", fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: 10,
                  border: "1.5px solid #E5E7EB", fontSize: 15, outline: "none",
                  boxSizing: "border-box", background: "#F9FAFB", color: "#111827",
                }}
                onFocus={(e) => (e.target.style.borderColor = G)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            <div style={{ marginTop: "1.25rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "0.85rem", borderRadius: 10, border: "none",
                  background: loading ? "#9CA3AF" : `linear-gradient(135deg, ${G}, #2A6B52)`,
                  color: "#fff", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.01em", transition: "opacity 0.15s",
                }}
              >
                {loading ? "Signing in…" : "Sign in →"}
              </button>
            </div>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #F3F4F6" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>
              New to FORTIS OS?{" "}
              <Link href="/auth/register" style={{ color: G, fontWeight: 700, textDecoration: "none" }}>
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          © FORTIS INVICTA LTD · The Gambia · Protected Platform
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0A2E1A" }} />}>
      <LoginForm />
    </Suspense>
  );
}
