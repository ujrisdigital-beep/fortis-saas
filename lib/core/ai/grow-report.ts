import { analyzeUjuCycle } from "../../fortis-tools";
import { geminiComplete, geminiConfigured } from "../../ai/gemini-optional";
import type { CanonicalIndicator } from "../data/types";
import type { InternalModelAdapter, ModelRequest, ModelResponse } from "./adapter";

export function buildDeterministicGrowReport(
  input: Record<string, string | undefined>,
  sources: CanonicalIndicator[],
): ModelResponse {
  const analysis = analyzeUjuCycle({
    businessOverview: input.businessOverview,
    currentStage: input.currentStage,
    keyBottleneck: input.keyBottleneck,
    goals: input.goals,
    marketSignals: input.marketSignals,
  });

  const usable = sources.filter((s) => s.freshness !== "STALE" && s.freshness !== "UNAVAILABLE");
  const lines = usable.map(
    (s) => `${s.indicatorKey}=${s.value} ${s.unit} (${s.period}; ${s.publisher}; ${s.freshness})`,
  );

  const text = [
    analysis.summary,
    `Phase: ${analysis.phase}.`,
    ...analysis.priorities,
    lines.length ? `Sourced indicators: ${lines.join("; ")}` : "No current official indicators were attached.",
  ].join(" ");

  return {
    kind: "deterministic",
    text,
    citations: usable.map((s) => ({
      sourceKey: s.sourceKey,
      sourceRecordId: s.sourceRecordId,
      url: s.sourceUrl,
    })),
    fabricated: false,
  };
}

export class RetrievalFirstGrowAdapter implements InternalModelAdapter {
  constructor(
    private readonly sources: CanonicalIndicator[],
    private readonly localNarrative?: (prompt: string) => string | null,
  ) {}

  async infer(req: ModelRequest): Promise<ModelResponse> {
    const deterministic = buildDeterministicGrowReport(req.input, this.sources);
    if (!this.localNarrative) return deterministic;
    const narrative = this.localNarrative(deterministic.text);
    if (!narrative) return deterministic;
    return {
      kind: "local_narrative",
      text: `${deterministic.text}\n\n${narrative}`,
      citations: deterministic.citations,
      fabricated: false,
    };
  }
}

export function growWithFallback(
  inference: ModelResponse | null,
  input: Record<string, string | undefined>,
  sources: CanonicalIndicator[],
): ModelResponse {
  if (!inference || inference.kind === "unavailable" || !inference.text.trim()) {
    return buildDeterministicGrowReport(input, sources);
  }
  return inference;
}

export async function growNarrativeOptional(base: ModelResponse): Promise<ModelResponse> {
  if (!geminiConfigured()) return base;
  try {
    const extra = await geminiComplete(
      "You write a short GROW narrative. Do not invent statistics. Use only the supplied text.",
      base.text,
    );
    return {
      kind: "local_narrative",
      text: `${base.text}\n\n${extra}`,
      citations: base.citations,
      fabricated: false,
    };
  } catch {
    return base;
  }
}
