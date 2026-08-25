import Link from "next/link";

export default function MarketplaceCartPage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Cart</h1>
      <p>Nothing to hold. There is no escrow-protected checkout.</p>
      <Link href="/marketplace">Back to marketplace</Link>
    </main>
  );
}
