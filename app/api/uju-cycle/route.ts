import { NextResponse } from "next/server";
import { analyzeUjuCycle } from "../../../lib/fortis-tools";

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/uju-cycle",
    tool: "UJU CYCLE — Business Transformation Analyzer",
    method: "POST",
    fields: ["businessOverview"],
    engine: "deterministic",
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

    const analysis = analyzeUjuCycle(body);
    return NextResponse.json({ ok: true, analysis, kind: "deterministic", fabricated: false });
  } catch (error) {
    console.error("uju-cycle error", error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
