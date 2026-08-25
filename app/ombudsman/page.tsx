"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function OmbudsmanPage() {
  const [msg, setMsg] = useState("");
  const [lookup, setLookup] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const exclusions = ["sub_judice", "judicial_function", "national_security"].filter((k) => fd.get(k) === "on");
    const res = await fetch("/api/v2/govern/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "ombudsman",
        subject: fd.get("subject"),
        body: fd.get("body"),
        category: fd.get("category"),
        organisationNamed: fd.get("organisationNamed"),
        contact: fd.get("contact"),
        consent: fd.get("consent") === "on",
        whistleblower: fd.get("whistleblower") === "on",
        againstPublicAuthority: fd.get("againstPublicAuthority") === "on",
        exhaustedInternal: fd.get("exhaustedInternal") === "on",
        awarenessDate: fd.get("awarenessDate") || undefined,
        timeExtensionReason: fd.get("timeExtensionReason") || undefined,
        exclusionsDeclared: exclusions,
      }),
    });
    const data = await res.json();
    setMsg(
      res.ok
        ? `${data.reference} — ${data.message} Human admissibility still required. Recommendations are not a court order.`
        : data.error ?? "Failed",
    );
  }

  async function check(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`/api/v2/govern/complaints?reference=${encodeURIComponent(lookup)}`);
    const data = await res.json();
    setMsg(res.ok ? `${data.reference}: ${data.status}. ${data.notice}` : data.error ?? "Not found");
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem 3.5rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1B4D3E" }}>
        Public Ombudsman desk · free · human-led
      </p>
      <h1>Technology to make Ombudsman work easier</h1>
      <p>
        This desk uses technology so the <strong>Office of the Ombudsman</strong> can intake, track and review cases
        with less paper — and so the public can lodge and follow a complaint without paying. FORTIS hosts and
        maintains it <strong>on behalf of</strong> the Office. It does <strong>not</strong> replace the Office, the
        courts, or the police. IKENGA/UJRIS may flag gaps; <strong>only a human officer</strong> decides
        admissibility. Recommendations are <strong>advisory</strong>.
      </p>
      <p>
        Private FORTIS/marketplace issues are not Ombudsman Act cases — use{" "}
        <Link href="/marketplace/disputes">platform dispute</Link>.
      </p>
      <h2>We cannot take (statutory exclusions)</h2>
      <ul>
        <li>Matters before a court (sub judice)</li>
        <li>Judicial functions of courts</li>
        <li>National security / defence / foreign relations except as the law allows</li>
        <li>Trivial or bad-faith complaints</li>
        <li>More than 12 months after you knew, unless you explain a reason to extend</li>
      </ul>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <label>
          <input type="checkbox" name="againstPublicAuthority" defaultChecked /> This is about a public authority (ministry, council, statutory body, public utility)
        </label>
        <label>
          Category
          <select name="category" defaultValue="maladministration">
            <option value="maladministration">Maladministration / abuse of power</option>
            <option value="delay">Unreasonable delay</option>
            <option value="unfair_treatment">Unjust or oppressive conduct</option>
            <option value="service_failure">Failure to deliver a public service</option>
            <option value="access_to_information">Access to information</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Subject
          <input name="subject" required placeholder="Short title" />
        </label>
        <label>
          Public body
          <input name="organisationNamed" placeholder="Name of the office" />
        </label>
        <label>
          What happened
          <textarea name="body" required rows={6} placeholder="Dates, what you asked, what they did" />
        </label>
        <label>
          When you first knew
          <input type="date" name="awarenessDate" />
        </label>
        <label>
          If more than 12 months, why extend?
          <input name="timeExtensionReason" />
        </label>
        <label>
          <input type="checkbox" name="exhaustedInternal" /> I already used that office’s own complaint process (or it does not work / does not exist)
        </label>
        <label>
          Contact (required unless whistleblower)
          <input name="contact" placeholder="Phone or email" />
        </label>
        <label>
          <input type="checkbox" name="whistleblower" /> Treat as protected / unnamed whistleblower
        </label>
        <fieldset>
          <legend>Tick if this complaint is one of these (we still send it to a human)</legend>
          <label>
            <input type="checkbox" name="sub_judice" /> Already in court
          </label>
          <label>
            <input type="checkbox" name="judicial_function" /> About a judge or court decision
          </label>
          <label>
            <input type="checkbox" name="national_security" /> National security / defence / foreign relations
          </label>
        </fieldset>
        <label>
          <input type="checkbox" name="consent" /> I consent under the Data Protection and Privacy Act 2019 to this record being stored for Ombudsman officers
        </label>
        <button type="submit">Lodge free complaint</button>
      </form>
      <h2>Track a reference</h2>
      <form onSubmit={check} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="OMB-2026-123456" />
        <button type="submit">Look up</button>
      </form>
      {msg && <p role="status">{msg}</p>}
      <p>
        Evidence: <Link href="/evidence">upload</Link> (scan fail-closed). Officers: case states RECEIVED → TRIAGED →
        CLOSED only by humans.
      </p>
    </main>
  );
}
