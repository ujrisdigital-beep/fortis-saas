"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function DisputesPage() {
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/govern/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "platform_dispute",
        subject: fd.get("subject"),
        body: fd.get("body"),
        contact: fd.get("contact"),
        consent: fd.get("consent") === "on",
        againstPublicAuthority: false,
      }),
    });
    const data = await res.json();
    setMsg(res.ok ? `${data.reference} — ${data.notice}` : data.error ?? "Failed");
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Platform dispute (not Ombudsman)</h1>
      <p>
        This is a private FORTIS / marketplace complaint. It is <strong>not</strong> a complaint under the Ombudsman
        Act. There is no live escrow to freeze. Public-authority cases: <Link href="/ombudsman">Ombudsman desk</Link>.
      </p>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input name="subject" required placeholder="Subject" />
        <textarea name="body" required rows={5} placeholder="What happened" />
        <input name="contact" placeholder="Contact" />
        <label>
          <input type="checkbox" name="consent" /> I consent to this private record
        </label>
        <button type="submit">File platform dispute</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
}
