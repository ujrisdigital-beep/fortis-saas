export const metadata = { title: "Status — FORTIS" };

export default function StatusPage() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>Service status</h1>
      <p>Machine-readable dependency health is published at <a href="/api/v2/status">/api/v2/status</a>.</p>
      <ul>
        <li>GROW preview: available (deterministic)</li>
        <li>Email verification: required for write APIs when session flag is set</li>
        <li>Live payments: blocked</li>
        <li>Marketplace capture: blocked</li>
      </ul>
    </main>
  );
}
