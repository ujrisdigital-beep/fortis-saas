/**
 * Chi Engine — Content Cycle Planning
 * Generates weekly content schedules for a brand across multiple platforms.
 * The "Chi" score rates content quality (0-100) based on hook strength,
 * clarity, CTA presence, and platform fit.
 */

export type Platform = "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "FACEBOOK" | "TIKTOK" | "YOUTUBE" | "THREADS" | "CIRCLE";
export type ContentType = "post" | "reel" | "story" | "thread" | "short" | "carousel";

export interface BrandVoice {
  handle: string;
  niche: string;
  tone: string; // e.g. "bold & educational"
  audience: string;
  primaryGoal: "awareness" | "leads" | "sales" | "community";
  hashtags?: string[];
}

export interface ContentSlot {
  day: string; // Monday–Sunday
  platform: Platform;
  contentType: ContentType;
  topic: string;
  angle: string;
  hook: string;
  cta: string;
  hashtags: string[];
  chiScore: number;
  bestPostTime: string; // "HH:MM" local time
}

export interface ContentPlan {
  brandHandle: string;
  weekStarting: string; // ISO date
  totalPieces: number;
  averageChiScore: number;
  slots: ContentSlot[];
  generatedAt: string;
}

// Default per-platform optimal posting windows (local time)
const OPTIMAL_TIMES: Record<Platform, string> = {
  TWITTER: "09:00",
  INSTAGRAM: "11:00",
  LINKEDIN: "08:30",
  FACEBOOK: "13:00",
  TIKTOK: "19:00",
  YOUTUBE: "14:00",
  THREADS: "10:00",
  CIRCLE: "10:00",
};

// Day-of-week engagement multipliers (1 = baseline)
const DAY_MULTIPLIERS: Record<string, number> = {
  Monday: 0.85,
  Tuesday: 1.0,
  Wednesday: 1.1,
  Thursday: 1.1,
  Friday: 0.95,
  Saturday: 0.80,
  Sunday: 0.75,
};

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * Score a single content slot based on engagement drivers.
 */
export function scoreContentSlot(slot: Omit<ContentSlot, "chiScore">): number {
  let score = 50;

  // Hook strength: longer, question-based hooks score higher
  if (slot.hook.length > 40) score += 10;
  if (slot.hook.includes("?")) score += 5;
  if (slot.hook.toLowerCase().includes("you") || slot.hook.toLowerCase().includes("your")) score += 5;

  // CTA presence
  if (slot.cta.length > 10) score += 8;

  // Hashtag count (sweet spot 3–7)
  const tagCount = slot.hashtags.length;
  if (tagCount >= 3 && tagCount <= 7) score += 7;
  else if (tagCount > 7) score -= 5;

  // Platform-specific content type fit
  const fitBonus: Partial<Record<Platform, ContentType[]>> = {
    INSTAGRAM: ["reel", "carousel", "story"],
    TIKTOK: ["short", "reel"],
    LINKEDIN: ["post", "carousel", "thread"],
    TWITTER: ["thread", "post"],
    YOUTUBE: ["short"],
    CIRCLE: ["post"],
  };
  const fit = fitBonus[slot.platform];
  if (fit && fit.includes(slot.contentType)) score += 10;

  // Day multiplier
  const mult = DAY_MULTIPLIERS[slot.day] ?? 1;
  score = Math.round(score * mult);

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Build a system prompt for the AI to generate a content plan.
 * This is piped into the /api/chi-engine/generate route.
 */
export function buildChiEnginePrompt(voice: BrandVoice, platforms: Platform[], weekStarting: string): string {
  return `You are the Chi Engine, a world-class social media content strategist.

Brand: @${voice.handle}
Niche: ${voice.niche}
Tone: ${voice.tone}
Target Audience: ${voice.audience}
Primary Goal: ${voice.primaryGoal}
Platforms: ${platforms.join(", ")}
Week of: ${weekStarting}
${voice.hashtags?.length ? `Core Hashtags: ${voice.hashtags.join(" ")}` : ""}

Generate a 7-day content plan. For EACH day and platform combination produce:
- A specific topic (not generic)
- The angle (what perspective makes it unique)
- A scroll-stopping hook (first line/sentence)
- A clear call-to-action
- 3–7 relevant hashtags
- The best content type for that platform

Return ONLY valid JSON matching this structure:
{
  "slots": [
    {
      "day": "Monday",
      "platform": "INSTAGRAM",
      "contentType": "reel",
      "topic": "...",
      "angle": "...",
      "hook": "...",
      "cta": "...",
      "hashtags": ["..."],
      "bestPostTime": "11:00"
    }
  ]
}`;
}

/**
 * Post-process the AI JSON response into a scored ContentPlan.
 */
export function buildContentPlan(
  brandHandle: string,
  weekStarting: string,
  rawSlots: Omit<ContentSlot, "chiScore">[],
): ContentPlan {
  const slots: ContentSlot[] = rawSlots.map((s) => ({
    ...s,
    bestPostTime: s.bestPostTime ?? OPTIMAL_TIMES[s.platform] ?? "10:00",
    chiScore: scoreContentSlot(s),
  }));

  const avg =
    slots.length > 0
      ? Math.round(slots.reduce((sum, s) => sum + s.chiScore, 0) / slots.length)
      : 0;

  return {
    brandHandle,
    weekStarting,
    totalPieces: slots.length,
    averageChiScore: avg,
    slots,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Lightweight planner: generate a template plan without AI (for preview/skeleton).
 */
export function generateTemplatePlan(voice: BrandVoice, platforms: Platform[]): ContentPlan {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const weekStarting = monday.toISOString().split("T")[0];

  const slots: Omit<ContentSlot, "chiScore">[] = [];

  DAYS_OF_WEEK.forEach((day) => {
    platforms.slice(0, 2).forEach((platform) => {
      slots.push({
        day,
        platform,
        contentType: platform === "TIKTOK" || platform === "YOUTUBE" ? "short" : "post",
        topic: `${voice.niche} insight for ${day}`,
        angle: `Personal story from the ${voice.audience} perspective`,
        hook: `Did you know most ${voice.audience} struggle with this one thing?`,
        cta: "Drop a comment 👇 or share with someone who needs this",
        hashtags: voice.hashtags?.slice(0, 5) ?? [`#${voice.niche.replace(/\s+/g, "")}`],
        bestPostTime: OPTIMAL_TIMES[platform],
      });
    });
  });

  return buildContentPlan(voice.handle, weekStarting, slots);
}
