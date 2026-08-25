"use client";

<<<<<<< HEAD
import { useState } from "react";
import Link from "next/link";
import { ServiceEnquiryForm } from "../../../components/service-enquiry-form";

export default function LogisticsPage() {
  const [kg, setKg] = useState("100");
  const weight = Number(kg) || 0;
  const sea = Math.round(weight * 3 + 1200);
  const air = Math.round(weight * 18);
  const road = Math.round(weight * 5 + 200);

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS PARTNER · logistics · preview
      </p>
      <h1>Logistics desk</h1>
      <p>
        No live DHL/FedEx contract, no tracking, no coach inventory. Numbers below are an{" "}
        <strong>illustrative teaching formula</strong>, not a carrier quote and not CBG-rated.
      </p>
      <label>
        Weight kg{" "}
        <input value={kg} onChange={(e) => setKg(e.target.value)} />
      </label>
      <ul>
        <li>Illustrative sea index: D{sea.toLocaleString()}</li>
        <li>Illustrative air index: D{air.toLocaleString()}</li>
        <li>Illustrative road index: D{road.toLocaleString()}</li>
      </ul>
      <p>Ask a licensed forwarder for a real quote. GPA / Q-Express / Salam names here are examples only.</p>
      <h2>Enquiry</h2>
      <ServiceEnquiryForm kind="logistics" />
      <p>
        <Link href="/rides">Rides (transfer hire)</Link> · <Link href="/partner">Partner</Link>
=======
import { FormEvent, useState } from "react";
import Link from "next/link";
import { DeskThreadForm } from "../../../components/desk-thread-form";
import {
  estimateFreight,
  FREIGHT_DESTINATIONS,
  GAMBIAN_ORIGINS,
  PLATFORM_COMMISSION_BPS,
} from "@/lib/services/desk";

type Tab = "freight" | "courier" | "coach";

export default function LogisticsPage() {
  const [tab, setTab] = useState<Tab>("freight");
  const [kg, setKg] = useState("100");
  const [cbm, setCbm] = useState("");
  const [origin, setOrigin] = useState<string>(GAMBIAN_ORIGINS[0]);
  const [dest, setDest] = useState<string>("Dakar, Senegal");
  const [quote, setQuote] = useState<ReturnType<typeof estimateFreight> | null>(null);
  const [days, setDays] = useState("1");
  const [seats, setSeats] = useState("30");

  function onFreight(e: FormEvent) {
    e.preventDefault();
    setQuote(estimateFreight({ kg: Number(kg), cbm: cbm ? Number(cbm) : undefined, origin, dest }));
  }

  return (
    <main style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem 4rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#1B4D3E" }}>PARTNER · LOGISTICS DESK</p>
      <h1>Gambia logistics hub</h1>
      <p>
        Freight index, courier class, and coach hire <strong>start on FORTIS</strong>. WhatsApp numbers from
        marketing decks are not wired. Escrow and the {PLATFORM_COMMISSION_BPS / 100}% platform commission
        stay unpublished until KYB staff + licensed PSP + signed live-money decision.
      </p>
      <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "1rem 0" }}>
        {(["freight", "courier", "coach"] as Tab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>

      {tab === "freight" && (
        <section>
          <h2>Freight index</h2>
          <form onSubmit={onFreight} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
            <label>
              Weight kg
              <input value={kg} onChange={(e) => setKg(e.target.value)} required />
            </label>
            <label>
              Volume CBM (optional)
              <input value={cbm} onChange={(e) => setCbm(e.target.value)} />
            </label>
            <label>
              Origin
              <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                {GAMBIAN_ORIGINS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label>
              Destination
              <select value={dest} onChange={(e) => setDest(e.target.value)}>
                {FREIGHT_DESTINATIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <button type="submit">Calculate index</button>
          </form>
          {quote && (
            <ul>
              <li>Chargeable kg: {quote.chargeableKg}</li>
              <li>Sea index D{quote.gmd.sea.toLocaleString()}</li>
              <li>Air index D{quote.gmd.air.toLocaleString()}</li>
              <li>Road index D{quote.gmd.road.toLocaleString()}</li>
            </ul>
          )}
          <h3>Ask a forwarder on-platform</h3>
          <DeskThreadForm kind="logistics" defaultSubject={`${origin} → ${dest}, ${kg} kg`} />
        </section>
      )}

      {tab === "courier" && (
        <section>
          <h2>Courier classes</h2>
          <p>No Salam / Q-Express / GPA WhatsApp. Those were demo numbers. Classes we will KYB:</p>
          <ul>
            <li>Inter-city (Banjul–Basse corridor)</li>
            <li>Cross-border (Karang / Farafenni)</li>
            <li>Same-day Greater Banjul</li>
          </ul>
          <DeskThreadForm kind="courier" defaultSubject="Courier — domestic" />
        </section>
      )}

      {tab === "coach" && (
        <section>
          <h2>Coach hire enquiry</h2>
          <p>
            Capacity {seats} pax × {days} day(s) is a request, not a GBS booking. Daily dalasi rates from
            decks are not republished as live inventory.
          </p>
          <label>
            Seats
            <select value={seats} onChange={(e) => setSeats(e.target.value)}>
              {[20, 30, 35, 40, 45, 50, 55, 60].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label>
            Days
            <input value={days} onChange={(e) => setDays(e.target.value)} />
          </label>
          <DeskThreadForm kind="coach" defaultSubject={`Coach ${seats} pax × ${days}d`} />
        </section>
      )}

      <p>
        <Link href="/services/equipment-hire">Equipment desk</Link> · <Link href="/partner">Partner KYB</Link> ·{" "}
        <Link href="/rides">Rides transfer SKU</Link>
>>>>>>> 1a4ce5d (Partner logistics and equipment desks: on-platform threads, gated pay.)
      </p>
    </main>
  );
}
