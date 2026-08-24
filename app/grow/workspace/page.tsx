"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function GrowWorkspacePage() {
  const [preview, setPreview] = useState("");
  const [full, setFull] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const overview = String(new FormData(e.currentTarget).get("overview") ?? "");
    const res = await fetch("/api/v2/grow/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessOverview: overview }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Sign in required");
      return;
    }
    setPreview(data.preview?.summary ?? "Preview ready");
    setFull(Boolean(data.exportAllowed));
    setError(data.exportAllowed ? "" : "Full blueprint locked until transfer evidence is accepted.");
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ letterSpacing: "0.08em", fontSize: 12, color: "#C4943A" }}>FORTIS GROW™ · GMD 250.00 one-off</p>
      <h1>Paid diagnostic workspace</h1>
      <p>
        Free preview is deterministic and sourced. The full blueprint is a catalogue SKU
        (`price_grow_diagnostic_gmd_v1`). Advisory only — not a credit score.
      </p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <textarea name="overview" required rows={5} placeholder="Describe the business" />
        <button type="submit">Run free preview</button>
      </form>
      {preview && <p>{preview}</p>}
      {error && (
        <p>
          {error} <Link href="/pay/transfer">Unlock full report by transfer</Link>
        </p>
      )}
      {full && <p>Full report entitled (provisional). Download remains advisory.</p>}
    </main>
  );
}
