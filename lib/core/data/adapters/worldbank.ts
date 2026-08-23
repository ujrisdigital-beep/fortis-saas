import { createHash } from "node:crypto";
import { evaluateFreshness } from "../freshness";
import type { AdapterResult, CanonicalIndicator } from "../types";

export const WB_ADAPTER_VERSION = "wb-wdi-1.0.0";

export function ingestWorldBankSeries(
  series: Array<{ indicator: string; country: string; date: string; value: number | null }>,
  retrievedAt = new Date().toISOString(),
): AdapterResult {
  const indicators: CanonicalIndicator[] = [];
  const issues: { kind: string; detail: string }[] = [];
  for (const row of series) {
    if (row.value === null) {
      issues.push({ kind: "missing_value", detail: `${row.indicator}:${row.date}` });
      continue;
    }
    indicators.push({
      sourceKey: "WB-WDI",
      sourceRecordId: `${row.country}:${row.indicator}:${row.date}`,
      publisher: "World Bank",
      classification: "open",
      sourceUrl: "https://api.worldbank.org/",
      publishedAt: `${row.date}-01-01`,
      retrievedAt,
      adapterVersion: WB_ADAPTER_VERSION,
      licence: "CC-BY-4.0",
      attribution: "World Bank World Development Indicators",
      checksum: createHash("sha256").update(JSON.stringify(row)).digest("hex"),
      indicatorKey: row.indicator,
      value: String(row.value),
      unit: "wdi",
      period: row.date,
      freshness: evaluateFreshness({
        publishedAt: `${row.date}-01-01`,
        retrievedAt,
        expectedCadenceHours: 24 * 365,
      }),
      geographicScope: row.country,
    });
  }
  return { ok: indicators.length > 0, runStatus: indicators.length ? "succeeded" : "failed", indicators, issues };
}
