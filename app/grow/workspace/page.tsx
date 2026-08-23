export const metadata = { title: "GROW workspace — FORTIS" };

export default function GrowWorkspacePage() {
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ letterSpacing: "0.08em", fontSize: 12, color: "#C4943A" }}>FORTIS GROW™ · PILOT</p>
      <h1>Strategy workspace</h1>
      <p>
        Free preview uses the deterministic UJU engine. A full blueprint export requires a verified
        entitlement. Scores are advisory and not authorised for bank credit decisions.
      </p>
      <ul>
        <li>POST /api/v2/grow/assessments — preview + citations</li>
        <li>GET /api/v2/grow/grants — catalogue matches with source dates (editorial scores)</li>
        <li>Sources carry GBoS/CBG freshness; stale values are never labelled current</li>
      </ul>
    </main>
  );
}
