"use client";

import { useState } from "react";
import Link from "next/link";

export default function PartnerModulePage() {
  const [msg, setMsg] = useState("");

  async function submitKyb() {
    const res = await fetch("/api/v2/commerce/kyb/submit", { method: "POST" });
    const data = await res.json();
    setMsg(res.ok ? `KYB ${data.kyb.status}` : data.error ?? "Need a signed-in org owner");
  }

  return (
    <main style={{ maxWidth: 680, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS PARTNER · preview
      </p>
      <h1>Directory open. Public commerce closed.</h1>
      <p>
        Submit KYB for staff review. Listing stays closed until APPROVED <em>and</em> a licensed PSP is contracted.
        Readiness: <Link href="/api/v2/commerce/readiness">/api/v2/commerce/readiness</Link>
      </p>
      <button type="button" onClick={submitKyb}>Submit KYB for this organisation</button>
      {msg && <p>{msg}</p>}
      <ul>
        <li>
          <Link href="/partners">Development partners directory</Link>
        </li>
        <li>
          <Link href="/marketplace">Marketplace (empty)</Link>
        </li>
        <li>
          <Link href="/ops/commerce">Staff KYB queue</Link>
        </li>
        <li>
          <Link href="/services/logistics">Logistics / coach desk (no WhatsApp)</Link>
        </li>
        <li>
          <Link href="/services/equipment-hire">Equipment desk (no public contacts)</Link>
        </li>
      </ul>
      <p>
        Stealing a lead to WhatsApp or Wave-to-personal is a KYB breach. Public listings never show
        merchant numbers. See Terms §11.
      </p>
    </main>
  );
}
