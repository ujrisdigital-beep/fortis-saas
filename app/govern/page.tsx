"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function GovernPage() {
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/govern/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: fd.get("subject"),
        body: fd.get("body"),
        consent: fd.get("consent") === "on",
      }),
    });
    const data = await res.json();
    setMsg(res.ok ? `${data.reference} — ${data.message}` : data.error ?? "Failed");
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS GOVERN · preview
      </p>
      <h1>Complaint intake</h1>
      <p>
        Consent is required. Staff review cases. This form does not issue a court order or a legal determination.
      </p>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input name="subject" required placeholder="Subject" />
        <textarea name="body" required placeholder="What happened" rows={6} />
        <label>
          <input type="checkbox" name="consent" /> I consent to this record being stored for review
        </label>
        <button type="submit">Lodge complaint</button>
      </form>
      {msg && <p>{msg}</p>}
      <p>
        <Link href="/evidence">Evidence upload</Link> · malware scan is fail-closed without a scanner.
      </p>
    </main>
  );
}
