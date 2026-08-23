import { createHash } from "node:crypto";
import { evaluateFreshness } from "../freshness";
import type { AdapterResult, CanonicalIndicator } from "../types";

export const CBG_ADAPTER_VERSION = "cbg-fx-1.0.0";

export function ingestCbgFxTable(
  rows: Array<{ currency: string; midRate: string; asOf: string }>,
  retrievedAt = new Date().toISOString(),
): AdapterResult {
  if (!rows.length) {
    return { ok: false, runStatus: "failed", indicators: [], issues: [{ kind: "empty", detail: "no_rates" }] };
  }
  const indicators: CanonicalIndicator[] = rows.map((row) => ({
    sourceKey: "GB-CBG-FX",
    sourceRecordId: `${row.currency}:${row.asOf}`,
    publisher: "Central Bank of The Gambia",
    classification: "official",
    sourceUrl: "https://www.cbg.gm/indicative-exchange-rates-latest",
    publishedAt: row.asOf,
    retrievedAt,
    adapterVersion: CBG_ADAPTER_VERSION,
    licence: "official-publication",
    attribution: "CBG indicative rates",
    checksum: createHash("sha256").update(JSON.stringify(row)).digest("hex"),
    indicatorKey: `fx.gmd.${row.currency.toLowerCase()}`,
    value: row.midRate,
    unit: "GMD_per_unit",
    period: row.asOf.slice(0, 10),
    freshness: evaluateFreshness({
      publishedAt: row.asOf,
      retrievedAt,
      expectedCadenceHours: 24,
    }),
    geographicScope: "GM",
  }));
  return { ok: true, runStatus: "succeeded", indicators, issues: [] };
}
