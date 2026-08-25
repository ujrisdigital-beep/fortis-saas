import { NextResponse } from "next/server";
import { fetchWorldBankGambia, pickLatest } from "@/lib/core/data/fetchers/worldbank-live";

export const dynamic = "force-dynamic";

export async function GET() {
  const bundle = await fetchWorldBankGambia();
  const pop = pickLatest(bundle.indicators, "SP.POP.TOTL");
  const gdp = pickLatest(bundle.indicators, "NY.GDP.MKTP.CD");
  return NextResponse.json({
    live: bundle.live,
    notice: bundle.notice,
    population: pop ? Number(pop.value) : null,
    populationYear: pop?.period ?? null,
    gdpUSD: gdp ? Number(gdp.value) : null,
    gdpYear: gdp?.period ?? null,
    freshness: pop?.freshness ?? "UNAVAILABLE",
    source: pop?.publisher ?? "unavailable",
    sourceUrl: pop?.sourceUrl,
    lastUpdated: pop?.retrievedAt,
  });
}
