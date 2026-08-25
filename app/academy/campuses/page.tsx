import Link from "next/link";
import { campusesByDoor, GLOBAL_CAMPUSES } from "@/lib/academy/global-campuses";

const DOORS = [
  { id: "1_start" as const, title: "Door 1 — start", blurb: "Fluency, no degree required." },
  { id: "2_builder" as const, title: "Door 2 — builder", blurb: "Cloud, web, open models." },
  { id: "3_specialist" as const, title: "Door 3 — specialist", blurb: "Deep learning after you can code." },
];

export default function AcademyCampusesPage() {
  return (
    <main style={{ maxWidth: 840, margin: "2rem auto", padding: "0 1rem 4rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#1B4D3E" }}>FORTIS ACADEMY · EXTERNAL CAMPUSES</p>
      <h1>Best-school doors (official, mostly free)</h1>
      <p>
        Same idea as Anthropic’s <a href="https://academy.claude.com">academy.claude.com</a>: learn on the vendor’s
        site. FORTIS <strong>does not</strong> copy their lessons, mint their LinkedIn badge, or sell the paid Claude
        Certified / AWS / Microsoft exams. Our HMAC credential is only after a{" "}
        <Link href="/pay/transfer?priceId=price_academy_assessment_gmd_v1&module=academy">GMD 150 assessment</Link> on
        a FORTIS vocational programme.
      </p>
      <p>
        {GLOBAL_CAMPUSES.length} campuses listed. Counts on their sites change; we do not freeze “22 courses / 357
        resources.” Paid Gumroad guides from YouTube descriptions are not listed.
      </p>
      {DOORS.map((d) => (
        <section key={d.id} style={{ marginTop: 28 }}>
          <h2>
            {d.title} — {d.blurb}
          </h2>
          <ul>
            {campusesByDoor(d.id).map((c) => (
              <li key={c.id} style={{ marginBottom: 14 }}>
                <a href={c.url} rel="noreferrer" target="_blank">
                  {c.name}
                </a>{" "}
                · {c.org} · {c.kind.replaceAll("_", " ")}
                <br />
                {c.whyGambia}
                <br />
                <small>
                  Cost: {c.cost} Credential: {c.credential} {c.note}
                </small>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        <Link href="/academy">Back to vocational outlines</Link>
      </p>
    </main>
  );
}
