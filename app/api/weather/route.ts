import { NextResponse } from "next/server";
import { fetchBanjulWeather } from "@/lib/core/data/fetchers/open-meteo";

export const dynamic = "force-dynamic";

export async function GET() {
  const weather = await fetchBanjulWeather();
  if (!weather.ok) {
    return NextResponse.json(
      { success: false, freshness: weather.freshness, notice: weather.notice },
      { status: 503 },
    );
  }
  return NextResponse.json({ success: true, ...weather });
}
