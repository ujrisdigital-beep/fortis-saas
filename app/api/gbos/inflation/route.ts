import { NextResponse } from "next/server";
import { fetchWorldBankGambia, pickLatest } from "@/lib/core/data/fetchers/worldbank-live";

export const dynamic = "force-dynamic";

export async function GET() {
  const bundle = await fetchWorldBankGambia();
  const cpi = pickLatest(bundle.indicators, "FP.CPI.TOTL.ZG");
  return NextResponse.json({
    live: bundle.live,
    notice: bundle.notice,
    current: cpi
      ? {
          year: Number(cpi.period),
          headlineInflation: Number(cpi.value),
          freshness: cpi.freshness,
          publisher: cpi.publisher,
          sourceUrl: cpi.sourceUrl,
        }
      : null,
    source: "World Bank WDI FP.CPI.TOTL.ZG — not a substitute for the latest GBoS monthly CPI release",
  });
}
