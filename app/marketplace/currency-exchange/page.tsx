import Link from "next/link";

export default function CurrencyExchangePage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Forex desk</h1>
      <p>
        Hard-coded D70/D85 rates are not CBG. FORTIS is not a licensed bureau. “Initiate transaction” does not move
        money.
      </p>
      <p>
        Live FX GET is <Link href="/api/marketplace/currency-rates">open-data only</Link> and labelled not official CBG.
        For a teaching index see <Link href="/services/logistics">logistics</Link>.
      </p>
    </main>
  );
}
