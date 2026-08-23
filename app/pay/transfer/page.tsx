"use client";

import { FormEvent, useState } from "react";

export default function TransferPayPage() {
  const [ref, setRef] = useState("");
  const [msg, setMsg] = useState("");

  async function quote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: fd.get("priceId"), module: fd.get("module") }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Failed");
      return;
    }
    setRef(data.instruction.reference);
    setMsg(`Pay ${data.instruction.currency} ${(data.instruction.amountMinor / 100).toFixed(2)} to ${data.instruction.beneficiaryAccount} with ${data.instruction.reference}`);
  }

  async function evidence(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/transfers/evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: ref,
        payerName: fd.get("payerName"),
        method: fd.get("method"),
        declaredAmountMinor: Number(fd.get("amountMinor")),
        proofNote: fd.get("proofNote"),
      }),
    });
    const data = await res.json();
    setMsg(data.canUseService ? "Service unlocked (provisional)." : data.error ?? "Failed");
  }

  return (
    <main style={{ maxWidth: 520, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Bank / wallet transfer</h1>
      <p>Available on GROW, Academy and other catalogue prices while SBN-COMCACHE is pending.</p>
      <form onSubmit={quote} style={{ display: "grid", gap: 8 }}>
        <input name="priceId" required defaultValue="price_grow_diagnostic_gmd_v1" />
        <select name="module">
          <option value="grow">GROW</option>
          <option value="academy">Academy</option>
          <option value="marketplace">Marketplace</option>
          <option value="core">Core</option>
        </select>
        <button type="submit">Create transfer instruction</button>
      </form>
      {ref && (
        <form onSubmit={evidence} style={{ display: "grid", gap: 8, marginTop: 24 }}>
          <p>Reference {ref}</p>
          <input name="payerName" required placeholder="Payer name" />
          <input name="amountMinor" required placeholder="Amount minor units" />
          <select name="method">
            <option value="bank">Bank</option>
            <option value="wave">Wave</option>
            <option value="qmoney">QMoney</option>
          </select>
          <input name="proofNote" required placeholder="Transaction id" />
          <button type="submit">Submit evidence</button>
        </form>
      )}
      {msg && <p>{msg}</p>}
    </main>
  );
}
