import Link from "next/link";
import { ServiceEnquiryForm } from "../../../components/service-enquiry-form";
import { publicLiveListings } from "@/lib/services/enquiries";

const CATS = ["Construction", "Transport", "Power", "Agricultural", "Events"];

export default function EquipmentHirePage() {
  const live = publicLiveListings();
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS PARTNER · equipment · preview
      </p>
      <h1>Equipment hire</h1>
      <p>
        Live insured fleet: <strong>{live.length}</strong> machines. Demo excavators and “24/7 support” were removed.
        FORTIS does not hold deposits or escrow. Transfer pay is only for catalogue SKUs.
      </p>
      <h2>Classes we will list after owner KYB + insurance evidence</h2>
      <ul>{CATS.map((c) => <li key={c}>{c}</li>)}</ul>
      <h2>Ask for a real owner introduction</h2>
      <ServiceEnquiryForm kind="equipment" />
      <p>
        Owners: <Link href="/partner">Partner KYB</Link>. Site literacy:{" "}
        <Link href="/training/learn?program=construction-literacy">Academy construction literacy</Link>.
      </p>
    </main>
  );
}
