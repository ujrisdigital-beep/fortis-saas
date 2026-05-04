import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Banjul International Airport (BJL/GBYD) coordinates
const LAT = 13.338;
const LON = -16.6522;

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    if (apiKey) {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${apiKey}&units=metric`,
        { next: { revalidate: 600 } }
      );
      if (res.ok) {
        const d = await res.json() as {
          main: { temp: number; feels_like: number; humidity: number; pressure: number };
          wind: { speed: number; deg: number };
          weather: { description: string; icon: string }[];
          visibility: number;
          sys: { sunrise: number; sunset: number };
        };
        return NextResponse.json({
          success: true,
          source: "OpenWeatherMap",
          temperature: Math.round(d.main.temp),
          feelsLike: Math.round(d.main.feels_like),
          humidity: d.main.humidity,
          windSpeed: Math.round(d.wind.speed * 3.6), // m/s → km/h
          windDirection: d.wind.deg,
          conditions: d.weather[0].description,
          icon: d.weather[0].icon,
          visibility: d.visibility,
          pressure: d.main.pressure,
          sunrise: d.sys.sunrise,
          sunset: d.sys.sunset,
        });
      }
    }
  } catch { /* fall through to estimated */ }

  // Estimated fallback — Banjul seasonal averages
  const hour = new Date().getHours();
  const month = new Date().getMonth(); // 0-11
  const isHarmatton = month >= 10 || month <= 2; // Nov-Feb
  const isWetSeason = month >= 5 && month <= 9; // Jun-Oct

  return NextResponse.json({
    success: true,
    source: "Estimated (Seasonal Average)",
    temperature: hour >= 7 && hour <= 18 ? (isHarmatton ? 30 : isWetSeason ? 28 : 33) : 22,
    feelsLike: hour >= 7 && hour <= 18 ? (isHarmatton ? 28 : 30) : 22,
    humidity: isWetSeason ? 85 : isHarmatton ? 30 : 55,
    windSpeed: isHarmatton ? 25 : 12,
    windDirection: isHarmatton ? 45 : 270,
    conditions: isHarmatton ? "Harmattan haze" : isWetSeason ? "Partly cloudy" : "Sunny",
    icon: hour >= 7 && hour <= 18 ? "02d" : "01n",
    visibility: isHarmatton ? 3000 : 10000,
    pressure: 1012,
    sunrise: null,
    sunset: null,
  });
}
