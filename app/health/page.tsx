"use client";

import { FormEvent, useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { clinicTriage } from "../../lib/tools/models";

export default function HealthPage() {
  const [days, setDays] = useState("2");
  const [severity, setSeverity] = useState(5);
  const [red, setRed] = useState(false);
  const [out, setOut] = useState<ReturnType<typeof clinicTriage> | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setOut(clinicTriage({ days: Number(days), severity, redFlags: red }));
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.1em" }}>PUBLIC GUIDANCE · NOT A DIAGNOSIS</p>
        <h1>When to go to a Gambian clinic</h1>
        <p>
          We do not name diseases or score malaria vs typhoid. That would be a fake diagnosis. Use this
          only to decide whether to travel to a public facility.
        </p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label>
            Days unwell
            <input type="number" min={0} value={days} onChange={(e) => setDays(e.target.value)} />
          </label>
          <label>
            How unwell (1–10): {severity}
            <input type="range" min={1} max={10} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} />
          </label>
          <label>
            <input type="checkbox" checked={red} onChange={(e) => setRed(e.target.checked)} /> Chest pain,
            confusion, uncontrolled bleeding, pregnancy emergency, or child who will not drink
          </label>
          <button type="submit">Show next step</button>
        </form>
        {out && (
          <section>
            <p>
              <strong>{out.urgency.replaceAll("_", " ")}</strong>
            </p>
            <p>{out.action}</p>
            <ul>
              {out.facilities.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
