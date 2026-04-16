import { NextResponse } from "next/server";

type Lang = "en" | "fr" | "wo" | "mn" | "ff";

// Static translation cache for common UI/business phrases
const STATIC_TRANSLATIONS: Record<string, Partial<Record<Lang, string>>> = {
  "Welcome to FORTIS OS": {
    fr: "Bienvenue sur FORTIS OS",
    wo: "Dalal ak FORTIS OS",
    mn: "FORTIS OS la noo taa",
    ff: "Ngabbon e FORTIS OS",
  },
  "Buy and sell with confidence": {
    fr: "Achetez et vendez en toute confiance",
    wo: "Jënd ak jaay ak njëkkël",
    mn: "Soolo ni taa ni konyoo",
    ff: "Soodoo e yoɓɓo e jamyam",
  },
  "Your documents are secure": {
    fr: "Vos documents sont sécurisés",
    wo: "Ay papiy yi dafa seeri",
    mn: "Kitaabu ñolu fanaa le ti",
    ff: "Takardeeji maa ngoni sabu",
  },
};

export async function POST(req: Request) {
  const body = await req.json();
  const { text, targetLang, sourceLang = "en" } = body as {
    text: string;
    targetLang: Lang;
    sourceLang?: Lang;
  };

  if (!text || !targetLang) {
    return NextResponse.json({ error: "text and targetLang are required" }, { status: 400 });
  }

  if (targetLang === sourceLang) {
    return NextResponse.json({ translatedText: text, confidence: 1.0, source: "passthrough" });
  }

  // Check static cache first
  if (STATIC_TRANSLATIONS[text]?.[targetLang]) {
    return NextResponse.json({
      translatedText: STATIC_TRANSLATIONS[text][targetLang],
      confidence: 0.95,
      source: "static_cache",
      sourceLang,
      targetLang,
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Mock mode with placeholder
    return NextResponse.json({
      translatedText: `[${targetLang.toUpperCase()}] ${text}`,
      confidence: 0,
      source: "mock",
      mock: true,
      message: "Add OPENAI_API_KEY for real AI translation",
    });
  }

  const langNames: Record<Lang, string> = {
    en: "English",
    fr: "French",
    wo: "Wolof (Gambian dialect)",
    mn: "Mandinka",
    ff: "Pulaar/Fula (Gambian dialect)",
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional translator specialising in Gambian languages. Translate the following text from ${langNames[sourceLang]} to ${langNames[targetLang]}. Return ONLY the translation, no explanation. Preserve tone and context. For business/legal text, use formal register.`,
          },
          { role: "user", content: text },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error("Empty translation response");
    }

    // Estimate confidence based on model certainty (proxy: no refusal in output)
    const confidence = translatedText.toLowerCase().includes("i cannot") ? 0.3 : 0.88;

    return NextResponse.json({
      translatedText,
      confidence,
      source: "gpt-4o",
      sourceLang,
      targetLang,
      characterCount: text.length,
    });
  } catch (err) {
    return NextResponse.json({ error: "Translation failed", detail: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") as Lang;

  const supportedLangs = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", direction: "ltr" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", direction: "ltr" },
    { code: "wo", name: "Wolof", nativeName: "Wolof", flag: "🇬🇲", direction: "ltr" },
    { code: "mn", name: "Mandinka", nativeName: "Mandinka", flag: "🇬🇲", direction: "ltr" },
    { code: "ff", name: "Fula/Pulaar", nativeName: "Pulaar", flag: "🇬🇲", direction: "ltr" },
  ];

  if (lang) {
    const l = supportedLangs.find(s => s.code === lang);
    if (!l) return NextResponse.json({ error: "Language not supported" }, { status: 404 });
    return NextResponse.json(l);
  }

  return NextResponse.json({
    supported: supportedLangs,
    staticCacheSize: Object.keys(STATIC_TRANSLATIONS).length,
    aiProvider: process.env.OPENAI_API_KEY ? "gpt-4o" : "mock",
  });
}
