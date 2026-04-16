/**
 * UnifiedInbox — Multi-platform message handling
 *
 * Aggregates DMs and comments from connected platforms into one inbox.
 * AI-suggested replies are generated and stored but NOT auto-sent
 * (user approves before sending) to stay compliant with platform ToS.
 */

import { PrismaClient } from "@prisma/client";

type ContentPlatform = "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "FACEBOOK" | "TIKTOK" | "YOUTUBE" | "THREADS" | "CIRCLE";
type InboxMessageStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

const prisma = new PrismaClient();

export interface IncomingMessage {
  brandId: string;
  platform: ContentPlatform;
  externalId: string;       // the platform's own message/comment ID
  senderName: string;
  senderHandle?: string;
  body: string;
}

export interface InboxFilter {
  brandId: string;
  platform?: ContentPlatform;
  status?: InboxMessageStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface InboxStats {
  total: number;
  unread: number;
  replied: number;
  archived: number;
  byPlatform: Record<string, number>;
}

/**
 * Ingest an incoming message into the unified inbox.
 * Idempotent — duplicate externalIds are silently skipped.
 */
export async function ingestMessage(msg: IncomingMessage) {
  try {
    return await prisma.unifiedInboxMessage.create({
      data: {
        brandId: msg.brandId,
        platform: msg.platform,
        externalId: msg.externalId,
        senderName: msg.senderName,
        senderHandle: msg.senderHandle ?? "",
        body: msg.body,
        status: "UNREAD",
      },
    });
  } catch {
    // Unique constraint on (platform, externalId) — message already exists
    return null;
  }
}

/**
 * Fetch inbox messages with filters.
 */
export async function getInboxMessages(filter: InboxFilter) {
  const where: Record<string, unknown> = { brandId: filter.brandId };

  if (filter.platform) where["platform"] = filter.platform;
  if (filter.status) where["status"] = filter.status;
  if (filter.search) {
    where["OR"] = [
      { body: { contains: filter.search, mode: "insensitive" } },
      { senderName: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  return prisma.unifiedInboxMessage.findMany({
    where,
    orderBy: { receivedAt: "desc" },
    take: filter.limit ?? 50,
    skip: filter.offset ?? 0,
  });
}

/**
 * Get message count stats for a brand's inbox.
 */
export async function getInboxStats(brandId: string): Promise<InboxStats> {
  const messages = await prisma.unifiedInboxMessage.findMany({
    where: { brandId },
    select: { status: true, platform: true },
  });

  const stats: InboxStats = {
    total: messages.length,
    unread: 0,
    replied: 0,
    archived: 0,
    byPlatform: {},
  };

  for (const m of messages) {
    if (m.status === "UNREAD") stats.unread++;
    if (m.status === "REPLIED") stats.replied++;
    if (m.status === "ARCHIVED") stats.archived++;

    stats.byPlatform[m.platform] = (stats.byPlatform[m.platform] ?? 0) + 1;
  }

  return stats;
}

/**
 * Build a prompt to generate an AI reply suggestion for a message.
 * Called by the /api/unified-inbox/suggest-reply route.
 */
export function buildReplyPrompt(params: {
  brandName: string;
  brandTone: string;
  senderName: string;
  incomingMessage: string;
  platform: ContentPlatform;
}): string {
  const platformContext: Record<string, string> = {
    TWITTER: "Keep reply under 280 characters. Be punchy.",
    INSTAGRAM: "Warm, visual, friendly. Use 1–2 emojis.",
    LINKEDIN: "Professional tone. No emojis. Structured.",
    FACEBOOK: "Conversational, community-first.",
    TIKTOK: "Casual, fun, short.",
    CIRCLE: "Community-focused. Encourage discussion.",
  };

  const ctx = platformContext[params.platform] ?? "Keep the reply concise and helpful.";

  return `You are the social media voice for ${params.brandName}. Tone: ${params.brandTone}.

Platform: ${params.platform} — ${ctx}

Someone named ${params.senderName} sent this message:
"${params.incomingMessage}"

Write ONE suggested reply. Address them by name. Be genuine. Do NOT mention you are an AI.
Return ONLY the reply text, nothing else.`;
}

/**
 * Store an AI reply suggestion on a message (does NOT send it).
 */
export async function saveAiReply(messageId: string, aiReply: string) {
  return prisma.unifiedInboxMessage.update({
    where: { id: messageId },
    data: { aiReply, status: "READ" },
  });
}

/**
 * Mark a message as replied (called after user actually sends the reply).
 */
export async function markAsReplied(messageId: string) {
  return prisma.unifiedInboxMessage.update({
    where: { id: messageId },
    data: { status: "REPLIED", repliedAt: new Date() },
  });
}

/**
 * Archive a message.
 */
export async function archiveMessage(messageId: string) {
  return prisma.unifiedInboxMessage.update({
    where: { id: messageId },
    data: { status: "ARCHIVED" },
  });
}

/**
 * Bulk-archive all unread messages older than N days.
 */
export async function archiveStale(brandId: string, olderThanDays = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - olderThanDays);

  return prisma.unifiedInboxMessage.updateMany({
    where: {
      brandId,
      status: "UNREAD",
      receivedAt: { lte: cutoff },
    },
    data: { status: "ARCHIVED" },
  });
}
