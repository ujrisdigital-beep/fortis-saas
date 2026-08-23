<<<<<<< HEAD
export const metadata = { title: "GROW workspace — FORTIS" };

export default function GrowWorkspacePage() {
=======
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
    setError(data.exportAllowed ? "" : "Full blueprint locked. Pay by transfer then retry.");
  }

>>>>>>> f90a36c (Unlock GROW, Academy and marketplace via the same transfer evidence.)
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ letterSpacing: "0.08em", fontSize: 12, color: "#C4943A" }}>FORTIS GROW™ · PILOT</p>
      <h1>Strategy workspace</h1>
<<<<<<< HEAD
      <p>
        Free preview uses the deterministic UJU engine. A full blueprint export requires a verified
        entitlement. Scores are advisory and not authorised for bank credit decisions.
      </p>
      <ul>
        <li>POST /api/v2/grow/assessments — preview + citations</li>
        <li>GET /api/v2/grow/grants — catalogue matches with source dates (editorial scores)</li>
        <li>Sources carry GBoS/CBG freshness; stale values are never labelled current</li>
      </ul>
=======
      <p>Preview is free. Full export unlocks after bank/wallet transfer evidence.</p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <textarea name="overview" required rows={5} placeholder="Describe the business" />
        <button type="submit">Run preview</button>
      </form>
      {preview && <p>{preview}</p>}
      {error && <p>{error} <Link href="/pay/transfer">Pay by transfer</Link></p>}
      {full && <p>Full report entitled (provisional).</p>}
>>>>>>> f90a36c (Unlock GROW, Academy and marketplace via the same transfer evidence.)
    </main>
  );
}
