"use client";

import { FormEvent, useState } from "react";
import type { ServiceKind } from "@/lib/services/enquiries";

export function ServiceEnquiryForm({ kind }: { kind: ServiceKind }) {
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/services/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        name: fd.get("name"),
        phone: fd.get("phone"),
        note: fd.get("note"),
        consent: fd.get("consent") === "on",
      }),
    });
    const data = await res.json();
    setMsg(res.ok ? `${data.id} — ${data.message}` : data.error ?? "Failed");
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
      <input name="name" required placeholder="Your name" />
      <input name="phone" required placeholder="Phone" />
      <textarea name="note" required rows={4} placeholder="What you need" />
      <label>
        <input type="checkbox" name="consent" /> I consent to this enquiry being stored for review
      </label>
      <button type="submit">Send enquiry (not a booking)</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
