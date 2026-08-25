import type { CanonicalIndicator } from "@/lib/core/data/types";
import { displayFreshness } from "@/lib/core/data/freshness";

export function DataTrustMark({ indicator }: { indicator: CanonicalIndicator }) {
  const freshness = displayFreshness(indicator.freshness);
  const stale = indicator.freshness === "STALE" || indicator.freshness === "UNAVAILABLE";
  return (
    <aside
      data-testid="fortis-data-trust-mark"
      data-freshness={indicator.freshness}
      aria-label="FORTIS Data Trust Mark"
      style={{
        border: `1px solid ${stale ? "#b45309" : "#1B4D3E"}`,
        background: stale ? "#fffbeb" : "#f0fdf4",
        borderRadius: 8,
        padding: "0.6rem 0.8rem",
        fontSize: "0.78rem",
        lineHeight: 1.5,
      }}
    >
      <strong>FORTIS Data Trust Mark</strong>
      <div>{indicator.publisher} · {indicator.classification}</div>
      <div>{freshness.label}</div>
      <div>Period {indicator.period} · retrieved {indicator.retrievedAt.slice(0, 10)}</div>
      <div>Adapter {indicator.adapterVersion} · checksum {indicator.checksum.slice(0, 12)}</div>
      <a href={indicator.sourceUrl} rel="noreferrer">Exact source / version</a>
    </aside>
  );
}
