"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { DeskKind } from "@/lib/services/desk";

export function DeskThreadForm({ kind, defaultSubject }: { kind: DeskKind; defaultSubject?: string }) {
  const [id, setId] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/services/desk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "open",
        kind,
        subject: fd.get("subject"),
        text: fd.get("text"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error ?? "Failed");
      return;
    }
    setId(data.id);
    setErr("");
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
      <p style={{ margin: 0, fontSize: 13 }}>
        In-house thread only. WhatsApp is not accepted as a FORTIS booking channel. Payment and 8%
        commission stay blocked until licensed PSP + KYB.
      </p>
      <input name="subject" required defaultValue={defaultSubject} placeholder="Subject" />
      <textarea name="text" required rows={4} placeholder="What you need (route, kg, days, site)" />
      <button type="submit">Open platform thread</button>
      {id && (
        <p>
          Thread <Link href={`/services/thread/${id}`}>{id}</Link> — not a booking.
        </p>
      )}
      {err && <p>{err}</p>}
    </form>
  );
}
