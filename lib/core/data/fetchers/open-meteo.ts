import { fetchJson } from "./http";

export async function fetchBanjulWeather() {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=13.4549&longitude=-16.5790&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure";
  const result = await fetchJson(url);
  if (!result.ok || !result.data || typeof result.data !== "object") {
    return {
      ok: false as const,
      freshness: "UNAVAILABLE" as const,
      notice: "Open-Meteo unreachable. Seasonal estimates are not published as live weather.",
    };
  }
  const current = (result.data as { current?: Record<string, number> }).current;
  if (!current) {
    return { ok: false as const, freshness: "UNAVAILABLE" as const, notice: "Open-Meteo payload missing current." };
  }
  return {
    ok: true as const,
    freshness: "CURRENT" as const,
    source: "Open-Meteo (open licence)",
    sourceUrl: "https://open-meteo.com/",
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    pressure: current.surface_pressure,
    weatherCode: current.weather_code,
  };
}
