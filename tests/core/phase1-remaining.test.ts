import { describe, expect, it } from "vitest";
import { forbidTenantSpoof } from "../../lib/core/policy";
import { isFlagEnabled } from "../../lib/core/feature-flags";
import { ingestGbosPayload } from "../../lib/core/data/adapters/gbos";
import { ingestCbgFxTable } from "../../lib/core/data/adapters/cbg";
import { ingestWorldBankSeries } from "../../lib/core/data/adapters/worldbank";
import { displayFreshness, evaluateFreshness } from "../../lib/core/data/freshness";
import { UnavailableModelAdapter } from "../../lib/core/ai/adapter";
import { growWithFallback, buildDeterministicGrowReport } from "../../lib/core/ai/grow-report";
import { analyzeUjuCycle } from "../../lib/fortis-tools";

describe("tenant spoof protection", () => {
  it("rejects organisation IDs that are not the session tenant", () => {
    expect(forbidTenantSpoof("org_other", "org_session")).toBe(true);
    expect(forbidTenantSpoof("org_session", "org_session")).toBe(false);
    expect(forbidTenantSpoof(undefined, "org_session")).toBe(false);
  });
});

describe("live data adapters", () => {
  it("links every GBoS indicator to source version and checksum", () => {
    const result = ingestGbosPayload({
      indicators: [
        {
          id: "pop-2024",
          key: "population",
          value: "2416668",
          unit: "persons",
          period: "2024",
          publishedAt: "2024-12-01",
          url: "https://www.gbosdata.org/pop",
        },
      ],
    });
    expect(result.ok).toBe(true);
    expect(result.indicators[0].sourceKey).toBe("GB-GBoS");
    expect(result.indicators[0].checksum).toHaveLength(64);
    expect(result.indicators[0].sourceUrl).toContain("gbos");
  });

  it("marks empty CBG/World Bank fetches unavailable rather than current", () => {
    expect(ingestCbgFxTable([]).ok).toBe(false);
    expect(ingestWorldBankSeries([{ indicator: "NY.GDP.PCAP.CD", country: "GM", date: "2023", value: null }]).ok).toBe(
      false,
    );
    expect(displayFreshness("STALE").masqueradeAsCurrent).toBe(false);
    expect(displayFreshness("UNAVAILABLE").label).toMatch(/Unavailable/);
  });

  it("classifies old retrievals as stale", () => {
    const state = evaluateFreshness({
      publishedAt: "2020-01-01",
      retrievedAt: "2020-01-02T00:00:00.000Z",
      expectedCadenceHours: 24,
      now: new Date("2026-08-23"),
    });
    expect(state).toBe("STALE");
  });
});

describe("free/local GROW AI slice", () => {
  it("is reproducible without a paid API", () => {
    const input = { businessOverview: "Groundnut cooperative with a sales plan and cashflow process." };
    const a = analyzeUjuCycle(input);
    const b = analyzeUjuCycle(input);
    expect(a.scores.transformationReadiness).toBe(b.scores.transformationReadiness);
  });

  it("falls back to deterministic sourced report when inference is unavailable", async () => {
    const unavailable = await new UnavailableModelAdapter().infer({ task: "grow.report", input: {} });
    const sources = ingestCbgFxTable([{ currency: "USD", midRate: "67.5", asOf: "2026-08-22" }]).indicators;
    const report = growWithFallback(unavailable, { businessOverview: "Retail kiosk with sales team." }, sources);
    expect(report.kind).toBe("deterministic");
    expect(report.fabricated).toBe(false);
    expect(report.citations[0].sourceKey).toBe("GB-CBG-FX");
    expect(report.text).toMatch(/Sourced indicators/);
  });

  it("does not invent citations when no sources exist", () => {
    const report = buildDeterministicGrowReport({ businessOverview: "Farm" }, []);
    expect(report.citations).toEqual([]);
    expect(report.text).toMatch(/No current official indicators/);
  });
});

describe("launch flags", () => {
  it("keeps live payments off", () => {
    expect(isFlagEnabled("module.core.payments.live")).toBe(false);
    expect(isFlagEnabled("module.grow.launch")).toBe(true);
  });
});
