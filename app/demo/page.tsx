import Link from "next/link";

export default function DemoPage() {
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Honest pilot walkthrough</h1>
      <p>This is not a video ad and not a live-money demo. Click the real surfaces.</p>
      <ol>
        <li>
          <Link href="/onboarding">Create an account</Link> — role is PUBLIC.
        </li>
        <li>
          <Link href="/grow/workspace">GROW preview</Link> — not a credit score.
        </li>
        <li>
          <Link href="/pay/transfer">Transfer instruction</Link> — GMD catalogue only; provisional after evidence.
        </li>
        <li>
          <Link href="/academy">Academy</Link> — vocational outlines; HMAC cert after paid assessment.
        </li>
        <li>
          <Link href="/services/professionals">Professionals</Link> / <Link href="/services/equipment-hire">equipment</Link> —{" "}
          <strong>zero</strong> live listings.
        </li>
        <li>
          <Link href="/govern">Govern intake</Link> — consent, no judgment.
        </li>
        <li>
          <Link href="/api/v2/status">Status JSON</Link>
        </li>
      </ol>
      <p>
        Public commerce in The Gambia is <strong>not</strong> launch-ready. See{" "}
        <Link href="/privacy">privacy</Link> and docs/LAUNCH_READINESS.md.
      </p>
    </main>
  );
}
