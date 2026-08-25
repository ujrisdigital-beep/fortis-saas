/** Deterministic, labelled estimators. Never live telemetry, credit, or licensed advice. */

export const TOOL_FRESHNESS = "ILLUSTRATIVE_MODEL" as const;

export function gmd(n: number): string {
  return `GMD ${Math.round(n).toLocaleString("en-GM")}`;
}

export function estimateSolar(input: { monthlyBillGmd: number; roofSqm: number }) {
  const bill = Math.max(0, input.monthlyBillGmd);
  const roof = Math.max(0, input.roofSqm);
  const kwhPerSqmDay = 5.2; // typical Greater Banjul insolation band, not a live pyranometer
  const usable = roof * 0.65;
  const systemKw = Math.max(0.5, Math.round((usable * kwhPerSqmDay * 0.16) / 4.5 * 10) / 10);
  const costPerKw = 48_000; // installer quotes vary; assumption only
  const systemCost = systemKw * costPerKw;
  const monthlySavings = bill * 0.55; // grid still needed at night / rainy season
  const annualSavings = monthlySavings * 12;
  const paybackYears = annualSavings > 0 ? Math.round((systemCost / annualSavings) * 10) / 10 : null;
  return {
    freshness: TOOL_FRESHNESS,
    assumptions: [
      "Not a NAWEC bill, installer quote, or CBG product.",
      "Uses a 5.2 kWh/m²/day insolation band for coastal Gambia.",
      "Night and wet-season grid use remains; 55% of the bill is the modelled offset.",
    ],
    systemKw,
    systemCostGmd: systemCost,
    monthlySavingsGmd: monthlySavings,
    annualSavingsGmd: annualSavings,
    paybackYears,
  };
}

