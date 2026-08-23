import { NextResponse } from "next/server";
import { fetchWorldBankGambia, pickLatest } from "@/lib/core/data/fetchers/worldbank-live";

export const dynamic = "force-dynamic";

export async function GET() {
  const bundle = await fetchWorldBankGambia();
  const pop = pickLatest(bundle.indicators, "SP.POP.TOTL");
  const urban = pickLatest(bundle.indicators, "SP.URB.TOTL.IN.ZS");
  const life = pickLatest(bundle.indicators, "SP.DYN.LE00.IN");
  return NextResponse.json({
    live: bundle.live,
    notice: bundle.notice,
    national: pop
      ? {
          totalPopulation: Number(pop.value),
          year: Number(pop.period),
          urbanRate: urban ? Number(urban.value) : null,
          lifeExpectancy: life ? Number(life.value) : null,
          freshness: pop.freshness,
          publisher: pop.publisher,
          sourceUrl: pop.sourceUrl,
        }
      : null,
    source: "World Bank population series. Official GBoS PHC remains the national census of record when published.",
  });
}
