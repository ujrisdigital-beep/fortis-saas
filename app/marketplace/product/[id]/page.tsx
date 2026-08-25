import Link from "next/link";

export default function MarketplaceProductPage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Product not listed</h1>
      <p>There is no live SKU at this URL.</p>
      <Link href="/marketplace">Marketplace</Link>
    </main>
  );
}
