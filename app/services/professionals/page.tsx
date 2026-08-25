import Link from "next/link";
import { DeskThreadForm } from "../../../components/desk-thread-form";
import { publicLiveListings } from "@/lib/services/enquiries";

const CATEGORIES = [
  "Engineering",
  "Architecture",
  "Legal",
  "Health",
  "ICT",
  "Skilled trades",
  "Finance",
  "Education",
];

export default function ProfessionalsPage() {
  const live = publicLiveListings();
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS PARTNER · professionals · preview
      </p>
      <h1>Professionals directory</h1>
      <p>
        Live verified roster: <strong>{live.length}</strong>. We do not invent lawyers, doctors or ratings. A request is
        an enquiry on this platform, not a booked hour. WhatsApp is not a FORTIS rail.
      </p>
      <h2>Categories we will list after KYB</h2>
      <ul>{CATEGORIES.map((c) => <li key={c}>{c}</li>)}</ul>
      <h2>Request an introduction</h2>
      <DeskThreadForm kind="professionals" defaultSubject="Professional introduction" />
      <p>
        Professionals: <Link href="/partner">apply via Partner KYB</Link>. Learning paths:{" "}
        <Link href="/academy">Academy</Link>.
      </p>
    </main>
  );
}
