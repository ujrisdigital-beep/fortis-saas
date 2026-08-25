import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  clinicTriage,
  financeReadiness,
  grantFit,
  outlineGrantDraft,
  estimateMortgage,
  estimateSolar,
} from "../../lib/tools/models";

describe("Gambia planners stay honest", () => {
  it("refuses to be a credit score", () => {
    const r = financeReadiness({
      monthlyIncomeGmd: 20000,
      hasLoans: false,
      usesMobileMoney: true,
      yearsOperating: 3,
    });
    expect(r.notACreditScore).toBe(true);
    expect(r.product).toBe("readiness_checklist");
    expect(r.advice).toMatch(/does not issue credit scores/i);
  });

  it("does not diagnose disease", () => {
    const t = clinicTriage({ days: 8, severity: 9, redFlags: true });
    expect(t.notADiagnosis).toBe(true);
    expect(t.urgency).toBe("go_to_clinic");
    expect(JSON.stringify(t)).not.toMatch(/Malaria|Typhoid/);
  });

  it("labels solar and mortgage as models", () => {
    const s = estimateSolar({ monthlyBillGmd: 2500, roofSqm: 40 });
    expect(s.freshness).toBe("ILLUSTRATIVE_MODEL");
    expect(s.systemKw).toBeGreaterThan(0);
    const m = estimateMortgage({ priceGmd: 2_500_000, downPercent: 20, termYears: 15, annualRatePercent: 18 });
    expect(m.monthlyGmd).toBeGreaterThan(0);
    expect(m.assumptions.join(" ")).toMatch(/Not a bank offer/);
  });

  it("grant watchlist has no fake deadlines or match scores", () => {
    const rows = grantFit(["sme", "energy"]);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((g) => g.status === "VERIFY_ON_FUNDER_SITE")).toBe(true);
    const outline = outlineGrantDraft({ funder: "AfDB", org: "Test", project: "SME ledger" });
    expect(outline).toMatch(/not a submission/i);
  });

  it("public pages dropped fake credit and live NAWEC claims", () => {
    const fintech = readFileSync("app/fintech/page.tsx", "utf8");
    const funding = readFileSync("app/funding/page.tsx", "utf8");
    const nawec = readFileSync("app/resources/nawec/page.tsx", "utf8");
    const health = readFileSync("app/health/page.tsx", "utf8");
    expect(fintech).not.toMatch(/Credit Score Estimator|Max Loan/);
    expect(funding).not.toMatch(/Generate Full Application|Avg Match Score/);
    expect(nawec).not.toMatch(/Real-time electricity|\$85M|42,000 tCO/);
    expect(health).not.toMatch(/Possible Conditions|Malaria/);
  });
});
