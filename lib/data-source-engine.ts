// lib/data-source-engine.ts
// FORTIS OS™ Automated Data Source Management Engine
import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

interface RSSItem {
  title?: string;
  content?: string;
  contentSnippet?: string;
  link?: string;
  pubDate?: string;
}

interface RSSFeed {
  items: RSSItem[];
}

interface ParsedContent {
  title: string;
  content: string;
  summary: string;
  url: string;
  contentHash: string;
}

async function parseRSS(url: string): Promise<ParsedContent[]> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "FORTIS-OS/1.0 (+https://fortisos.cloud)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    // Simple XML RSS parser (no external deps)
    const items: ParsedContent[] = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const itemXml = match[1];
      const title = extractTag(itemXml, "title");
      const description = extractTag(itemXml, "description") || extractTag(itemXml, "content:encoded") || "";
      const link = extractTag(itemXml, "link");

      if (!title) continue;

      const clean = description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const summary = clean.slice(0, 300) + (clean.length > 300 ? "..." : "");
      const contentHash = createHash("sha256").update(title + link).digest("hex");

      items.push({ title, content: clean, summary, url: link || url, contentHash });
      if (items.length >= 10) break; // max 10 items per source per fetch
    }

    return items;
  } catch {
    return [];
  }
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"))
    || xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function scoreQuality(item: ParsedContent): number {
  let score = 50;
  if (item.title.length > 20) score += 10;
  if (item.content.length > 200) score += 20;
  if (item.url && item.url.startsWith("http")) score += 10;
  if (item.summary.length > 100) score += 10;
  return Math.min(score, 100);
}

export async function fetchSource(sourceId: string): Promise<{ fetched: number; new: number; errors: string[] }> {
  const errors: string[] = [];
  let fetched = 0;
  let newItems = 0;

  const source = await prisma.dataSource.findUnique({ where: { id: sourceId } });
  if (!source || !source.isActive || !source.url) {
    return { fetched: 0, new: 0, errors: ["Source not found or inactive"] };
  }

  try {
    let items: ParsedContent[] = [];

    if (source.type === "rss") {
      items = await parseRSS(source.url);
    }

    fetched = items.length;

    for (const item of items) {
      const existing = await prisma.dataContent.findUnique({ where: { contentHash: item.contentHash } });
      if (existing) continue;

      const qualityScore = scoreQuality(item);
      await prisma.dataContent.create({
        data: {
          sourceId: source.id,
          title: item.title,
          content: item.content,
          summary: item.summary,
          url: item.url,
          contentHash: item.contentHash,
          status: qualityScore >= 70 ? "pending" : "pending",
          qualityScore,
        },
      });

      // Create admin alert for high-quality new content
      if (qualityScore >= 70) {
        await prisma.adminAlert.create({
          data: {
            type: "approval_needed",
            title: `New content from ${source.name}`,
            message: item.title,
            priority: qualityScore >= 90 ? "high" : "medium",
          },
        });
      }

      newItems++;
    }

    // Update lastFetched
    await prisma.dataSource.update({
      where: { id: source.id },
      data: { lastFetched: new Date() },
    });

    // Log success
    await prisma.updateLog.create({
      data: {
        sourceId: source.id,
        action: "fetch",
        details: { fetched, new: newItems },
        status: "success",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);

    await prisma.updateLog.create({
      data: {
        sourceId: source.id,
        action: "fetch",
        details: { error: msg },
        status: "error",
      },
    });

    await prisma.adminAlert.create({
      data: {
        type: "source_error",
        title: `Fetch error: ${source.name}`,
        message: msg,
        priority: "high",
      },
    });
  }

  return { fetched, new: newItems, errors };
}

export async function fetchAllActiveSources(): Promise<{ sourceId: string; name: string; fetched: number; new: number; errors: string[] }[]> {
  const sources = await prisma.dataSource.findMany({ where: { isActive: true } });
  const results = [];

  for (const source of sources) {
    const result = await fetchSource(source.id);
    results.push({ sourceId: source.id, name: source.name, ...result });
  }

  return results;
}
