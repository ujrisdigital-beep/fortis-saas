import { NextResponse } from "next/server";
import { runCompletion } from "../../../lib/openai-client";
import { analyzeAskUjris } from "../../../lib/fortis-tools";

const DEFAULT_SYSTEM_PROMPT = `You are ASK UJRIS, an AI forensic document analyst specialising in business and legal documents.
Analyze the document text provided and return a JSON object with these exact keys:
- integrityScore (number 0-100): Document integrity and fairness score (100 = fully balanced and clear, 0 = high risk)
- redFlags (array of strings): Specific clauses, terms, or omissions that pose a risk to the signing party
- recommendations (array of strings): 3-5 concrete actions the client should take before signing
- summary (string): One sentence summarising the document's overall risk level and key concern

Be specific — name exact clause types. Consider African/Gambian legal context where relevant.
Return ONLY valid JSON, no other text.`;

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/ask-ujris",
    tool: "ASK UJRIS — Forensic Document Analyzer",
    method: "POST",
    fields: ["documentText", "documentType", "concern"],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      documentText?: string;
      documentType?: string;
      concern?: string;
    };

    if (!body.documentText) {
      return NextResponse.json({ error: "documentText is required." }, { status: 400 });
    }

    const userMessage = [
      body.documentType ? `Document Type: ${body.documentType}` : null,
      body.concern ? `Client Concern: ${body.concern}` : null,
      `\nDocument Text:\n${body.documentText}`,
    ].filter(Boolean).join("\n");

    const systemPrompt = process.env.UJRIS_PROMPT || DEFAULT_SYSTEM_PROMPT;
    const openaiKey = process.env.OPENAI_API_KEY;

    let analysis: unknown;

    if (openaiKey) {
      try {
        analysis = await runCompletion(systemPrompt, userMessage);
      } catch (aiErr) {
        console.error("OpenAI error, falling back to rule-based:", aiErr);
        analysis = analyzeAskUjris(body);
      }
    } else {
      analysis = analyzeAskUjris(body);
    }

    return NextResponse.json({ ok: true, analysis });
  } catch (error) {
    console.error("ask-ujris error", error);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
