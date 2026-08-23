"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  dailyRateMinor: number;
  location: string;
  seats: number;
}

export default function RidesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [notice, setNotice] = useState("");
  const [pay, setPay] = useState<{ reference: string; amountMinor: number; bank: string; account: string } | null>(null);

  useEffect(() => {
    fetch("/api/v2/rides/vehicles")
      .then((r) => r.json())
      .then((d) => setVehicles(d.vehicles ?? []));
  }, []);

  async function book(vehicleId: string) {
    const res = await fetch("/api/v2/rides/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId, days: 1, pickup: "Banjul", startDate: new Date().toISOString().slice(0, 10) }),
    });
    const data = await res.json();
    if (!res.ok) {
      setNotice(data.error ?? "Sign in required");
      return;
    }
    setPay({
      reference: data.transfer.reference,
      amountMinor: data.transfer.amountMinor,
      bank: data.transfer.beneficiaryBank,
      account: data.transfer.beneficiaryAccount,
    });
  }

  async function submitEvidence(form: FormData) {
    if (!pay) return;
    const res = await fetch("/api/v2/transfers/evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: pay.reference,
        payerName: form.get("payerName"),
        method: form.get("method"),
        declaredAmountMinor: pay.amountMinor,
        proofNote: form.get("proofNote"),
      }),
    });
    const data = await res.json();
    setNotice(data.canUseService ? "Provisional access granted. Driver will be notified." : data.error ?? "Failed");
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ color: "#C4943A", letterSpacing: "0.08em", fontSize: 12 }}>RIDES · TRANSFER PAY</p>
      <h1>Car hire / hailing</h1>
      <p>Owners list vehicles. Clients book and pay by bank or mobile-money transfer, then submit evidence. Card capture waits for SBN-COMCACHE.</p>
      <p><a href="/rides/owner">Register as owner / driver</a></p>
      {vehicles.length === 0 && <p>No listed vehicles yet.</p>}
      <ul>
        {vehicles.map((v) => (
          <li key={v.id} style={{ margin: "12px 0" }}>
            {v.make} {v.model} · {v.seats} seats · {v.location} · GMD {(v.dailyRateMinor / 100).toFixed(2)}/day
            {" "}
            <button type="button" onClick={() => book(v.id)}>Book 1 day</button>
          </li>
        ))}
      </ul>
      {pay && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitEvidence(new FormData(e.currentTarget));
          }}
          style={{ display: "grid", gap: 8, border: "1px solid #ccc", padding: 16 }}
        >
          <h2>Pay by transfer</h2>
          <p>Reference <strong>{pay.reference}</strong></p>
          <p>Amount GMD {(pay.amountMinor / 100).toFixed(2)}</p>
          <p>{pay.bank} · {pay.account}</p>
          <label>Your name<input name="payerName" required /></label>
          <label>Channel
            <select name="method">
              <option value="bank">Bank transfer</option>
              <option value="wave">Wave</option>
              <option value="qmoney">QMoney</option>
              <option value="afrimoney">Afrimoney</option>
            </select>
          </label>
          <label>Evidence note (txn id / screenshot description)<input name="proofNote" required /></label>
          <button type="submit">I have transferred — unlock trip</button>
        </form>
      )}
      {notice && <p role="status">{notice}</p>}
    </main>
  );
}
