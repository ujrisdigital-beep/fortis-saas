import Link from "next/link";
import { Navbar } from "../../../components/navbar";
import { Footer } from "../../../components/footer";

const TOOLS = [
  { href: "/funding", applet: "GROW", title: "Grant watchlist", blurb: "Funder sites to verify. No fake deadlines or match scores." },
  { href: "/fintech", applet: "GROW", title: "Finance readiness", blurb: "Record checklist. Not a credit score or loan offer." },
  { href: "/saas", applet: "GROW", title: "Digitisation planner", blurb: "What to computerise next. GRA/GIEPA filings stay yours." },
  { href: "/energy", applet: "GROW", title: "Solar bill estimator", blurb: "Illustrative kW and payback. Not a NAWEC or installer quote." },
  { href: "/resources/nawec", applet: "GROW", title: "Energy & water briefing", blurb: "Regional comparison model. Not a live NAWEC SCADA feed." },
  { href: "/waste", applet: "GROW", title: "Recycling planner", blurb: "GMD/kg planning bands. Not carbon credits or NEA live tonnes." },
  { href: "/agriculture", applet: "GROW", title: "Rain-fed yield planner", blurb: "Maize, rice, groundnuts. Not a MoA forecast." },
  { href: "/smart-agriculture", applet: "ACADEMY", title: "Indigenous crop briefs", blurb: "Teaching notes for Faidherbia, moringa, cowpea. Not farm ROI guarantees." },
  { href: "/smart-livestock", applet: "ACADEMY", title: "Breed & BSFL notes", blurb: "N’Dama and circular feed education. Not an investment prospectus." },
  { href: "/housing", applet: "GROW", title: "Mortgage maths", blurb: "Amortisation you typed. Not a Trust Bank offer." },
  { href: "/tourism", applet: "DISCOVER", title: "Occupancy sketch", blurb: "Rooms × rate × occupancy. Not GTA arrivals." },
  { href: "/services/logistics", applet: "PARTNER", title: "Logistics desk", blurb: "Freight index + in-house thread. No WhatsApp. Pay/escrow/commission gated." },
  { href: "/services/equipment-hire", applet: "PARTNER", title: "Equipment desk", blurb: "Empty fleet. On-platform enquiry only until owner KYB + PSP." },
  { href: "/health", applet: "GOVERN / public", title: "Clinic triage", blurb: "When to travel to EFSTH or your regional hospital. No disease names." },
];

export default function GrowToolsPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#C4943A" }}>FORTIS GROW™ TOOLS</p>
        <h1>Gambia-fit planners</h1>
        <p>
          Pasted Fortis OS calculators were re-homed here. Every number is an <strong>illustrative model</strong>{" "}
          unless a dated public source is named. Live cards, escrow, carbon registries, and credit scores stay off.
        </p>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {TOOLS.map((t) => (
            <li key={t.href} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>{t.applet}</p>
              <h2 style={{ margin: "4px 0" }}>
                <Link href={t.href}>{t.title}</Link>
              </h2>
              <p style={{ margin: 0 }}>{t.blurb}</p>
            </li>
          ))}
        </ul>
        <p>
          Full GROW blueprint: <Link href="/grow/workspace">workspace</Link> · GMD 250 transfer.
        </p>
      </main>
      <Footer />
    </>
  );
}
