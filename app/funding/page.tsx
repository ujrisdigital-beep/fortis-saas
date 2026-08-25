import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { GRANT_WATCHLIST } from "../../lib/tools/models";

export default function FundingPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#1B4D3E" }}>GROW · FUNDING BRIEFING</p>
        <h1>Grant watchlist for Gambian operators</h1>
        <p>
          These are <strong>windows to verify on the funder site</strong>. FORTIS does not have live call
          calendars, match percentages, or authority to file on your behalf. Deadlines and envelopes from
          marketing decks are not republished here.
        </p>
        <p>
          Paid GROW diagnostic (`price_grow_diagnostic_gmd_v1`) can structure your evidence pack. Citizen
          Ombudsman remains free and is a different desk.
        </p>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
          {GRANT_WATCHLIST.map((g) => (
            <li key={g.id} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
              <h2 style={{ margin: "0 0 4px" }}>{g.title}</h2>
              <p style={{ margin: 0, color: "#64748B" }}>{g.funder} · {g.status.replaceAll("_", " ")}</p>
              <p>{g.note}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href={g.url} rel="noreferrer" target="_blank">
                  Open funder site
                </a>
                <Link href={`/funding/${g.id}/apply`}>Draft outline (not a filing)</Link>
              </div>
            </li>
          ))}
        </ul>
        <p>
          Theme checklist lives in <Link href="/grow/tools">GROW tools</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
