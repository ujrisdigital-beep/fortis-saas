"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { financeReadiness } from "../../lib/tools/models";

export default function FintechPage() {
  const [income, setIncome] = useState("15000");
  const [hasLoans, setHasLoans] = useState(false);
  const [mm, setMm] = useState(true);
  const [years, setYears] = useState("2");
  const [out, setOut] = useState<ReturnType<typeof financeReadiness> | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setOut(
      financeReadiness({
        monthlyIncomeGmd: Number(income),
        hasLoans,
        usesMobileMoney: mm,
        yearsOperating: Number(years),
      }),
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem" }}>
        <p style={{ letterSpacing: "0.1em", fontSize: 12, color: "#1B4D3E" }}>GROW · NOT A CREDIT SCORE</p>
        <h1>Informal finance readiness checklist</h1>
        <p>
          FORTIS does not estimate creditworthiness, CRR scores, or loan eligibility. Licensed banks and
          microfinance institutions in The Gambia underwrite themselves. This checklist only shows whether
          you have the records a lender will usually ask for.
        </p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            Typical monthly income (GMD)
            <input type="number" min={0} value={income} onChange={(e) => setIncome(e.target.value)} />
          </label>
          <label>
            <input type="checkbox" checked={hasLoans} onChange={(e) => setHasLoans(e.target.checked)} /> Existing
            loans (disclose them)
          </label>
          <label>
            <input type="checkbox" checked={mm} onChange={(e) => setMm(e.target.checked)} /> Active Wave /
            Africell Money / QMoney
          </label>
          <label>
            Years operating
            <input type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} />
          </label>
          <button type="submit">Run checklist</button>
        </form>
        {out && (
          <section>
            <p>
              {out.readyCount}/{out.checks.length} records in place. {out.advice}
            </p>
            <ul>
              {out.checks.map((c) => (
                <li key={c.id}>
                  {c.ok ? "Yes" : "No"} — {c.label}
                </li>
              ))}
            </ul>
            <p>
              Want a structured evidence pack? <Link href="/grow/workspace">GROW diagnostic</Link> (GMD 250
              transfer, advisory only).
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
