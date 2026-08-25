import { NextResponse } from "next/server";
import { ingestGbosPayload } from "@/lib/core/data/adapters/gbos";
import { ingestCbgFxTable } from "@/lib/core/data/adapters/cbg";
import { ingestWorldBankSeries } from "@/lib/core/data/adapters/worldbank";
import { displayFreshness } from "@/lib/core/data/freshness";

export async function GET(_req: Request, context: { params: { sourceKey: string } }) {
  const key = context.params.sourceKey;
  const retrievedAt = new Date().toISOString();

  let result;
  if (key === "GB-GBoS") {
    result = ingestGbosPayload({ indicators: [] }, retrievedAt);
  } else if (key === "GB-CBG-FX") {
    result = ingestCbgFxTable([], retrievedAt);
  } else if (key === "WB-WDI") {
    result = ingestWorldBankSeries([], retrievedAt);
  } else {
    return NextResponse.json({ error: "unknown_source", code: "NOT_FOUND" }, { status: 404 });
  }

  const freshness = result.indicators[0]
    ? displayFreshness(result.indicators[0].freshness)
    : displayFreshness("UNAVAILABLE");

  return NextResponse.json({
    sourceKey: key,
    status: result.runStatus,
    freshness: freshness.label,
    masqueradeAsCurrent: freshness.masqueradeAsCurrent,
    indicators: result.indicators,
    issues: result.issues,
  });
}
