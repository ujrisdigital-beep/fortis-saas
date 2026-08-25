export type FreshnessState =
  | "REAL_TIME"
  | "CURRENT"
  | "PERIODIC_OFFICIAL"
  | "VERIFIED_SNAPSHOT"
  | "STALE"
  | "UNAVAILABLE";

export interface CanonicalIndicator {
  sourceKey: string;
  sourceRecordId: string;
  publisher: string;
  classification: "official" | "open" | "partner" | "editorial";
  sourceUrl: string;
  publishedAt: string | null;
  retrievedAt: string;
  adapterVersion: string;
  licence: string;
  attribution: string;
  checksum: string;
  indicatorKey: string;
  value: string;
  unit: string;
  period: string;
  freshness: FreshnessState;
  geographicScope: string;
}

export interface AdapterResult {
  ok: boolean;
  runStatus: "succeeded" | "failed" | "schema_changed";
  indicators: CanonicalIndicator[];
  issues: { kind: string; detail: string }[];
}
