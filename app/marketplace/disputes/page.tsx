import Link from "next/link";

export default function DisputesPage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Disputes</h1>
      <p>
        There is no paid order to dispute and no UJRIS 72-hour guarantee. Filing here does not freeze funds.
      </p>
      <p>
        Use <Link href="/govern">GOVERN intake</Link> for a consented complaint, or{" "}
        <Link href="/services/professionals">request a professional introduction</Link>.
      </p>
    </main>
  );
}
