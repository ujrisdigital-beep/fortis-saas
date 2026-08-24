"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function OmbudsmanPage() {
  const [msg, setMsg] = useState("");
  const [lookup, setLookup] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/govern/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: fd.get("subject"),
        body: fd.get("body"),
        category: fd.get("category"),
        organisationNamed: fd.get("organisationNamed"),
        contact: fd.get("contact"),
        consent: fd.get("consent") === "on",
      }),
    });
    const data = await res.json();
    setMsg(res.ok ? `${data.reference} — ${data.message}` : data.error ?? "Failed");
  }

  async function check(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`/api/v2/govern/complaints?reference=${encodeURIComponent(lookup)}`);
    const data = await res.json();
    setMsg(res.ok ? `${data.reference}: ${data.status}. ${data.notice}` : data.error ?? "Not found");
  }

  return (
    <main style={{ maxWidth: 680, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        Public ombudsman desk · free
      </p>
      <h1>Lodge a complaint</h1>
      <p>
        Free for the public. FORTIS INVICTA LTD operates and maintains this intake <strong>on behalf of the Office of
        the Ombudsman</strong>. It is not a court, not a police report, and not an automated decision.
      </p>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <label>
          What is this about
          <select name="category" defaultValue="maladministration">
            <option value="maladministration">Maladministration</option>
            <option value="delay">Unreasonable delay</option>
            <option value="unfair_treatment">Unfair treatment</option>
            <option value="service_failure">Public service failure</option>
            <option value="access_to_information">Access to information</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Subject
          <input name="subject" required placeholder="Short title" />
        </label>
        <label>
          Public body involved (optional)
          <input name="organisationNamed" placeholder="Ministry, agency, or office" />
        </label>
        <label>
          What happened
          <textarea name="body" required rows={7} placeholder="Dates, what you asked for, what happened" />
        </label>
        <label>
          How we may contact you (optional)
          <input name="contact" placeholder="Phone or email — leave blank to stay unnamed" />
        </label>
        <label>
          <input type="checkbox" name="consent" /> I consent to this record being stored for human review
        </label>
        <button type="submit">Send free complaint</button>
      </form>
      <h2>Check a reference</h2>
      <form onSubmit={check} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="OMB-2026-123456" />
        <button type="submit">Look up</button>
      </form>
      {msg && <p role="status">{msg}</p>}
      <p style={{ fontSize: 13, color: "#4b5563" }}>
        Evidence files: <Link href="/evidence">upload</Link> (malware scan is fail-closed). Keep your reference.
      </p>
    </main>
  );
}
