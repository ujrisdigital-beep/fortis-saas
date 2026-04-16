/**
 * GET  /api/activity/verify?agreementId=   — get compliance report
 * POST /api/activity/verify                 — log a new activity
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import {
  logActivity,
  getComplianceReport,
} from "../../../../lib/activity-verification";
type ActivityType = "POST_PUBLISHED" | "STORY_PUBLISHED" | "REEL_PUBLISHED" | "COMMENT_REPLIED" | "DM_SENT" | "LEAD_CAPTURED" | "CONTENT_APPROVED";
type ContentPlatform = "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "FACEBOOK" | "TIKTOK" | "YOUTUBE" | "THREADS" | "CIRCLE";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const agreementId = req.nextUrl.searchParams.get("agreementId");
  if (!agreementId) return NextResponse.json({ error: "agreementId required" }, { status: 400 });

  try {
    const report = await getComplianceReport(agreementId);
    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json() as {
    brandId?: string;
    activityType?: ActivityType;
    platform?: ContentPlatform;
    referenceId?: string;
    details?: Record<string, unknown>;
  };

  if (!body.brandId || !body.activityType) {
    return NextResponse.json({ error: "brandId and activityType are required." }, { status: 400 });
  }

  await logActivity({
    userId: session.user.id ?? "",
    brandId: body.brandId,
    activityType: body.activityType,
    platform: body.platform,
    referenceId: body.referenceId,
    details: body.details,
  });

  return NextResponse.json({ ok: true });
}
