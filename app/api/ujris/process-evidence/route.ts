import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (!hasOpenAI) {
      return NextResponse.json({
        success: true,
        transcript: null,
        extractedText: `[File: ${file.name}] File received (${(buffer.length / 1024).toFixed(1)} KB). OpenAI key not configured — configure OPENAI_API_KEY in Vercel to enable text extraction.`,
        textLength: buffer.length,
        note: "Set OPENAI_API_KEY in Vercel environment to enable AI-powered extraction."
      })
    }

    try {
      const { default: OpenAI } = await import("openai")
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

      let extractedText = ""

      if (file.type.startsWith("image/")) {
        const base64 = buffer.toString("base64")
        const visionResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Extract ALL text from this document. Return as plain text listing: parties, key dates, monetary amounts, terms, and clauses." },
              { type: "image_url", image_url: { url: `data:${file.type};base64,${base64}` } }
            ]
          }],
          max_tokens: 1000
        })
        extractedText = visionResponse.choices[0].message.content || ""
      } else if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
        const audioFile = new File([buffer], file.name, { type: file.type })
        const whisperResponse = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1"
        })
        extractedText = whisperResponse.text
      } else {
        extractedText = new TextDecoder().decode(buffer).slice(0, 15000)
      }

      return NextResponse.json({
        success: true,
        transcript: file.type.startsWith("audio/") || file.type.startsWith("video/") ? extractedText : null,
        extractedText,
        textLength: extractedText.length
      })
    } catch (aiError) {
      return NextResponse.json({
        success: true,
        extractedText: `[File: ${file.name}] Received. AI processing unavailable: ${String(aiError)}`,
        textLength: buffer.length
      })
    }
  } catch {
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}