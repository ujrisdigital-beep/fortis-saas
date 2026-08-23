/**
 * POST /api/chi-engine/generate
 * Streams a Chi Engine content plan using AI.
 *
 * Body: { brandId, platforms, weekStarting? }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { buildChiEnginePrompt, buildContentPlan } from "../../../../lib/chi-engine";
import type { Platform } from "../../../../lib/chi-engine";
import type { ContentSlot } from "../../../../lib/chi-engine";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json() as { brandId?: string; platforms?: Platform[]; weekStarting?: string };
  const { brandId, platforms, weekStarting } = body;

  if (!brandId || !platforms?.length) {
    return NextResponse.json({ error: "brandId and platforms are required." }, { status: 400 });
  }

  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) {
    return NextResponse.json({ error: "Brand not found." }, { status: 404 });
  }

  const week = weekStarting ?? getMondayISO();

  const prompt = buildChiEnginePrompt(
    {
      handle: brand.handle,
      niche: brand.niche,
      tone: brand.voiceTone ?? "Bold and direct",
      audience: "engaged followers",
      primaryGoal: "awareness",
    },
    platforms,
    week,
  );

  const aiKey = process.env.OPENAI_API_KEY;
  if (!aiKey) {
    return NextResponse.json({ error: "AI not configured." }, { status: 503 });
  }

  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    }),
  });

  if (!aiResponse.ok) {
    const errText = await aiResponse.text();
    return NextResponse.json({ error: `AI error: ${errText}` }, { status: 502 });
  }

  const aiData = await aiResponse.json() as { choices: { message: { content: string } }[] };
  const rawContent = aiData.choices[0]?.message?.content ?? "{}";

  let parsed: { slots?: Omit<ContentSlot, "chiScore">[] };
  try {
    parsed = JSON.parse(rawContent) as typeof parsed;
  } catch {
    return NextResponse.json({ error: "AI returned invalid JSON." }, { status: 502 });
  }

  const plan = buildContentPlan(brand.handle, week, parsed.slots ?? []);

  // Persist the schedule
  const savedSchedule = await prisma.contentSchedule.create({
    data: {
      brandId,
      name: `Week of ${week}`,
      weekStarting: new Date(week),
      chiPlan: plan as unknown as never,
    },
  });

  return NextResponse.json({ scheduleId: savedSchedule.id, plan });
}

function getMondayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + 1);
  return d.toISOString().split("T")[0];
}
