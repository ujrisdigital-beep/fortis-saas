import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    const { caseDescription, files } = await req.json()

    if (!caseDescription && (!files || files.length === 0)) {
      return NextResponse.json({ error: "No case description or files provided" }, { status: 400 })
    }

    if (!hasOpenAI) {
      return NextResponse.json({
        success: true,
        slides: [
          { slideTitle: "Case Overview", bulletPoints: ["Review your evidence carefully"] },
          { slideTitle: "Key Dates", bulletPoints: ["Document all relevant dates"] },
          { slideTitle: "Legal Framework", bulletPoints: ["Labour Act 2007 applies", "Industrial Court has jurisdiction"] },
          { slideTitle: "Evidence Strength", bulletPoints: ["Gather supporting documents", "Get witness statements"] },
          { slideTitle: "Next Steps", bulletPoints: ["File within 30 days", "Consult a Gambian lawyer"] },
        ],
        timeline: [
          { date: "TBD", event: "Incident date to be documented" },
          { date: "TBD", event: "Dismissal/breach date" },
          { date: "30 days", event: "Statutory deadline for Industrial Court claim" },
        ],
        keyArguments: [
          { claim: "Review case facts for procedural fairness", strength: 7 },
          { claim: "Document any evidence of discrimination", strength: 6 },
          { claim: "Check contract terms against Labour Act 2007", strength: 8 },
        ],
        audioScript: "Set OPENAI_API_KEY in Vercel environment to generate AI audio summaries.",
        note: "Set OPENAI_API_KEY in Vercel environment to enable AI presentation generation."
      })
    }

    try {
      const { default: OpenAI } = await import("openai")
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

      const evidenceText = (files || [])
        .map((f: any) => `Document: ${f.name}\nContent: ${f.extractedText || "(no extracted text)"}`)
        .join("\n\n---\n\n")

      const context = `${caseDescription}\n\nEvidence:\n${evidenceText}`.slice(0, 12000)

      const [slidesRes, audioRes] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `Create a legal case presentation for a Gambia Industrial Court case. Return JSON with exactly this structure:
{
  "slides": [{"slideTitle": "Title", "bulletPoints": ["Point 1", "Point 2"]}],
  "timeline": [{"date": "Date", "event": "Event description"}],
  "keyArguments": [{"claim": "Legal argument", "strength": 1-10}]
}
Keep to 8-12 slides. Be specific to Gambian law (Labour Act 2007, Evidence Act 2019, Industrial Court).

Case: ${context}`
          }],
          max_tokens: 2000,
          response_format: { type: "json_object" }
        }),
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `Write a 3-minute podcast script summarising this Gambian employment law case. Explain in plain English: what happened, the legal issues, the strengths of the case, and the recommended next steps. Keep it conversational and clear. Maximum 500 words.\n\nCase: ${context}`
          }]
        })
      ])

      let slides: any[] = []
      let timeline: any[] = []
      let keyArguments: any[] = []

      try {
        const parsed = JSON.parse(slidesRes.choices[0].message.content ?? '{}')
        slides = parsed.slides || []
        timeline = parsed.timeline || []
        keyArguments = parsed.keyArguments || []
      } catch {
        slides = [{ slideTitle: "Case Summary", bulletPoints: ["See full analysis for details"] }]
      }

      return NextResponse.json({
        success: true,
        slides,
        timeline,
        keyArguments,
        audioScript: audioRes.choices[0].message.content
      })
    } catch (aiError) {
      return NextResponse.json({
        success: true,
        slides: [
          { slideTitle: "Case Overview", bulletPoints: ["Case under review"] },
          { slideTitle: "Legal Issues", bulletPoints: ["Reviewing applicable law"] },
          { slideTitle: "Evidence", bulletPoints: ["Processing evidence"] },
          { slideTitle: "Arguments", bulletPoints: ["Strength assessment pending"] },
          { slideTitle: "Recommendations", bulletPoints: ["Consult a Gambian lawyer"] },
        ],
        timeline: [{ date: "Review required", event: "Timeline generation pending AI completion" }],
        keyArguments: [{ claim: "AI processing error — please try again", strength: 5 }],
        audioScript: `There was an error generating the audio script. ${String(aiError)}`,
        error: String(aiError)
      })
    }
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}