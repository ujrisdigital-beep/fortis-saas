import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWorldBankGambia, pickLatest } from "../../lib/core/data/fetchers/worldbank-live";
import { fetchBanjulWeather } from "../../lib/core/data/fetchers/open-meteo";
import { fetchOpenUsdRates } from "../../lib/core/data/fetchers/open-fx";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("published / live public data", () => {
  it("falls back to the dated World Bank snapshot when the API is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const bundle = await fetchWorldBankGambia();
    expect(bundle.live).toBe(false);
    expect(bundle.notice).toMatch(/snapshot/);
    const pop = pickLatest(bundle.indicators, "SP.POP.TOTL");
    expect(pop?.value).toBe("2773168");
    expect(pop?.publisher).toBe("World Bank");
    expect(pop?.freshness).not.toBe("REAL_TIME");
  });

  it("parses a live World Bank payload when present", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {},
          [{ date: "2023", value: 99 }],
        ],
      }),
    );
    const bundle = await fetchWorldBankGambia();
    expect(bundle.live).toBe(true);
    expect(bundle.indicators.length).toBeGreaterThan(0);
    expect(bundle.indicators[0].value).toBe("99");
  });

  it("does not invent weather or FX when feeds fail", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const weather = await fetchBanjulWeather();
    const fx = await fetchOpenUsdRates();
    expect(weather.ok).toBe(false);
    expect(weather.freshness).toBe("UNAVAILABLE");
    expect(fx.ok).toBe(false);
  });
});
