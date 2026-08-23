"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });
    const data = (await res.json()) as { error?: string; ok?: boolean };
    setMessage(res.ok ? "Email verified. You can sign in." : data.error ?? "Verification failed");
  }

  return (
    <main style={{ maxWidth: 420, margin: "3rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Verify email</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Token<input required value={token} onChange={(e) => setToken(e.target.value)} /></label>
        <button type="submit">Verify</button>
      </form>
      {message && <p role="status">{message}</p>}
      <p><Link href="/auth/login">Sign in</Link></p>
    </main>
  );
}
