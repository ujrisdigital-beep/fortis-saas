import Link from "next/link";

export default function MarketplaceCheckoutPage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Checkout closed</h1>
      <p>POST /api/marketplace/checkout does not create orders or hold funds.</p>
      <Link href="/pay/transfer">Pay a catalogue SKU by transfer</Link>
    </main>
  );
}
