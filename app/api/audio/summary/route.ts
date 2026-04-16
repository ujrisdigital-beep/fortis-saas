import { NextResponse } from "next/server";

const VOICE_MAP: Record<string, string> = {
  en: "21m00Tcm4TlvDq8ikWAM",
  fr: "VR6AuwLTgZ4cC8gX7xZj",
  wo: "EXAVITQu4L4MjE1Gz3U5",
  mn: "TX3LPaxmHKxFdv7VOQHJ",
  ff: "MF3mGyEYCl7XYWbV9V6O",
};

export async function POST(req: Request) {
  const { text, language = "en" } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    // Mock mode: return null audioUrl with helpful message
    return NextResponse.json({
      audioUrl: null,
      mock: true,
      message: "Add ELEVENLABS_API_KEY to environment variables for real audio synthesis",
      textLength: text.length,
      language,
    });
  }

  try {
    const voiceId = VOICE_MAP[language] ?? VOICE_MAP.en;
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.slice(0, 5000), // ElevenLabs limit
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: "ElevenLabs API error", detail: err }, { status: 502 });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
      mock: false,
      language,
      voiceId,
      characterCount: text.length,
    });
  } catch (err) {
    return NextResponse.json({ error: "Audio synthesis failed", detail: String(err) }, { status: 500 });
  }
}
