import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

const GROUPS = [
  {
    applet: "CORE",
    items: [
      { href: "/resources/gbos", title: "GBoS dashboard", note: "Snapshot via our APIs — not a live CBG terminal." },
      { href: "/resources/census", title: "Census series", note: "Dated PHC rows." },
    ],
  },
  {
    applet: "GROW",
    items: [
      { href: "/resources/nawec", title: "Energy & water map", note: "Regional model." },
      { href: "/resources/waste", title: "Waste planner", note: "Planning bands, not carbon credits." },
      { href: "/resources/giepa", title: "GIEPA offices", note: "Directory." },
      { href: "/resources/afcfta", title: "AfCFTA notes", note: "Briefing." },
      { href: "/resources/fintech", title: "Fintech operators", note: "Not a licence register." },
      { href: "/resources/telecom", title: "Telecom briefing", note: "Not live PURA." },
      { href: "/grow/tools", title: "GROW planners hub", note: "Solar, yield, grants watchlist." },
    ],
  },
  {
    applet: "ACADEMY",
    items: [{ href: "/resources/digital-skills", title: "Digital skills programmes", note: "Pointers, not enrolments." }],
  },
  {
    applet: "DISCOVER",
    items: [
      { href: "/resources/airport", title: "Banjul airport", note: "Weather must fail closed." },
      { href: "/resources/historical/pre-colonial", title: "Pre-colonial notes", note: "Editorial." },
    ],
  },
  {
    applet: "GOVERN",
    items: [{ href: "/resources/cybersecurity", title: "Cyber policy notes", note: "Not a SOC." }],
  },
];

export default function ResourcesIndex() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1.25rem 4rem" }}>
        <h1>National briefings</h1>
        <p>
          These are <strong>dated or modelled</strong> pages for GROW, Academy, Discover and Govern. None is a live
          NAWEC, GBoS terminal, PURA feed, or carbon registry.
        </p>
        {GROUPS.map((g) => (
          <section key={g.applet}>
            <h2>{g.applet}</h2>
            <ul>
              {g.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.title}</Link> — {i.note}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
