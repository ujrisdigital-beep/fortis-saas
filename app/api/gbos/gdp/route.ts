import { NextResponse } from "next/server";
import { fetchWorldBankGambia, pickLatest } from "@/lib/core/data/fetchers/worldbank-live";

export const dynamic = "force-dynamic";

export async function GET() {
  const bundle = await fetchWorldBankGambia();
  const gdp = pickLatest(bundle.indicators, "NY.GDP.MKTP.CD");
  const growth = pickLatest(bundle.indicators, "NY.GDP.MKTP.KD.ZG");
  const perCapita = pickLatest(bundle.indicators, "NY.GDP.PCAP.CD");
  return NextResponse.json({
    live: bundle.live,
    notice: bundle.notice,
    current: gdp
      ? {
          year: Number(gdp.period),
          gdpUSD: Number(gdp.value),
          gdpPerCapitaUSD: perCapita ? Number(perCapita.value) : null,
          realGrowthRate: growth ? Number(growth.value) : null,
          freshness: gdp.freshness,
          sourceUrl: gdp.sourceUrl,
          publisher: gdp.publisher,
        }
      : null,
    series: bundle.indicators.filter((i) => i.indicatorKey.startsWith("NY.GDP")),
    source: "World Bank WDI (Google Public Data Explorer compatible)",
  });
}
