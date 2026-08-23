import { fetchJson } from "./http";

/** ECB-derived open FX via Frankfurter — not CBG official. */
export async function fetchOpenUsdRates() {
  const result = await fetchJson("https://api.frankfurter.app/latest?from=USD&to=GBP,EUR");
  if (!result.ok || !result.data || typeof result.data !== "object") {
    return {
      ok: false as const,
      notice: "Frankfurter/ECB feed unreachable. Fixed GMD tables are not published as live CBG rates.",
    };
  }
  const body = result.data as { date?: string; rates?: Record<string, number> };
  return {
    ok: true as const,
    date: body.date ?? null,
    base: "USD",
    rates: body.rates ?? {},
    source: "Frankfurter API (ECB reference)",
    sourceUrl: "https://www.frankfurter.app/",
    classification: "open" as const,
    notOfficialCbg: true,
  };
}