export function estimateMortgage(input: {
  priceGmd: number;
  downPercent: number;
  termYears: number;
  annualRatePercent: number;
}) {
  const price = Math.max(0, input.priceGmd);
  const down = Math.min(100, Math.max(0, input.downPercent)) / 100;
  const years = Math.max(1, input.termYears);
  const annual = Math.max(0, input.annualRatePercent) / 100;
  const loan = price * (1 - down);
  const r = annual / 12;
  const n = years * 12;
  const monthly = r === 0 ? loan / n : (loan * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  return {
    freshness: TOOL_FRESHNESS,
    assumptions: [
      "Not a bank offer. Licensed lenders in The Gambia quote their own rates.",
      "Default 18% is a planning band often cited for local mortgages, not a live CBG rate.",
      "Affordability uses a 30% of income rule of thumb only.",
    ],
    loanGmd: loan,
    downGmd: price * down,
    monthlyGmd: monthly,
    totalInterestGmd: monthly * n - loan,
    incomeNeededGmd: monthly / 0.3,
  };
}

export type WasteKind = "plastic" | "paper" | "organic";

export function estimateRecycling(input: { kind: WasteKind; kgPerMonth: number; disposalCostGmd: number }) {
  const prices: Record<WasteKind, number> = { plastic: 12, paper: 4, organic: 2 }; // GMD/kg planning
  const kg = Math.max(0, input.kgPerMonth);
  const revenue = kg * prices[input.kind];
  const avoided = Math.max(0, input.disposalCostGmd);
  return {
    freshness: TOOL_FRESHNESS,
    assumptions: [
      "Not a carbon-credit issuance or a live NEA weighbridge feed.",
      "GMD/kg bands are planning figures; buyers in Bakoteh / Mile 2 pay what they pay.",
    ],
    monthlyRevenueGmd: revenue,
    monthlyAvoidedGmd: avoided,
    monthlyNetGmd: revenue + avoided,
  };
}

export type CropId = "maize" | "rice" | "groundnuts";

export function estimateYield(input: { crop: CropId; hectares: number; rainfall: "low" | "medium" | "high" }) {
  const base: Record<CropId, number> = { maize: 1.6, rice: 2.1, groundnuts: 1.1 }; // t/ha planning
  const rain = { low: 0.7, medium: 1, high: 1.15 }[input.rainfall];
  const ha = Math.max(0, input.hectares);
  const tonnes = base[input.crop] * rain * ha;
  return {
    freshness: TOOL_FRESHNESS,
    assumptions: [
      "Not a MoA forecast or satellite NDVI product.",
      "Planning yields for rain-fed upland/lowland Gambia; irrigation and seed variety change the result.",
    ],
    tonnes,
    crop: input.crop,
    hectares: ha,
  };
}

export function digitisationScore(input: {
  employees: number;
  tools: Array<"paper" | "whatsapp" | "excel" | "accounting" | "website">;
}) {
  const weights = { paper: 5, whatsapp: 15, excel: 20, accounting: 30, website: 30 };
  const score = input.tools.reduce((s, t) => s + weights[t], 0);
  const next =
    !input.tools.includes("whatsapp")
      ? "Start with a recorded Wave/WhatsApp sales log — most Gambian SMEs already have the channel."
      : !input.tools.includes("excel")
        ? "Move weekly sales from chat into a simple sheet before buying software."
        : !input.tools.includes("accounting")
          ? "Add a GRA-ready ledger (even paper + Excel) before a paid SaaS subscription."
          : "A one-page site and GIEPA/GRA filings are the next honest step — not a fake marketplace GMV.";
  return {
    freshness: TOOL_FRESHNESS,
    score: Math.min(100, score),
    next,
    note: "Planner only. Not a World Bank Digital Adoption Index score.",
  };
}

/** Informal finance readiness — explicitly not a credit score. */
export function financeReadiness(input: {
  monthlyIncomeGmd: number;
  hasLoans: boolean;
  usesMobileMoney: boolean;
  yearsOperating: number;
}) {
  const checks = [
    { id: "income", ok: input.monthlyIncomeGmd > 0, label: "You recorded a monthly income figure" },
    { id: "wallet", ok: input.usesMobileMoney, label: "You use Wave / Africell Money / QMoney (transaction trail)" },
    { id: "age", ok: input.yearsOperating >= 1, label: "Business has operated at least one season" },
    { id: "debt", ok: !input.hasLoans, label: "No existing loan (or you will disclose it to a licensed lender)" },
  ];
  const ready = checks.filter((c) => c.ok).length;
  return {
    freshness: TOOL_FRESHNESS,
    product: "readiness_checklist" as const,
    notACreditScore: true,
    checks,
    readyCount: ready,
    advice:
      "FORTIS does not issue credit scores, CRR reports, or loan offers. Licensed banks and microfinance houses in The Gambia underwrite themselves.",
  };
}

export function clinicTriage(input: { days: number; severity: number; redFlags: boolean }) {
  const urgent = input.redFlags || input.severity >= 8 || input.days >= 7;
  return {
    freshness: TOOL_FRESHNESS,
    notADiagnosis: true,
    urgency: urgent ? "go_to_clinic" : input.severity >= 4 ? "book_clinic" : "self_care_watch",
    action: urgent
      ? "This is not a diagnosis. Go to the nearest public facility (EFSTH Banjul, Serrekunda General, or your regional hospital)."
      : "This is not a diagnosis. Rest, oral rehydration, and a clinic visit if fever persists in malaria season.",
    facilities: [
      "Edward Francis Small Teaching Hospital — Banjul",
      "Serrekunda General Hospital — Kanifing",
      "Bansang Hospital — CRR",
    ],
  };
}

export function tourismOccupancy(input: {
  rooms: number;
  occupancyPercent: number;
  nightlyGmd: number;
}) {
  const rooms = Math.max(0, input.rooms);
  const occ = Math.min(100, Math.max(0, input.occupancyPercent)) / 100;
  const nightly = Math.max(0, input.nightlyGmd);
  const monthly = rooms * occ * nightly * 30;
  return {
    freshness: TOOL_FRESHNESS,
    assumptions: [
      "Not a GTA visitor census or a live booking feed.",
      "Peak (Nov–Apr) and rainy-season occupancy differ sharply on the Atlantic coast.",
    ],
    monthlyRevenueGmd: monthly,
  };
}

export type GrantWatch = {
  id: string;
  title: string;
  funder: string;
  url: string;
  themes: string[];
  status: "VERIFY_ON_FUNDER_SITE";
  note: string;
};

export const GRANT_WATCHLIST: GrantWatch[] = [
  {
    id: "afdb",
    title: "African Development Bank SME / digital windows",
    funder: "AfDB",
    url: "https://www.afdb.org",
    themes: ["saas", "sme"],
    status: "VERIFY_ON_FUNDER_SITE",
    note: "Calls open and close. Confirm on afdb.org — we do not list a live deadline.",
  },
  {
    id: "gcf",
    title: "Green Climate Fund country programmes",
    funder: "GCF",
    url: "https://www.greenclimate.fund",
    themes: ["energy", "climate"],
    status: "VERIFY_ON_FUNDER_SITE",
    note: "Access is usually through the NDA / accredited entities, not a public AI form.",
  },
  {
    id: "ifad",
    title: "IFAD rural development",
    funder: "IFAD",
    url: "https://www.ifad.org",
    themes: ["agriculture"],
    status: "VERIFY_ON_FUNDER_SITE",
    note: "Typically government-implemented. SMEs join as service providers, not as the grant holder.",
  },
  {
    id: "undp",
    title: "UNDP Gambia country office calls",
    funder: "UNDP",
    url: "https://www.undp.org/gambia",
    themes: ["sme", "energy", "governance"],
    status: "VERIFY_ON_FUNDER_SITE",
    note: "Watch undp.org/gambia procurement and innovation notices.",
  },
  {
    id: "fcdo",
    title: "UK FCDO / British High Commission notices",
    funder: "FCDO",
    url: "https://www.gov.uk/world/gambia",
    themes: ["sme"],
    status: "VERIFY_ON_FUNDER_SITE",
    note: "Leeds/UK time zone operators should still apply on official GOV.UK pages only.",
  },
];

export function grantFit(themes: string[]) {
  return GRANT_WATCHLIST.map((g) => {
    const overlap = g.themes.filter((t) => themes.includes(t)).length;
    return {
      ...g,
      overlap,
      label: overlap ? "theme overlap — still verify" : "weak theme overlap",
    };
  }).sort((a, b) => b.overlap - a.overlap);
}

export function outlineGrantDraft(input: { funder: string; project: string; org: string }) {
  return [
    `DRAFT OUTLINE — not a submission to ${input.funder}.`,
    `Organisation: ${input.org || "(name)"}`,
    `Project: ${input.project || "(describe)"}`,
    "1. Problem in The Gambia (cite GBOS / MoA / NAWEC published stats you actually have).",
    "2. What you will deliver in 12 months (countable).",
    "3. Who benefits (region, sex, youth) — no invented headcount.",
    "4. Budget in GMD and USD with a dated FX source.",
    "5. Risks: rain, FX, procurement, PSP not live.",
    "Human review required. Do not file this outline as an official application.",
  ].join("\n");
}
