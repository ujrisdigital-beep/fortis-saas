import Link from "next/link";

export default function CarHirePage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Car hire</h1>
      <p>
        This page does not list a live fleet or confirm airport transfers. Instant booking and “fully insured” claims
        were removed.
      </p>
      <p>
        <Link href="/rides">Open Rides (transfer pay)</Link> for the real hire rail. Owner KYB is still required
        before any public vehicle SKU.
      </p>
    </main>
  );
}
