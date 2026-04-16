/**
 * Brand Brain — Voice memory, hashtag libraries, and prompt templates.
 *
 * The Brand Brain stores everything that makes a brand's content unique:
 * - Voice calibration (tone, personality, dos/don'ts)
 * - Hashtag libraries by theme
 * - Evergreen content bank
 * - System prompt templates per content type
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface VoiceProfile {
  tone: string;           // e.g. "Bold, educational, zero fluff"
  personality: string;    // e.g. "Direct founder who shows receipts"
  audience: string;       // who they speak to
  pillars: string[];      // content pillars, e.g. ["Authority", "Proof", "Transformation"]
  dos: string[];          // things to always do
  donts: string[];        // things to never do
  signaturePhrases: string[]; // recurring phrases that build brand recognition
}

export interface HashtagLibrary {
  theme: string;          // e.g. "Authority", "Morning Posts", "Product Launch"
  tags: string[];
  platform: string;
  minCount: number;
  maxCount: number;
}

export interface SystemPromptTemplate {
  name: string;
  category: string;
  prompt: string;
  variables: string[];
}

// ─── DEFAULT TEMPLATE LIBRARY ────────────────────────────────────────────────

export const DEFAULT_TEMPLATES: SystemPromptTemplate[] = [
  {
    name: "Founder Mode Post",
    category: "founder-mode",
    prompt: `You are writing as {{founderName}}, founder of {{brandName}}.
Tone: {{tone}}. Audience: {{audience}}.

Write a LinkedIn/Instagram thought leadership post about: {{topic}}

Rules:
- Open with a bold statement or counter-intuitive insight (no "I" as the first word)
- Share a specific story, lesson, or data point
- End with a question or direct CTA
- Max 3 short paragraphs
- No hashtags in the body — list them at the end`,
    variables: ["founderName", "brandName", "tone", "audience", "topic"],
  },
  {
    name: "Chi Engine Weekly Plan",
    category: "chi-engine",
    prompt: `You are the Chi Engine content planner for @{{handle}}.
Niche: {{niche}} | Tone: {{tone}} | Goal: {{primaryGoal}}
Platforms: {{platforms}} | Week: {{weekStarting}}

Generate a 7-day content plan. Each slot must have:
- Specific topic (not generic)
- Unique angle
- Scroll-stopping hook
- CTA
- 3–7 hashtags
- Best content type for that platform

Return valid JSON only.`,
    variables: ["handle", "niche", "tone", "primaryGoal", "platforms", "weekStarting"],
  },
  {
    name: "Brand Voice Caption",
    category: "brand-voice",
    prompt: `Write a social media caption for @{{handle}}.
Tone: {{tone}} | Platform: {{platform}} | Goal: {{goal}}
Topic: {{topic}}

Output format:
- Hook (line 1)
- Body (2–3 sentences)
- CTA (last line)
- Hashtags (separate block)`,
    variables: ["handle", "tone", "platform", "goal", "topic"],
  },
  {
    name: "Hashtag Research",
    category: "hashtag",
    prompt: `Generate a hashtag strategy for {{niche}} content on {{platform}}.
Audience: {{audience}} | Goal: {{goal}}

Return a JSON object with:
{
  "primary": [...],    // high-volume, broad (5–10)
  "niche": [...],      // medium-volume, specific to the niche (5–10)
  "micro": [...],      // low-volume, community/engagement tags (3–5)
  "branded": [...]     // brand-specific tags (1–3)
}`,
    variables: ["niche", "platform", "audience", "goal"],
  },
  {
    name: "Smart Scheduling Advice",
    category: "scheduler",
    prompt: `Based on the account data below, recommend the best posting schedule.

Platform: {{platform}}
Niche: {{niche}}
Audience Location/Timezone: {{timezone}}
Current Average Engagement: {{engagementRate}}%
Posting Frequency Goal: {{postsPerWeek}} posts/week

Return a JSON schedule:
{
  "schedule": [
    { "day": "Tuesday", "time": "09:00", "contentType": "post", "reason": "..." }
  ],
  "generalAdvice": "..."
}`,
    variables: ["platform", "niche", "timezone", "engagementRate", "postsPerWeek"],
  },
  {
    name: "Predictive KPI Lens",
    category: "kpi-lens",
    prompt: `Forecast engagement for this upcoming piece of content.

Platform: {{platform}} | Content Type: {{contentType}}
Niche: {{niche}} | Audience Size: {{followerCount}}
Historical Avg Engagement Rate: {{avgEngagement}}%
Content Hook: {{hook}}
Best Posting Time: {{postTime}} on {{postDay}}

Return JSON:
{
  "predictedReach": number,
  "predictedLikes": number,
  "predictedComments": number,
  "predictedShares": number,
  "engagementRateForecast": number,
  "confidence": "low|medium|high",
  "tips": ["..."]
}`,
    variables: [
      "platform","contentType","niche","followerCount",
      "avgEngagement","hook","postTime","postDay",
    ],
  },
];

// ─── BRAND BRAIN DB OPERATIONS ────────────────────────────────────────────────

/**
 * Get all prompt templates for a brand (global + brand-specific).
 */
export async function getBrandTemplates(brandId: string): Promise<SystemPromptTemplate[]> {
  const rows = await prisma.systemPromptTemplate.findMany({
    where: { OR: [{ brandId }, { isGlobal: true }] },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((r) => ({
    name: r.name,
    category: r.category,
    prompt: r.prompt,
    variables: r.variables,
  }));
}

/**
 * Seed default templates for a newly created brand.
 */
export async function seedDefaultTemplates(brandId: string): Promise<void> {
  const existing = await prisma.systemPromptTemplate.count({ where: { brandId } });
  if (existing > 0) return;

  await prisma.systemPromptTemplate.createMany({
    data: DEFAULT_TEMPLATES.map((t) => ({
      brandId,
      name: t.name,
      category: t.category,
      prompt: t.prompt,
      variables: t.variables,
      isGlobal: false,
    })),
    skipDuplicates: true,
  });
}

/**
 * Fill template variables with actual values.
 */
export function hydrateTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? `{{${key}}}`);
}
