"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function readValue(event: ChangeEvent<HTMLInputElement>) {
  return event.target.value;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1rem" }}>
      <form onSubmit={onSubmit} className="fortis-card" style={{ width: "100%", maxWidth: 420, padding: "1.5rem" }}>
        <p style={{ color: "var(--fortis-accent)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em" }}>FORTIS INVICTA</p>
        <h1 style={{ marginTop: "0.4rem", fontSize: "1.8rem" }}>Sign in</h1>

        <label style={{ display: "block", marginTop: "1rem", marginBottom: "0.4rem" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(readValue(e))}
          required
          style={{ width: "100%", padding: "0.7rem", borderRadius: "0.5rem", border: "1px solid var(--fortis-border)", background: "#133122", color: "white" }}
        />

        <label style={{ display: "block", marginTop: "0.8rem", marginBottom: "0.4rem" }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(readValue(e))}
          required
          style={{ width: "100%", padding: "0.7rem", borderRadius: "0.5rem", border: "1px solid var(--fortis-border)", background: "#133122", color: "white" }}
        />

        {error ? (
          <p style={{ marginTop: "0.7rem", color: "#E63946", fontSize: "0.9rem" }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "1rem", width: "100%", padding: "0.8rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: 700, background: "#C9A84C", color: "#112419" }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p style={{ marginTop: "0.8rem", fontSize: "0.9rem", color: "var(--fortis-text-secondary)" }}>
          First time? <a href="/auth/register" style={{ color: "var(--fortis-accent)" }}>Request access</a>
        </p>
      </form>
    </main>
  );
}
