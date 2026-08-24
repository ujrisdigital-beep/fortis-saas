"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ACADEMY_PROGRAMMES, type AcademyProgramme } from "@/lib/academy/programmes";

export default function LearnPage() {
  const programId = useMemo(() => {
    if (typeof window === "undefined") return "digital-literacy";
    return new URLSearchParams(window.location.search).get("program")
      ?? new URLSearchParams(window.location.search).get("course")
      ?? "digital-literacy";
  }, []);

  const programme: AcademyProgramme | undefined = ACADEMY_PROGRAMMES.find((p) => p.id === programId)
    ?? ACADEMY_PROGRAMMES[0];

  const [questions, setQuestions] = useState<{ id: string; prompt: string; options: string[] }[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    fetch(`/api/v2/academy/programmes/${programme.id}`)
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions ?? []))
      .catch(() => setQuestions([]));
  }, [programme.id]);

  async function submit() {
    const res = await fetch("/api/training/assess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        programId: programme.assessmentProgramId,
        answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex })),
        tabSwitches: 0,
        timeSpentSeconds: 90,
      }),
    });
    const data = await res.json();
    setResult(data.message ?? data.error ?? "No response");
  }

  if (programme.status === "external_link_only") {
    return (
      <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem", fontFamily: "DM Sans, system-ui" }}>
        <h1>{programme.title}</h1>
        <p>{programme.summary}</p>
        <a href={programme.sources[0]?.url} target="_blank" rel="noreferrer">Open the external provider</a>
        <p>FORTIS does not copy this curriculum or re-issue their badge.</p>
        <Link href="/academy">Back to Academy</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem 3rem", fontFamily: "DM Sans, system-ui" }}>
      <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>{programme.sector} · {programme.level}</p>
      <h1>{programme.title}</h1>
      <p>{programme.summary}</p>
      <p><strong>Who it is for:</strong> {programme.youthFit}</p>
      <ol>
        {programme.lessons.map((l) => (
          <li key={l.id} style={{ marginBottom: 12 }}>
            <strong>{l.title}</strong> ({l.minutes} min) — {l.brief}
          </li>
        ))}
      </ol>
      <h2>Sources (cited, not claimed as FORTIS originals)</h2>
      <ul>
        {programme.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">{s.name}</a> · {s.licence} · {s.use}
          </li>
        ))}
      </ul>
      {questions.length > 0 && (
        <section>
          <h2>Practice paper (server graded — no answer key here)</h2>
          {questions.map((q) => (
            <fieldset key={q.id} style={{ border: "1px solid #e5e7eb", marginBottom: 12, padding: 12 }}>
              <legend>{q.prompt}</legend>
              {q.options.map((opt, i) => (
                <label key={opt} style={{ display: "block" }}>
                  <input
                    type="radio"
                    name={q.id}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  />{" "}
                  {opt}
                </label>
              ))}
            </fieldset>
          ))}
          <button type="button" onClick={submit}>Submit to server</button>
          {result && <p>{result}</p>}
        </section>
      )}
      <p style={{ marginTop: 24 }}>
        <Link href="/academy">All programmes</Link>
        {" · "}
        <Link href="/pay/transfer?priceId=price_academy_assessment_gmd_v1&module=academy">Unlock signed assessment</Link>
      </p>
    </main>
  );
}
