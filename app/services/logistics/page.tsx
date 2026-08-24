"use client";

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
      </p>
    </main>
  );
}
