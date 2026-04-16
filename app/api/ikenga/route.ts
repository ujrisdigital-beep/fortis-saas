import { NextResponse } from "next/server";
import { runCompletion } from "../../../lib/openai-client";
import { analyzeIkenga } from "../../../lib/fortis-tools";

const DEFAULT_SYSTEM_PROMPT = `You are IKENGA, an AI brand intelligence assessor for African businesses.
Analyze the brand described and return a JSON object with these exact keys:
- brandStrength (number 0-100): Overall brand strength score
- opportunities (array of strings): 4-6 specific growth opportunities for this brand
- contentStrategy (string): A practical 2-3 sentence content strategy tailored to their channels
- summary (string): One sentence summarising the brand's current position and potential

Consider the African/Gambian market context when giving recommendations.
Return ONLY valid JSON, no other text.`;

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/ikenga",
    tool: "IKENGA — Brand Intelligence Assessor",
    method: "POST",
    fields: ["brandName", "tagline", "differentiator", "channels"],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      brandName?: string;
      tagline?: string;
      differentiator?: string;
      channels?: string;
      positioning?: string;
      differentiators?: string;
      notes?: string;
    };

    if (!body.brandName) {
      return NextResponse.json({ error: "brandName is required." }, { status: 400 });
    }

    const userMessage = [
      `Brand Name: ${body.brandName}`,
      (body.tagline || body.positioning) ? `Tagline/Positioning: ${body.tagline ?? body.positioning}` : null,
      (body.differentiator || body.differentiators) ? `Differentiator: ${body.differentiator ?? body.differentiators}` : null,
      body.channels ? `Channels: ${body.channels}` : null,
      body.notes ? `Notes: ${body.notes}` : null,
    ].filter(Boolean).join("\n");

    const systemPrompt = process.env.IKENGA_PROMPT || DEFAULT_SYSTEM_PROMPT;
    const openaiKey = process.env.OPENAI_API_KEY;

    let analysis: unknown;

    if (openaiKey) {
      try {
        analysis = await runCompletion(systemPrompt, userMessage);
      } catch (aiErr) {
        console.error("OpenAI error, falling back to rule-based:", aiErr);
        analysis = analyzeIkenga(body);
      }
    } else {
      analysis = analyzeIkenga(body);
    }

    return NextResponse.json({ ok: true, analysis });
  } catch (error) {
    console.error("ikenga error", error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
