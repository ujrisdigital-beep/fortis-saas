/**
 * GET  /api/unified-inbox?brandId=&status=&platform=&search=&limit=&offset=
 * POST /api/unified-inbox         — ingest a new message
 * PUT  /api/unified-inbox         — mark replied / archive
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import {
  ingestMessage,
  getInboxMessages,
  getInboxStats,
  markAsReplied,
  archiveMessage,
  saveAiReply,
  buildReplyPrompt,
} from "../../../lib/unified-inbox";
type ContentPlatform = "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "FACEBOOK" | "TIKTOK" | "YOUTUBE" | "THREADS" | "CIRCLE";
type InboxMessageStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const p = req.nextUrl.searchParams;
  const brandId = p.get("brandId");
  if (!brandId) return NextResponse.json({ error: "brandId required" }, { status: 400 });

  if (p.get("stats") === "1") {
    const stats = await getInboxStats(brandId);
    return NextResponse.json(stats);
  }

  const messages = await getInboxMessages({
    brandId,
    platform: (p.get("platform") as ContentPlatform) ?? undefined,
    status: (p.get("status") as InboxMessageStatus) ?? undefined,
    search: p.get("search") ?? undefined,
    limit: p.get("limit") ? Number(p.get("limit")) : 50,
    offset: p.get("offset") ? Number(p.get("offset")) : 0,
  });

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json() as {
    brandId?: string;
    platform?: ContentPlatform;
    externalId?: string;
    senderName?: string;
    senderHandle?: string;
    body?: string;
  };

  if (!body.brandId || !body.platform || !body.externalId || !body.senderName || !body.body) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const msg = await ingestMessage({
    brandId: body.brandId,
    platform: body.platform,
    externalId: body.externalId,
    senderName: body.senderName,
    senderHandle: body.senderHandle,
    body: body.body,
  });

  return NextResponse.json(msg ?? { duplicate: true });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json() as {
    messageId?: string;
    action?: "reply" | "archive" | "suggest-reply";
    brandName?: string;
    brandTone?: string;
  };

  if (!body.messageId || !body.action) {
    return NextResponse.json({ error: "messageId and action required." }, { status: 400 });
  }

  if (body.action === "reply") {
    const updated = await markAsReplied(body.messageId);
    return NextResponse.json(updated);
  }

  if (body.action === "archive") {
    const updated = await archiveMessage(body.messageId);
    return NextResponse.json(updated);
  }

  if (body.action === "suggest-reply") {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const msg = await prisma.unifiedInboxMessage.findUnique({ where: { id: body.messageId } });
    if (!msg) return NextResponse.json({ error: "Message not found." }, { status: 404 });

    const brand = await prisma.brand.findUnique({ where: { id: msg.brandId } });
    if (!brand) return NextResponse.json({ error: "Brand not found." }, { status: 404 });

    const prompt = buildReplyPrompt({
      brandName: brand.name,
      brandTone: brand.voiceTone ?? "professional and friendly",
      senderName: msg.senderName,
      incomingMessage: msg.body,
      platform: msg.platform,
    });

    const aiKey = process.env.OPENAI_API_KEY;
    if (!aiKey) return NextResponse.json({ error: "AI not configured." }, { status: 503 });

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${aiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.75,
        max_tokens: 300,
      }),
    });

    const aiData = await aiRes.json() as { choices: { message: { content: string } }[] };
    const suggestion = aiData.choices[0]?.message?.content?.trim() ?? "";
    const updated = await saveAiReply(body.messageId, suggestion);
    return NextResponse.json({ ...updated, suggestion });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
