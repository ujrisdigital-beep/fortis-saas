// app/api/admin/content-fetch/route.ts
// Content curation engine — fetches from RSS feeds and scores relevance
import { NextRequest, NextResponse } from 'next/server';

const GAMBIA_SOURCES = [
  { name: "The Standard Newspaper", rss: "https://standard.gm/feed", category: "News" },
  { name: "Foroyaa Newspaper", rss: "https://foroyaa.net/feed", category: "News" },
  { name: "The Point Newspaper", rss: "https://thepoint.gm/feed", category: "News" },
  { name: "World Bank — Gambia", rss: "https://www.worldbank.org/en/country/gambia/rss.xml", category: "Development" },
];

const RELEVANCE_KEYWORDS = [
  "gambia", "gambian", "banjul", "serekunda", "digital", "fintech", "agriculture",
  "economy", "investment", "sme", "startup", "technology", "mobile money", "nawec",
  "pura", "cbg", "giepa", "tango", "tourism", "export", "youth", "women",
];

function scoreRelevance(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of RELEVANCE_KEYWORDS) {
    if (lower.includes(kw)) score += kw.length > 5 ? 15 : 8;
  }
  return Math.min(100, score);
}

// Simulated RSS fetch results (in production, use a real RSS parser)
function generateDemoContent(source: typeof GAMBIA_SOURCES[0]) {
  const DEMO = [
    {
      title: `Gambia's Digital Economy Master Plan: Progress and Challenges`,
      excerpt: `The National Digital Economy Master Plan (2024–2034) is entering its second year of implementation. Key milestones include expanded 4G coverage, the launch of the GamSwitch interoperability platform, and GIEPA's new SME digitalisation fund.`,
      originalUrl: `https://${source.name.toLowerCase().replace(/\s+/g, '')}.gm/digital-economy-update`,
    },
    {
      title: `CBG Launches Digital Financial Literacy Campaign`,
      excerpt: `The Central Bank of The Gambia has rolled out a nationwide financial literacy initiative targeting mobile money users. The campaign covers fraud prevention, consumer rights, and responsible borrowing.`,
      originalUrl: `https://${source.name.toLowerCase().replace(/\s+/g, '')}.gm/cbg-literacy`,
    },
    {
      title: `Gambian SMEs Embrace E-Commerce Post-Pandemic`,
      excerpt: `Small and medium enterprises across Greater Banjul are increasingly adopting digital sales channels. Wave and QMoney integrations have simplified payment acceptance for micro-retailers.`,
      originalUrl: `https://${source.name.toLowerCase().replace(/\s+/g, '')}.gm/sme-ecommerce`,
    },
  ];
  return DEMO.map((d, i) => ({
    id: `${source.name}-${i}`,
    title: d.title,
    source: source.name,
    sourceUrl: `https://${source.name.toLowerCase().replace(/\s+/g, '')}.gm`,
    originalUrl: d.originalUrl,
    summary: d.excerpt.slice(0, 200),
    excerpt: d.excerpt,
    category: source.category,
    relevanceScore: scoreRelevance(d.title + " " + d.excerpt),
    status: "pending",
    citation: `${source.name} (${new Date().getFullYear()}). "${d.title}". Retrieved ${new Date().toLocaleDateString("en-GB")}, from ${d.originalUrl}. © ${source.name}. Reproduced under fair use provisions of the Gambia Copyright Act 2004.`,
    tags: RELEVANCE_KEYWORDS.filter((kw) => (d.title + d.excerpt).toLowerCase().includes(kw)).slice(0, 5),
  }));
}

export async function GET(req: NextRequest) {
  // Admin-only endpoint
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    const host = req.headers.get('host') ?? '';
    if (!host.includes('localhost')) {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 401 });
    }
  }

  try {
    const allContent = GAMBIA_SOURCES.flatMap(generateDemoContent)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return NextResponse.json({
      ok: true,
      total: allContent.length,
      sources: GAMBIA_SOURCES.length,
      content: allContent,
      fetchedAt: new Date().toISOString(),
      note: "Demo mode: in production, configure RSS_FETCH=true to pull live content from registered sources.",
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
