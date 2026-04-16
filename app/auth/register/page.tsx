"use client";

import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";

const disposableDomains = ["mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com"];

function isDisposable(email: string) {
  return disposableDomains.some((domain) => email.toLowerCase().endsWith(`@${domain}`));
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [roleRequest, setRoleRequest] = useState("CLIENT");
  const [sector, setSector] = useState("energy");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (isDisposable(email)) {
      setError("Disposable email addresses are not allowed.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        organisation,
        roleRequest,
        sector,
      }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setError(payload.error ?? "Registration failed.");
      setLoading(false);
      return;
    }

    setSuccess(payload.message ?? "Registration request received.");
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1rem" }}>
      <form onSubmit={onSubmit} className="fortis-card" style={{ width: "100%", maxWidth: 540, padding: "1.5rem" }}>
        <p style={{ color: "var(--fortis-accent)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em" }}>FORTIS INVICTA</p>
        <h1 style={{ marginTop: "0.4rem", fontSize: "1.8rem" }}>Request access</h1>

        <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" style={inputStyle} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Work email" style={inputStyle} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" style={inputStyle} />
          <input value={organisation} onChange={(e) => setOrganisation(e.target.value)} required placeholder="Organisation" style={inputStyle} />

          <select value={roleRequest} onChange={(e) => setRoleRequest(e.target.value)} style={inputStyle}>
            <option value="CLIENT">Client</option>
            <option value="MANAGER">Manager</option>
            <option value="GOVERNMENT">Government</option>
            <option value="BOARD">Board</option>
          </select>

          <select value={sector} onChange={(e) => setSector(e.target.value)} style={inputStyle}>
            <option value="energy">Energy</option>
            <option value="agriculture">Agriculture</option>
            <option value="housing">Housing</option>
            <option value="fintech">Fintech</option>
            <option value="saas">SaaS</option>
          </select>
        </div>

        {error ? <p style={{ marginTop: "0.8rem", color: "#E63946" }}>{error}</p> : null}
        {success ? <p style={{ marginTop: "0.8rem", color: "#10B981" }}>{success}</p> : null}

        <button type="submit" disabled={loading} style={{ marginTop: "1rem", width: "100%", padding: "0.8rem", borderRadius: "0.5rem", border: "none", fontWeight: 700, background: "#C9A84C", color: "#112419" }}>
          {loading ? "Submitting..." : "Submit Access Request"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.7rem",
  borderRadius: "0.5rem",
  border: "1px solid var(--fortis-border)",
  background: "#133122",
  color: "white",
};
