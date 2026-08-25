import Link from "next/link";
import { DeskThreadForm } from "../../../components/desk-thread-form";
import { EQUIPMENT_CLASSES, PLATFORM_COMMISSION_BPS } from "@/lib/services/desk";
import { publicLiveListings } from "@/lib/services/enquiries";

export default function EquipmentHirePage() {
  const live = publicLiveListings();
  return (
    <main style={{ maxWidth: 760, margin: "2rem auto", padding: "0 1rem 4rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#1B4D3E" }}>PARTNER · EQUIPMENT DESK</p>
      <h1>Equipment hire</h1>
      <p>
        Live machines on FORTIS: <strong>{live.length}</strong>. Euro day-rates, “available now”, waitlists and
        WhatsApp quotes were demo inventory. We will take deposit + {PLATFORM_COMMISSION_BPS / 100}% commission{" "}
        <em>on this platform</em> only after owner KYB, insurance evidence, and a licensed PSP.
      </p>
      <h2>Classes (empty until KYB)</h2>
      <ul>
        {EQUIPMENT_CLASSES.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <h2>On-platform thread</h2>
      <DeskThreadForm kind="equipment" defaultSubject="Equipment hire request" />
      <p>
        Owners list via <Link href="/partner">Partner KYB</Link>. Site literacy:{" "}
        <Link href="/academy">Academy</Link>. Logistics: <Link href="/services/logistics">desk</Link>.
      </p>
    </main>
  );
}
