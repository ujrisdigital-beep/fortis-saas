import Link from "next/link";
import { canListProducts } from "@/lib/partner/kyb";

export default function PartnerModulePage() {
  const demo = canListProducts({ merchantId: "demo", status: "NOT_STARTED" });
  return (
    <main style={{ maxWidth: 680, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        FORTIS PARTNER · preview
      </p>
      <h1>Directory open. Commerce closed.</h1>
      <p>
        Development-partner listings are informational. Merchant SKUs cannot go live until KYB is APPROVED and a
        licensed checkout exists. Demo merchant can list products: {String(demo)}.
      </p>
      <ul>
        <li>
          <Link href="/partners">Development partners directory</Link>
        </li>
        <li>
          <Link href="/marketplace">Marketplace (empty public inventory)</Link>
        </li>
      </ul>
    </main>
  );
}
