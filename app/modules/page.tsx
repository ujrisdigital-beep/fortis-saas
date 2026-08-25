import Link from "next/link";
import { MODULE_LAUNCH } from "@/lib/core/modules";

export default function ModulesPage() {
  return (
    <main style={{ maxWidth: 880, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
      <h1>SBN modules</h1>
      <p>Live card capture stays off. Transfer pay is the only paid rail.</p>
      <div style={{ display: "grid", gap: 12 }}>
        {MODULE_LAUNCH.map((m) => (
          <article key={m.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <p style={{ margin: 0, fontSize: 12, textTransform: "uppercase" }}>
              {m.maturity} · {m.launched ? "launched" : "gated"}
            </p>
            <h2 style={{ margin: "4px 0" }}>{m.name}</h2>
            <p>{m.summary}</p>
            {m.launched ? <Link href={m.href}>Open {m.id} →</Link> : <span>Flag {m.flag} is off</span>}
          </article>
        ))}
      </div>
    </main>
  );
}
