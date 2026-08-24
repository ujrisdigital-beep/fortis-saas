import { NextResponse } from "next/server";
import { openComplaint, publicComplaintView, type ComplaintCategory } from "@/lib/govern/complaints";
import { findComplaint, saveComplaint } from "@/lib/govern/store";
import { consumeRateLimit } from "@/lib/onboarding/rate-limit";
import { isFlagEnabled } from "@/lib/core/feature-flags";

const CATEGORIES: ComplaintCategory[] = [
  "maladministration",
  "delay",
  "unfair_treatment",
  "service_failure",
  "access_to_information",
  "other",
];

export async function POST(request: Request) {
  if (!isFlagEnabled("module.govern.intake")) {
    return NextResponse.json({ error: "module_not_launched", code: "MODULE_OFF" }, { status: 503 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = consumeRateLimit(`ombudsman:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "rate_limited", retryAfterMs: limit.retryAfterMs }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as {
    subject?: string;
    body?: string;
    consent?: boolean;
    category?: ComplaintCategory;
    organisationNamed?: string;
    contact?: string;
  } | null;
  try {
    const category = body?.category && CATEGORIES.includes(body.category) ? body.category : "other";
    const complaint = openComplaint({
      subject: body?.subject ?? "",
      body: body?.body ?? "",
      consent: Boolean(body?.consent),
      channel: "ombudsman",
      category,
      organisationNamed: body?.organisationNamed,
      contact: body?.contact,
    });
    saveComplaint(complaint);
    return NextResponse.json(
      {
        ...publicComplaintView(complaint),
        message: "Complaint received. Free to the public. No determination has been made.",
      },
      { status: 201 },
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : "invalid";
    return NextResponse.json({ error: reason, code: "INVALID_INPUT" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference") ?? "";
  if (!reference.trim()) {
    return NextResponse.json({ error: "reference required" }, { status: 400 });
  }
  const found = findComplaint(reference);
  if (!found) {
    return NextResponse.json({ error: "not_found", code: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json(publicComplaintView(found));
}
