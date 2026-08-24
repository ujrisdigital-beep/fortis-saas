import Link from "next/link";

export default function MarketplacePage() {
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS PARTNER · marketplace · closed
      </p>
      <h1>Buy Gambia — no live inventory</h1>
      <p>
        Public catalogue is empty. Demo batik and shea SKUs are not for sale. FORTIS does not hold escrow. Checkout
        returns 503 until KYB + a licensed PSP exist.
      </p>
      <ul>
        <li>
          <Link href="/partner">Partner KYB</Link>
        </li>
        <li>
          <Link href="/api/marketplace/products">GET products JSON (empty)</Link>
        </li>
        <li>
          <Link href="/pay/transfer">Transfer rail (GROW / Academy / Rides SKUs only)</Link>
        </li>
      </ul>
    </main>
  );
}
