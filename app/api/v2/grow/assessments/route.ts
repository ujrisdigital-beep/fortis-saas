import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/core/api-guard";
import { ingestCbgFxTable } from "@/lib/core/data/adapters/cbg";
import { ingestGbosPayload } from "@/lib/core/data/adapters/gbos";
import { runGrowDiagnostic } from "@/lib/grow/diagnostic";
import { canUseFeature } from "@/lib/core/entitlements";
import { listGrants } from "@/lib/entitlements/store";

export async function POST(request: Request) {
  const access = await requireApiAccess("grow", "write");
  if (!access.ok) return access.response;

  const body = (await request.json().catch(() => null)) as { businessOverview?: string } | null;
  if (!body?.businessOverview?.trim()) {
    return NextResponse.json({ error: "businessOverview required", code: "INVALID_INPUT" }, { status: 400 });
  }

  const sources = [
    ...ingestGbosPayload({
      indicators: [
        {
          id: "pop-snapshot",
          key: "population",
          value: "2416668",
          unit: "persons",
          period: "2024",
          publishedAt: "2024-12-01",
          url: "https://www.gbosdata.org/",
        },
      ],
    }).indicators,
    ...ingestCbgFxTable([{ currency: "USD", midRate: "67.50", asOf: "2026-08-22" }]).indicators,
  ];

  const result = runGrowDiagnostic(
    {
      businessOverview: body.businessOverview,
      currentStage: (body as { currentStage?: string }).currentStage,
    },
    sources,
  );

  const entitled = canUseFeature(
    listGrants(access.session.organisationId),
    access.session.organisationId,
    "grow.full_report",
  );
  return NextResponse.json({
    engineVersion: result.full.engineVersion,
    preview: result.preview,
    full: entitled ? result.full : null,
    exportAllowed: entitled,
    citations: result.full.citations,
  });
}
