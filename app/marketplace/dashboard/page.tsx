export default function MarketplaceDashboardPage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Marketplace trust dashboard</h1>
      <p>There are no live transactions, escrow balances, or seller leagues. Jittered “LIVE” counters were removed.</p>
      <ul>
        <li>Orders: 0</li>
        <li>GMD in escrow: 0 (FORTIS is not a custodian)</li>
        <li>Active listings: 0</li>
      </ul>
    </main>
  );
}
