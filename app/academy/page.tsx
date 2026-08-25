import Link from "next/link";
import { ACADEMY_PROGRAMMES, sectors } from "@/lib/academy/programmes";

export default function AcademyPage() {
  const tracks = sectors();
  return (
    <main style={{ maxWidth: 880, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS ACADEMY · vocational pilot
      </p>
      <h1>Skills young Gambians can actually use</h1>
      <p>
        Foundation digital literacy plus photography, media, marketing, web, data, customer work, agri and solar
        intros. Learning is free. A signed credential still needs a GMD 150 transfer assessment. We cite OER — we
        We cite OER — we do not copy Google Digital Garage or Claude Academy into this repo.
      </p>
      <p>
        <Link href="/academy/campuses">Official free campuses (Anthropic, Google, Microsoft, AWS, HF…)</Link>
        {" · "}
        <Link href="/training/hub">Browse hub</Link>
        {" · "}
        <Link href="/pay/transfer?priceId=price_academy_assessment_gmd_v1&module=academy">Pay assessment</Link>
        {" · "}
        <Link href="/training/verify">Verify</Link>
      </p>
      {tracks.map((sector) => (
        <section key={sector} style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: "1.05rem" }}>{sector}</h2>
          <ul style={{ paddingLeft: 18 }}>
            {ACADEMY_PROGRAMMES.filter((p) => p.sector === sector).map((p) => (
              <li key={p.id} style={{ marginBottom: 10 }}>
                <Link href={`/training/learn?program=${p.id}`}>{p.title}</Link>
                {" — "}
                {p.status === "external_link_only" ? "external link only" : `${p.lessons.length} lessons`}
                . {p.youthFit}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
