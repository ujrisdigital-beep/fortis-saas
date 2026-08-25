"use client";

import { FormEvent, useState } from "react";

export default function RideOwnerPage() {
  const [msg, setMsg] = useState("");

  async function onOwner(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/rides/owners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: fd.get("displayName"), phone: fd.get("phone") }),
    });
    const data = await res.json();
    setMsg(res.ok ? "Owner profile saved." : data.error ?? "Sign in required");
  }

  async function onVehicle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/v2/rides/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        make: fd.get("make"),
        model: fd.get("model"),
        year: Number(fd.get("year")),
        licensePlate: fd.get("licensePlate"),
        seats: Number(fd.get("seats")),
        dailyRateMinor: Math.round(Number(fd.get("dailyGmd")) * 100),
        location: fd.get("location"),
        withDriver: fd.get("withDriver") === "on",
        category: "saloon",
      }),
    });
    const data = await res.json();
    setMsg(res.ok ? `Listed ${data.vehicle.licensePlate}` : data.error ?? "Failed");
  }

  return (
    <main style={{ maxWidth: 560, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Owner / driver registration</h1>
      <p>No simulated escrow. You list a vehicle; clients pay the platform account by transfer.</p>
      <form onSubmit={onOwner} style={{ display: "grid", gap: 8, marginBottom: 24 }}>
        <h2>1. Profile</h2>
        <input name="displayName" required placeholder="Business or driver name" />
        <input name="phone" required placeholder="Phone" />
        <button type="submit">Save profile</button>
      </form>
      <form onSubmit={onVehicle} style={{ display: "grid", gap: 8 }}>
        <h2>2. Vehicle</h2>
        <input name="make" required placeholder="Make" />
        <input name="model" required placeholder="Model" />
        <input name="year" type="number" required defaultValue={2018} />
        <input name="licensePlate" required placeholder="Plate" />
        <input name="seats" type="number" required defaultValue={4} />
        <input name="dailyGmd" type="number" required placeholder="Daily rate GMD" />
        <input name="location" required placeholder="Base location" />
        <label><input type="checkbox" name="withDriver" /> Driver included</label>
        <button type="submit">List vehicle</button>
      </form>
      {msg && <p role="status">{msg}</p>}
    </main>
  );
}
