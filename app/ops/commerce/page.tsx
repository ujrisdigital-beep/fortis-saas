"use client";

import { FormEvent, useState } from "react";

export default function CommerceOpsPage() {
  const [out, setOut] = useState("");

  async function loadQueue() {
    const res = await fetch("/api/v2/commerce/kyb/queue");
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  async function decide(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/commerce/kyb/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantId: fd.get("merchantId"),
        approve: fd.get("approve") === "on",
      }),
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Commerce ops (KYB)</h1>
      <p>
        Returns 503 until FORTIS_KYB_REVIEWERS includes your user id. Approving KYB does not open public SKUs or
        live cards.
      </p>
      <button type="button" onClick={loadQueue}>Load queue</button>
      <form onSubmit={decide} style={{ display: "grid", gap: 8, marginTop: 16 }}>
        <input name="merchantId" required placeholder="organisation / merchant id" />
        <label>
          <input type="checkbox" name="approve" /> Approve
        </label>
        <button type="submit">Decide</button>
      </form>
      {out && <pre style={{ whiteSpace: "pre-wrap" }}>{out}</pre>}
    </main>
  );
}
