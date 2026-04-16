type UjuCycleInput = {
  businessOverview?: string;
  currentStage?: string;
  keyBottleneck?: string;
  goals?: string;
  marketSignals?: string;
};

type IkengaInput = {
  brandName?: string;
  positioning?: string;
  audience?: string;
  channels?: string;
  differentiators?: string;
  notes?: string;
};

type AskUjrisInput = {
  documentText?: string;
  documentType?: string;
  concern?: string;
};

function normalizeText(value: string | undefined) {
  return (value ?? "").trim();
}

function mergeText(parts: Array<string | undefined>) {
  return parts.map(normalizeText).filter(Boolean).join(" ");
}

function splitKeywords(text: string) {
  const blacklist = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "into",
    "your",
    "their",
    "have",
    "will",
    "about",
    "after",
    "before",
    "there",
    "which",
    "while",
    "where",
    "when",
    "been",
    "being",
    "also",
    "each",
    "more",
    "than",
    "through",
    "between",
  ]);

  const matches = text.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? [];
  const counts = new Map<string, number>();

  for (const word of matches) {
    if (blacklist.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([word]) => word);
}

function countMatches(text: string, patterns: string[]) {
  return patterns.reduce((score, pattern) => {
    const regex = new RegExp(`\\b${pattern}\\b`, "gi");
    return score + (text.match(regex)?.length ?? 0);
  }, 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function scoreBand(score: number) {
  if (score >= 80) return "high";
  if (score >= 60) return "moderate";
  return "low";
}

function firstSentence(text: string) {
  const sentence = text.split(/(?<=[.!?])\s+/)[0]?.trim();
  return sentence || "No supporting detail supplied.";
}

export function analyzeUjuCycle(input: UjuCycleInput) {
  const combined = mergeText([
    input.businessOverview,
    input.currentStage,
    input.keyBottleneck,
    input.goals,
    input.marketSignals,
  ]);

  const readinessTerms = ["process", "team", "system", "cashflow", "customer", "sales", "growth", "plan"];
  const frictionTerms = ["delay", "debt", "manual", "churn", "risk", "unclear", "blocked", "bottleneck"];
  const scaleTerms = ["expand", "scale", "partner", "invest", "automate", "launch", "pipeline", "recurring"];

  const readinessScore = clamp(42 + countMatches(combined, readinessTerms) * 6 + splitKeywords(combined).length * 2, 35, 96);
  const frictionScore = clamp(18 + countMatches(combined, frictionTerms) * 8, 10, 94);
  const scaleScore = clamp(28 + countMatches(combined, scaleTerms) * 7, 20, 95);

  const phase = readinessScore >= 78
    ? "Deploy"
    : readinessScore >= 62
      ? "Design"
      : "Diagnose";

  const recommendations = [
    readinessScore < 70 ? "Document a single operating rhythm for sales, delivery, and reporting." : "Lock the existing operating rhythm into repeatable weekly reviews.",
    frictionScore >= 45 ? "Remove the main bottleneck with one owner, one deadline, and one measurable outcome." : "Protect momentum by tracking one leading indicator per business unit.",
    scaleScore < 60 ? "Build a tighter partner and pipeline map before adding new offers." : "Prepare the next-stage expansion brief for investors or strategic partners.",
  ];

  return {
    tool: "uju-cycle",
    label: "Business transformation analyzer",
    phase,
    summary: `The business is in the ${phase.toLowerCase()} phase with ${scoreBand(readinessScore)} transformation readiness and ${scoreBand(scaleScore)} scale momentum.`,
    headlineFinding: firstSentence(combined),
    scores: {
      transformationReadiness: readinessScore,
      executionFriction: frictionScore,
      scaleMomentum: scaleScore,
    },
    priorities: recommendations,
    detectedSignals: splitKeywords(combined),
    received: input,
  };
}

export function analyzeIkenga(input: IkengaInput) {
  const combined = mergeText([
    input.brandName,
    input.positioning,
    input.audience,
    input.channels,
    input.differentiators,
    input.notes,
  ]);

  const clarityTerms = ["clear", "premium", "trusted", "community", "solution", "outcome", "value"];
  const visibilityTerms = ["instagram", "facebook", "tiktok", "linkedin", "email", "website", "press", "campaign"];
  const distinctivenessTerms = ["unique", "first", "proprietary", "local", "heritage", "specialist", "flagship"];

  const clarityScore = clamp(40 + countMatches(combined, clarityTerms) * 7, 30, 96);
  const visibilityScore = clamp(30 + countMatches(combined, visibilityTerms) * 8, 25, 95);
  const differentiationScore = clamp(36 + countMatches(combined, distinctivenessTerms) * 9 + splitKeywords(combined).length, 28, 97);
  const brandStrength = clamp(Math.round((clarityScore + visibilityScore + differentiationScore) / 3), 30, 96);

  const recommendations = [
    clarityScore < 65 ? "Tighten the one-sentence positioning statement until it names audience, problem, and outcome." : "Keep the positioning stable and reuse it across every public touchpoint.",
    visibilityScore < 65 ? "Choose two channels and publish on a fixed cadence before expanding reach." : "Convert current channel traction into case studies and proof assets.",
    differentiationScore < 65 ? "Promote one specific proof point that competitors cannot easily copy." : "Turn the strongest differentiator into a campaign theme and landing-page promise.",
  ];

  return {
    tool: "ikenga",
    label: "Brand intelligence assessor",
    summary: `${normalizeText(input.brandName) || "This brand"} shows ${scoreBand(brandStrength)} brand strength with ${scoreBand(differentiationScore)} market distinctiveness.`,
    scores: {
      brandStrength,
      signalClarity: clarityScore,
      visibility: visibilityScore,
      marketDistinctiveness: differentiationScore,
    },
    signals: splitKeywords(combined),
    recommendations,
    received: input,
  };
}

function extractEntities(text: string) {
  const money = text.match(/(?:GMD|USD|EUR|GBP|NGN|\$|€|£)\s?\d[\d,]*(?:\.\d+)?/g) ?? [];
  const dates = text.match(/\b(?:\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/gi) ?? [];
  const emails = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  return {
    money,
    dates,
    emails,
  };
}

export function analyzeAskUjris(input: AskUjrisInput) {
  const documentText = normalizeText(input.documentText);
  const concern = normalizeText(input.concern).toLowerCase();
  const combined = mergeText([documentText, input.documentType, input.concern]);

  const riskTerms = ["penalty", "terminate", "liability", "exclusive", "indemnity", "breach", "default", "irrevocable"];
  const missingTerms = ["unsigned", "draft", "blank", "tbd", "missing", "unknown"];
  const protectionTerms = ["notice", "review", "approval", "term", "scope", "payment", "jurisdiction"];

  const riskHits = countMatches(combined, riskTerms);
  const missingHits = countMatches(combined, missingTerms);
  const protectionHits = countMatches(combined, protectionTerms);

  const integrityScore = clamp(82 - riskHits * 7 - missingHits * 9 + protectionHits * 2, 18, 95);
  const entities = extractEntities(documentText);
  const flaggedClauses = [
    riskHits > 0 ? "Potentially high-liability or one-sided obligation language detected." : null,
    missingHits > 0 ? "Draft-quality placeholders or missing fields detected." : null,
    concern.includes("payment") ? "Requested payment concern noted; verify schedule, milestones, and late-fee terms." : null,
    concern.includes("ownership") || concern.includes("ip") ? "Ownership or IP concern noted; verify assignment and reuse rights." : null,
  ].filter(Boolean);

  const recommendedActions = [
    flaggedClauses.length > 0 ? "Escalate the flagged clauses for legal or board-level review before signature." : "Proceed with a standard line-by-line review and archive the approved version.",
    entities.dates.length === 0 ? "Add clear effective dates, review dates, and deadlines." : "Verify every extracted date against the operating schedule.",
    entities.money.length === 0 ? "Confirm that pricing, currency, and payment triggers are explicitly stated." : "Reconcile all extracted financial figures with the commercial agreement.",
  ];

  return {
    tool: "ask-ujris",
    label: "Forensic document analyzer",
    summary: `Document integrity is ${scoreBand(integrityScore)} with ${flaggedClauses.length} flagged issue${flaggedClauses.length === 1 ? "" : "s"} requiring attention.`,
    integrityScore,
    flaggedClauses,
    extractedEntities: entities,
    recommendedActions,
    received: input,
  };
}