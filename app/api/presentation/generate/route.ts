import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Slide {
  title: string;
  bulletPoints: string[];
  speakerNotes: string;
  type?: 'title' | 'content' | 'timeline' | 'evidence' | 'conclusion';
}

interface PresentationData {
  title: string;
  subtitle: string;
  slides: Slide[];
  keyArguments: string[];
  timeline: Array<{ date: string; event: string }>;
}

export async function POST(req: Request) {
  try {
    const { caseData, evidence, parties, title } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        mock: true,
        message: 'Add OPENAI_API_KEY to generate real presentations',
        preview: { title: 'Case Presentation', slideCount: 0 },
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // Step 1: Generate slide content via GPT-4
    const slidesResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are UJRIS — Autonomous Litigation Intelligence Engine. Create a professional 12-slide case presentation for a self-litigant going to Tribunal or Court.
Return valid JSON with exactly this structure:
{
  "title": "string",
  "subtitle": "string",
  "slides": [
    { "title": "string", "bulletPoints": ["string"], "speakerNotes": "string", "type": "title|content|timeline|evidence|conclusion" }
  ],
  "keyArguments": ["string"],
  "timeline": [{ "date": "string", "event": "string" }]
}
Slides should cover: Case Overview, Parties, Chronological Timeline, Evidence Summary, Legal Basis, Forensic Patterns Detected, Respondent's Weaknesses, Claimant's Strengths, Witness Evidence, Remedy Sought, Key Arguments, Closing Statement.`,
        },
        {
          role: 'user',
          content: JSON.stringify({ caseData: caseData ?? '', evidence: evidence ?? [], parties: parties ?? {}, title: title ?? 'My Case' }),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    const presentation: PresentationData = JSON.parse(slidesResponse.choices[0].message.content || '{}');

    // Step 2: Generate HTML presentation (fallback since pptxgenjs has SSR limitations)
    const htmlPresentation = buildHTMLPresentation(presentation);

    return new NextResponse(htmlPresentation, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="ujris-case-presentation.html"`,
        'X-Slide-Count': String(presentation.slides?.length ?? 0),
        'X-Case-Title': encodeURIComponent(presentation.title ?? 'Case Presentation'),
      },
    });
  } catch (err) {
    console.error('Presentation error:', err);
    return NextResponse.json({ error: 'Presentation generation failed', detail: String(err) }, { status: 500 });
  }
}

function buildHTMLPresentation(data: PresentationData): string {
  const slides = data.slides ?? [];

  const slideHTML = slides.map((slide, idx) => `
    <div class="slide" id="slide-${idx + 1}">
      <div class="slide-number">${idx + 1} / ${slides.length}</div>
      <div class="slide-inner">
        <h2 class="slide-title">${escapeHTML(slide.title ?? '')}</h2>
        ${slide.type === 'title' ? `<p class="slide-subtitle">${escapeHTML(data.subtitle ?? '')}</p>` : ''}
        <ul class="bullets">
          ${(slide.bulletPoints ?? []).map(b => `<li>${escapeHTML(b)}</li>`).join('')}
        </ul>
        ${slide.speakerNotes ? `<div class="speaker-notes"><strong>Notes:</strong> ${escapeHTML(slide.speakerNotes)}</div>` : ''}
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHTML(data.title ?? 'Case Presentation')} — UJRIS</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0A1C2E; color: #fff; }
  .header { background: #1B4D3E; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; }
  .header h1 { font-size: 1.1rem; font-weight: 800; color: #D4AF37; }
  .header p { font-size: 0.8rem; opacity: 0.8; }
  .slide { display: none; min-height: 100vh; padding: 4rem 2rem; position: relative; background: linear-gradient(135deg, #0A1C2E 0%, #1a2e4a 100%); }
  .slide.active { display: flex; flex-direction: column; justify-content: center; }
  .slide-number { position: absolute; top: 1.5rem; right: 2rem; font-size: 0.8rem; opacity: 0.5; }
  .slide-inner { max-width: 900px; margin: 0 auto; width: 100%; }
  .slide-title { font-size: 2.2rem; font-weight: 800; color: #D4AF37; margin-bottom: 1.5rem; border-bottom: 3px solid #1B4D3E; padding-bottom: 0.75rem; }
  .slide-subtitle { font-size: 1.2rem; color: rgba(255,255,255,0.7); margin-top: -0.75rem; margin-bottom: 1.5rem; }
  .bullets { list-style: none; padding: 0; }
  .bullets li { padding: 0.75rem 0 0.75rem 1.75rem; position: relative; font-size: 1.05rem; line-height: 1.6; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .bullets li::before { content: '▶'; position: absolute; left: 0; color: #1B4D3E; font-size: 0.6rem; top: 1rem; }
  .speaker-notes { margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.05); border-left: 3px solid #D4AF37; font-size: 0.85rem; color: rgba(255,255,255,0.6); border-radius: 0.25rem; }
  .controls { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 1rem; z-index: 100; }
  .btn { padding: 0.75rem 2rem; border: none; border-radius: 0.5rem; font-weight: 700; cursor: pointer; font-size: 0.95rem; }
  .btn-prev { background: rgba(255,255,255,0.1); color: #fff; }
  .btn-next { background: #1B4D3E; color: #fff; }
  .btn:disabled { opacity: 0.4; cursor: default; }
  .ujris-badge { position: fixed; top: 1rem; left: 1rem; font-size: 0.7rem; background: rgba(27,77,62,0.8); color: #D4AF37; padding: 0.3rem 0.75rem; border-radius: 999px; font-weight: 700; }
  @media print { .controls, .ujris-badge { display: none; } .slide { display: block !important; page-break-after: always; min-height: auto; padding: 2rem; } }
</style>
</head>
<body>
<div class="header"><h1>UJRIS Case Presentation</h1><p>${escapeHTML(data.title ?? '')}</p></div>
<span class="ujris-badge">UJRIS — Litigation Intelligence</span>
${slideHTML}
<div class="controls">
  <button class="btn btn-prev" id="prev" onclick="changeSlide(-1)" disabled>← Previous</button>
  <button class="btn btn-next" id="next" onclick="changeSlide(1)">Next →</button>
</div>
<script>
  let current = 1;
  const total = ${slides.length};
  function show(n) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.getElementById('slide-' + n)?.classList.add('active');
    document.getElementById('prev').disabled = n === 1;
    document.getElementById('next').disabled = n === total;
  }
  function changeSlide(dir) { current = Math.max(1, Math.min(total, current + dir)); show(current); }
  document.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === ' ') changeSlide(1); if (e.key === 'ArrowLeft') changeSlide(-1); });
  show(1);
</script>
</body>
</html>`;
}

function escapeHTML(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
