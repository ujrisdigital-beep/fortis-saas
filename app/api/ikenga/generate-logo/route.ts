// app/api/ikenga/generate-logo/route.ts
// AI logo generation via DALL-E 3 — returns multiple logo concepts
import { NextRequest, NextResponse } from 'next/server';

const STYLE_PROMPTS: Record<string, string> = {
  modern:      'modern minimalist vector logo, clean lines, professional, suitable for digital brand',
  traditional: 'traditional African-inspired logo with geometric patterns, bold colors, cultural pride',
  tech:        'futuristic tech startup logo, circuit-board elements, digital aesthetic, SVG-clean',
  natural:     'organic natural logo with earth tones, sustainability theme, hand-crafted feel',
  bold:        'bold typographic logo, strong contrast, impactful, memorable brand mark',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      brandName,
      industry,
      tagline,
      primaryColor,
      style = 'modern',
      count = 2,
    } = body as {
      brandName: string;
      industry: string;
      tagline?: string;
      primaryColor?: string;
      style?: string;
      count?: number;
    };

    if (!brandName || !industry) {
      return NextResponse.json({ error: 'brandName and industry are required' }, { status: 400 });
    }

    const styleDesc = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.modern;
    const colorHint = primaryColor ? `, primary color ${primaryColor}` : '';
    const taglineHint = tagline ? `, tagline: "${tagline}"` : '';

    const basePrompt = `Professional logo for "${brandName}", a ${industry} company${taglineHint}. ${styleDesc}${colorHint}. White background, centered composition, no text outside brand name, no people, no complex scenes. Suitable for business cards and websites.`;

    if (!process.env.OPENAI_API_KEY) {
      // Fallback: return placeholder concepts without DALL-E
      const concepts = Array.from({ length: Math.min(count, 3) }, (_, i) => ({
        conceptId: `concept-${i + 1}`,
        style: i === 0 ? style : i === 1 ? 'bold' : 'traditional',
        imageUrl: null,
        prompt: basePrompt,
        fallback: true,
        description: `Logo concept ${i + 1} for ${brandName} — ${i === 0 ? styleDesc : i === 1 ? STYLE_PROMPTS.bold : STYLE_PROMPTS.traditional}`,
      }));
      return NextResponse.json({
        brandName,
        concepts,
        generated: false,
        message: 'Set OPENAI_API_KEY to enable DALL-E 3 logo generation. Concept descriptions returned.',
      });
    }

    // Generate with DALL-E 3
    const styles = [style, 'bold', 'traditional'];
    const concepts = await Promise.all(
      Array.from({ length: Math.min(count, 3) }, async (_, i) => {
        const conceptStyle = styles[i % styles.length];
        const conceptDesc = STYLE_PROMPTS[conceptStyle] ?? STYLE_PROMPTS.modern;
        const prompt = `Professional logo for "${brandName}", a ${industry} company${taglineHint}. ${conceptDesc}${colorHint}. White background, centered, no people, no complex scenes.`;

        try {
          const res = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt,
              n: 1,
              size: '1024x1024',
              quality: 'standard',
              response_format: 'url',
            }),
          });
          const data = await res.json();
          return {
            conceptId: `concept-${i + 1}`,
            style: conceptStyle,
            imageUrl: data.data?.[0]?.url ?? null,
            prompt,
            fallback: false,
            description: conceptDesc,
          };
        } catch {
          return {
            conceptId: `concept-${i + 1}`,
            style: conceptStyle,
            imageUrl: null,
            prompt,
            fallback: true,
            description: conceptDesc,
          };
        }
      })
    );

    return NextResponse.json({
      brandName,
      concepts,
      generated: true,
      message: `${concepts.filter((c) => c.imageUrl).length} logo concepts generated.`,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
