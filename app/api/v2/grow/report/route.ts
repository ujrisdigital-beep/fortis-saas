import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { growWithFallback } from "@/lib/core/ai/grow-report";
import { UnavailableModelAdapter } from "@/lib/core/ai/adapter";
import { reserveEntitlementCheck } from "@/lib/core/entitlements";
import { isFlagEnabled } from "@/lib/core/feature-flags";

export async function POST(request: Request) {
  if (!isFlagEnabled("module.grow.launch")) {
    return NextResponse.json({ error: "module_not_launched", code: "UNAVAILABLE" }, { status: 503 });
  }

  const access = await requireApiAccess("grow", "write");
  if (!access.ok) return access.response;

  const entitlement = reserveEntitlementCheck({
    grants: [],
    organisationId: access.session.organisationId,
    featureKey: "grow.diagnostic",
  });
  // Free deterministic report is allowed without purchase; paid narrative is not.
  void entitlement;

  const body = (await request.json().catch(() => ({}))) as Record<string, string | undefined>;
  if (!body.businessOverview?.trim()) {
    return NextResponse.json({ error: "businessOverview required", code: "INVALID_INPUT" }, { status: 400 });
  }

  const inference = isFlagEnabled("module.grow.paid_ai")
    ? await new UnavailableModelAdapter().infer({ task: "grow.report", input: body })
    : null;

  const report = growWithFallback(inference, body, []);
  return NextResponse.json({
    ok: true,
    kind: report.kind,
    report: report.text,
    citations: report.citations,
    fabricated: report.fabricated,
  });
}
