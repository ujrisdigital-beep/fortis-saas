import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { caseText, evidenceSummary, title } = await req.json();

    if (!caseText && !evidenceSummary) {
      return NextResponse.json({ error: 'caseText or evidenceSummary is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        mock: true,
        scriptPreview: 'Add OPENAI_API_KEY to generate real audio case summaries.',
        message: 'Audio summariser requires OPENAI_API_KEY',
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const caseTitle = title ?? 'Your Legal Case';

    // Step 1: Generate the podcast script
    const scriptResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a professional legal broadcaster for UJRIS — Autonomous Litigation Intelligence Engine.
Write a clear, compelling 5-minute podcast script that explains a legal case in plain English.
Structure: Introduction (30s), Background facts (60s), Evidence and patterns (90s), Legal strengths and weaknesses (60s), Next steps and recommendations (60s), Closing (20s).
Use conversational tone. Speak directly to the self-litigant as "you". Avoid jargon. Be empowering.`,
        },
        {
          role: 'user',
          content: `Case title: ${caseTitle}\n\nCase details:\n${caseText ?? ''}\n\nEvidence summary:\n${evidenceSummary ?? ''}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const script = scriptResponse.choices[0].message.content ?? '';

    // Step 2: Convert to audio via OpenAI TTS
    const audioResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: script.slice(0, 4096),
      speed: 1.0,
    });

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="ujris-case-summary.mp3"`,
        'X-Script-Preview': encodeURIComponent(script.slice(0, 300)),
      },
    });
  } catch (err) {
    console.error('Audio summarize error:', err);
    return NextResponse.json({ error: 'Audio generation failed', detail: String(err) }, { status: 500 });
  }
}
