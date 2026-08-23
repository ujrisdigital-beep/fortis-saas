import { createHash } from "node:crypto";
import { evaluateFreshness } from "../freshness";
import type { AdapterResult, CanonicalIndicator } from "../types";

export const GBOS_ADAPTER_VERSION = "gbos-1.0.0";

export function ingestGbosPayload(
  payload: unknown,
  retrievedAt = new Date().toISOString(),
): AdapterResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, runStatus: "failed", indicators: [], issues: [{ kind: "invalid_payload", detail: "not_object" }] };
  }
  const rows = (payload as { indicators?: unknown }).indicators;
  if (!Array.isArray(rows)) {
    return { ok: false, runStatus: "schema_changed", indicators: [], issues: [{ kind: "schema", detail: "missing_indicators" }] };
  }

  const indicators: CanonicalIndicator[] = [];
  const issues: { kind: string; detail: string }[] = [];

  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    if (typeof r.key !== "string" || typeof r.value !== "string" || typeof r.period !== "string") {
      issues.push({ kind: "conflict", detail: "incomplete_row" });
      continue;
    }
    const raw = JSON.stringify(r);
    indicators.push({
      sourceKey: "GB-GBoS",
      sourceRecordId: String(r.id ?? r.key),
      publisher: "Gambia Bureau of Statistics",
      classification: "official",
      sourceUrl: String(r.url ?? "https://www.gbosdata.org/"),
      publishedAt: typeof r.publishedAt === "string" ? r.publishedAt : null,
      retrievedAt,
      adapterVersion: GBOS_ADAPTER_VERSION,
      licence: "official-statistics-use",
      attribution: "GBoS",
      checksum: createHash("sha256").update(raw).digest("hex"),
      indicatorKey: r.key,
      value: r.value,
      unit: String(r.unit ?? "count"),
      period: r.period,
      freshness: evaluateFreshness({
        publishedAt: typeof r.publishedAt === "string" ? r.publishedAt : null,
        retrievedAt,
        expectedCadenceHours: 24 * 30,
      }),
      geographicScope: String(r.geo ?? "GM"),
    });
  }

  return { ok: indicators.length > 0, runStatus: indicators.length ? "succeeded" : "failed", indicators, issues };
}
