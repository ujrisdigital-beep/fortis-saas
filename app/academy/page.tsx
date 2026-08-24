"use client";

import Link from "next/link";

export default function AcademyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS ACADEMY · pilot
      </p>
      <h1>Learn free. Pay only for a signed assessment.</h1>
      <p>
        Courses stay open. Certificates are HMAC-signed server records — not blockchain, not a hash you type in.
        Assessment unlocks after a GMD 150 transfer (price_academy_assessment_gmd_v1).
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
        <Link href="/training/hub">Open training hub</Link>
        <Link href="/training/verify">Verify a credential</Link>
        <Link href="/pay/transfer?priceId=price_academy_assessment_gmd_v1&module=academy">Pay for assessment</Link>
      </div>
    </main>
  );
}
