import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ingestWorldBankSeries } from "../adapters/worldbank";
import type { CanonicalIndicator } from "../types";
import { fetchJson } from "./http";

const INDICATORS = [
  "NY.GDP.MKTP.CD",
  "NY.GDP.PCAP.CD",
  "NY.GDP.MKTP.KD.ZG",
  "SP.POP.TOTL",
  "SP.URB.TOTL.IN.ZS",
  "FP.CPI.TOTL.ZG",
  "SP.DYN.LE00.IN",
];

function loadSnapshot(): {
  retrievedAt: string;
  series: Array<{ indicator: string; country: string; date: string; value: number }>;
} {
  const path = join(process.cwd(), "data/published/worldbank-gm.json");
  return JSON.parse(readFileSync(path, "utf8")) as ReturnType<typeof loadSnapshot>;
}

export async function fetchWorldBankGambia(): Promise<{
  live: boolean;
  indicators: CanonicalIndicator[];
  notice: string;
}> {
  const rows: Array<{ indicator: string; country: string; date: string; value: number | null }> = [];
  let live = true;

  for (const indicator of INDICATORS) {
    const url = `https://api.worldbank.org/v2/country/GM/indicator/${indicator}?format=json&mrnev=5&per_page=5`;
    const result = await fetchJson(url);
    if (!result.ok || !Array.isArray(result.data) || !Array.isArray((result.data as unknown[])[1])) {
      live = false;
      break;
    }
    const points = (result.data as [unknown, Array<{ date: string; value: number | null }>])[1];
    for (const point of points) {
      rows.push({ indicator, country: "GM", date: point.date, value: point.value });
    }
  }

  if (live && rows.length) {
    const ingested = ingestWorldBankSeries(rows);
    return {
      live: true,
      indicators: ingested.indicators,
      notice: "Live World Bank WDI (also listed on Google Public Data Explorer).",
    };
  }

  const snapshot = loadSnapshot();
  const ingested = ingestWorldBankSeries(
    snapshot.series.map((s) => ({
      indicator: s.indicator,
      country: s.country,
      date: s.date,
      value: s.value,
    })),
    snapshot.retrievedAt,
  );
  return {
    live: false,
    indicators: ingested.indicators,
    notice: `World Bank API unreachable; showing dated WDI snapshot (${snapshot.retrievedAt.slice(0, 10)}). Not current.`,
  };
}

export function pickLatest(indicators: CanonicalIndicator[], key: string): CanonicalIndicator | undefined {
  return indicators
    .filter((i) => i.indicatorKey === key)
    .sort((a, b) => b.period.localeCompare(a.period))[0];
}
