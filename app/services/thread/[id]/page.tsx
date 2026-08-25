"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { DeskThread } from "@/lib/services/desk";

export default function DeskThreadPage() {
  const params = useParams<{ id: string }>();
  const [row, setRow] = useState<DeskThread | null>(null);
  const [pay, setPay] = useState("");

  async function load() {
    const res = await fetch(`/api/v2/services/desk?id=${encodeURIComponent(params.id)}`);
    if (res.ok) setRow(await res.json());
  }

  useEffect(() => {
    void load();
  }, [params.id]);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = String(new FormData(e.currentTarget).get("text") ?? "");
    await fetch("/api/v2/services/desk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "message", id: params.id, text }),
    });
    e.currentTarget.reset();
    await load();
  }

  async function checkout() {
    const res = await fetch("/api/v2/services/desk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "checkout", id: params.id }),
    });
    const data = await res.json();
    setPay(data.message ?? "Blocked");
  }

  if (!row) {
    return (
      <main style={{ padding: "2rem" }}>
        <p>Thread not in this process memory (restart clears it). Open a new one from the desk.</p>
        <Link href="/services/logistics">Logistics desk</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <Link href="/services/logistics">← Desk</Link>
      <h1>{row.id}</h1>
      <p>
        {row.kind} · booked={String(row.booked)} · escrow={String(row.escrow)} · listed commission{" "}
        {row.commissionBps / 100}%
      </p>
      <p>
        Lead stays here. Merchant phone / WhatsApp are not disclosed. Off-platform pay instructions are
        redacted.
      </p>
      {row.circumventionFlags.length > 0 && (
        <p>Flagged leak attempts: {row.circumventionFlags.map((f) => f.kind).join(", ")}</p>
      )}
      <ol>
        {row.messages.map((m, i) => (
          <li key={i}>
            <strong>{m.from}</strong>: {m.body}
          </li>
        ))}
      </ol>
      <form onSubmit={send} style={{ display: "grid", gap: 8 }}>
        <textarea name="text" required rows={3} placeholder="Reply on-platform" />
        <button type="submit">Send</button>
      </form>
      <button type="button" onClick={checkout} style={{ marginTop: 12 }}>
        Attempt on-platform pay (will refuse)
      </button>
      {pay && <p>{pay}</p>}
    </main>
  );
}
