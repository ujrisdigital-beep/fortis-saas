import { NextResponse } from "next/server";
import { runCompletion } from "../../../lib/openai-client";
import { analyzeUjuCycle } from "../../../lib/fortis-tools";

const DEFAULT_SYSTEM_PROMPT = `You are UJU CYCLE, an AI business transformation analyst for African SMEs.
Analyze the business described and return a JSON object with these exact keys:
- digitiseScore (number 0-100): How digitised and technology-ready the business is
- digitiseActions (array of strings): 3-5 specific actions to improve digital operations
- optimiseOpportunities (array of strings): 4-6 key opportunities to optimise the business
- scaleChannels (array of strings): 3-5 channels or partnerships to scale through
- dominateStrategy (string): One powerful paragraph on how this business can dominate its market
- summary (string): One sentence summarising the overall transformation readiness
- phase (string): One of "Diagnose", "Design", or "Deploy" based on readiness

Be specific, actionable, and contextually relevant to African/Gambian business environments.
Return ONLY valid JSON, no other text.`;

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/uju-cycle",
    tool: "UJU CYCLE — Business Transformation Analyzer",
    method: "POST",
    fields: ["businessOverview"],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      businessOverview?: string;
      currentStage?: string;
      keyBottleneck?: string;
      goals?: string;
      marketSignals?: string;
    };

    const input = [
      body.businessOverview,
      body.currentStage,
      body.keyBottleneck,
      body.goals,
      body.marketSignals,
    ].filter(Boolean).join("\n\n");

    if (!input.trim()) {
      return NextResponse.json({ error: "businessOverview is required." }, { status: 400 });
    }

    const systemPrompt = process.env.UJU_PROMPT || DEFAULT_SYSTEM_PROMPT;
    const openaiKey = process.env.OPENAI_API_KEY;

    let analysis: unknown;

    if (openaiKey) {
      try {
        analysis = await runCompletion(systemPrompt, input);
      } catch (aiErr) {
        console.error("OpenAI error, falling back to rule-based:", aiErr);
        analysis = analyzeUjuCycle(body);
      }
    } else {
      analysis = analyzeUjuCycle(body);
    }

    return NextResponse.json({ ok: true, analysis });
  } catch (error) {
    console.error("uju-cycle error", error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
