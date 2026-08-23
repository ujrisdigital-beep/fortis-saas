import { createHash } from "node:crypto";
import { analyzeUjuCycle } from "../fortis-tools";
import type { CanonicalIndicator } from "../core/data/types";
import { growWithFallback } from "../core/ai/grow-report";

export const GROW_ENGINE_VERSION = "grow-uju-1.1.0";

export interface GrowInput {
  businessOverview: string;
  currentStage?: string;
  keyBottleneck?: string;
  goals?: string;
  marketSignals?: string;
}

export function hashGrowInput(input: GrowInput): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export function runGrowDiagnostic(input: GrowInput, sources: CanonicalIndicator[]) {
  if (!input.businessOverview.trim()) {
    throw new Error("business_overview_required");
  }
  const scores = analyzeUjuCycle(input);
  const narrative = growWithFallback(null, input, sources);
  const preview = {
    engineVersion: GROW_ENGINE_VERSION,
    phase: scores.phase,
    summary: scores.summary,
    scores: scores.scores,
    modelCard: {
      name: "UJU Cycle deterministic v1.1",
      kind: "rules",
      bankUse: "not_authorised",
      explainability: "keyword and phrase matches produce bounded 0–100 scores",
    },
  };
  const full = {
    ...preview,
    priorities: scores.priorities,
    detectedSignals: scores.detectedSignals,
    narrative: narrative.text,
    citations: narrative.citations,
    sources: sources.map((s) => ({
      sourceKey: s.sourceKey,
      period: s.period,
      freshness: s.freshness,
      publishedAt: s.publishedAt,
      retrievedAt: s.retrievedAt,
      url: s.sourceUrl,
      checksum: s.checksum,
    })),
  };
  return { inputHash: hashGrowInput(input), preview, full };
}

export function exportFullReport(full: ReturnType<typeof runGrowDiagnostic>["full"], entitled: boolean) {
  if (!entitled) {
    throw new Error("export_requires_entitlement");
  }
  return {
    format: "application/json",
    body: JSON.stringify(full, null, 2),
    engineVersion: GROW_ENGINE_VERSION,
  };
}
