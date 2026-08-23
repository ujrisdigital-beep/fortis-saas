import { NextResponse } from "next/server";
import { fetchWorldBankGambia } from "@/lib/core/data/fetchers/worldbank-live";
import { fetchBanjulWeather } from "@/lib/core/data/fetchers/open-meteo";
import { fetchOpenUsdRates } from "@/lib/core/data/fetchers/open-fx";

export const dynamic = "force-dynamic";

export async function GET() {
  const [wdi, weather, fx] = await Promise.all([
    fetchWorldBankGambia(),
    fetchBanjulWeather(),
    fetchOpenUsdRates(),
  ]);
  return NextResponse.json({
    worldBank: { live: wdi.live, notice: wdi.notice, count: wdi.indicators.length },
    weather: weather.ok
      ? { live: true, temperature: weather.temperature, source: weather.source }
      : { live: false, notice: weather.notice },
    fx: fx.ok ? { live: true, date: fx.date, source: fx.source } : { live: false, notice: fx.notice },
  });
}
