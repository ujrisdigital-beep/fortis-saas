import Link from "next/link";
import { BUYER_PROTECTION, MALL_CATEGORIES, publicMallListings } from "@/lib/commerce/mall-sop";
import { FORTIS_SHARE_BPS, INTEGRATOR_SHARE_BPS, SLA_TAKE_BPS } from "@/lib/commerce/sla-commission";

export default function MarketplacePage() {
  const live = publicMallListings();
  return (
    <main style={{ maxWidth: 760, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS PARTNER · mall SOP · closed
      </p>
      <h1>Buy Gambia — Jumia-style rails, empty floor</h1>
      <p>
        Live SKUs: <strong>{live.length}</strong>. We copied the useful SOP from Jumia, Konga and Mall Gambia
        (categories, Official Store after KYB, 7-day return window, seller score after 10 jobs, collector-held
        funds). We did <strong>not</strong> copy fake stock, JForce spam, or WhatsApp checkout.
      </p>
      <p>
        SLA take when a licensed collector is live: <strong>{SLA_TAKE_BPS / 100}%</strong> —{" "}
        {FORTIS_SHARE_BPS / 100}% FORTIS INVICTA, {INTEGRATOR_SHARE_BPS / 100}% integrator, 96% merchant.
        Not collectable today.
      </p>
      <h2>Categories (no listings)</h2>
      <ul>
        {MALL_CATEGORIES.map((c) => (
          <li key={c.id}>{c.label}</li>
        ))}
      </ul>
      <p>
        Official Store requires {BUYER_PROTECTION.officialStoreRequires}. Pay-on-delivery:{" "}
        {String(BUYER_PROTECTION.payOnDelivery)} (no agent network). Jumia Express warehouse:{" "}
        {String(BUYER_PROTECTION.jumiaExpressEquivalent)}.
      </p>
      <ul>
        <li>
          <Link href="/partner">Become a seller (KYB)</Link>
        </li>
        <li>
          <Link href="/services/logistics">Freight desk (on-platform thread)</Link>
        </li>
        <li>
          <Link href="/pay/transfer">GROW / Academy / Rides transfer SKUs</Link>
        </li>
      </ul>
    </main>
  );
}
