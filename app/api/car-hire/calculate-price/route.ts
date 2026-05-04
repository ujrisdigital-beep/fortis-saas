// app/api/car-hire/calculate-price/route.ts
// Distance-based car hire pricing for The Gambia

import { NextResponse } from "next/server";

// Base rates in GMD
const VEHICLE_RATES: Record<string, { perKm: number; baseRate: number; label: string }> = {
  economy: { perKm: 18, baseRate: 350, label: "Economy (Tokunbo)" },
  saloon: { perKm: 25, baseRate: 500, label: "Saloon / Sedan" },
  suv: { perKm: 35, baseRate: 700, label: "SUV / 4x4" },
  minivan: { perKm: 30, baseRate: 600, label: "Minivan (7-seater)" },
  luxury: { perKm: 60, baseRate: 1200, label: "Luxury / Executive" },
  bus: { perKm: 45, baseRate: 900, label: "Mini-Bus (14-seater)" },
};

// Known locations with approximate coordinates in Gambia
const LOCATIONS: Record<string, { lat: number; lng: number; label: string }> = {
  banjul_airport: { lat: 13.338, lng: -16.652, label: "Banjul International Airport" },
  banjul_city: { lat: 13.454, lng: -16.579, label: "Banjul City Centre" },
  serrekunda: { lat: 13.438, lng: -16.678, label: "Serrekunda" },
  kololi: { lat: 13.415, lng: -16.713, label: "Kololi" },
  bakau: { lat: 13.469, lng: -16.685, label: "Bakau" },
  fajara: { lat: 13.464, lng: -16.693, label: "Fajara" },
  kotu: { lat: 13.441, lng: -16.706, label: "Kotu" },
  senegambia: { lat: 13.427, lng: -16.721, label: "Senegambia Strip" },
  brikama: { lat: 13.269, lng: -16.652, label: "Brikama" },
  farafenni: { lat: 13.567, lng: -15.600, label: "Farafenni" },
  basse: { lat: 13.311, lng: -14.215, label: "Basse Santa Su" },
  janjanbureh: { lat: 13.534, lng: -14.766, label: "Janjanbureh" },
  soma: { lat: 13.423, lng: -15.546, label: "Soma" },
  kaolack: { lat: 14.165, lng: -16.073, label: "Kaolack, Senegal" },
  dakar: { lat: 14.716, lng: -17.467, label: "Dakar, Senegal" },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      from: string;
      to: string;
      vehicleType?: string;
      returnTrip?: boolean;
      waitingHours?: number;
    };

    const { from, to, vehicleType = "saloon", returnTrip = false, waitingHours = 0 } = body;

    if (!from || !to) {
      return NextResponse.json({ error: "from and to are required" }, { status: 400 });
    }

    const origin = LOCATIONS[from.toLowerCase()];
    const destination = LOCATIONS[to.toLowerCase()];
    const vehicle = VEHICLE_RATES[vehicleType.toLowerCase()] ?? VEHICLE_RATES.saloon;

    if (!origin || !destination) {
      return NextResponse.json({
        error: "Unknown location. Known locations: " + Object.keys(LOCATIONS).join(", "),
      }, { status: 400 });
    }

    const distanceKm = Math.round(haversineKm(origin.lat, origin.lng, destination.lat, destination.lng));
    const tripDistance = returnTrip ? distanceKm * 2 : distanceKm;

    const distanceCost = tripDistance * vehicle.perKm;
    const waitingCost = waitingHours * 150; // GMD 150/hour waiting
    const totalGMD = vehicle.baseRate + distanceCost + waitingCost;
    const totalUSD = Math.round((totalGMD / 72) * 100) / 100; // approx GMD/USD rate

    return NextResponse.json({
      ok: true,
      quote: {
        from: origin.label,
        to: destination.label,
        vehicle: vehicle.label,
        distanceKm,
        tripDistance,
        returnTrip,
        waitingHours,
        breakdown: {
          baseRate: vehicle.baseRate,
          distanceCost,
          waitingCost,
        },
        totalGMD,
        totalUSD,
        currency: "GMD",
        notes: "Price includes driver. Fuel surcharges may apply for journeys >150km.",
      },
      availableLocations: Object.entries(LOCATIONS).map(([key, val]) => ({ key, label: val.label })),
      availableVehicles: Object.entries(VEHICLE_RATES).map(([key, val]) => ({ key, label: val.label, baseRate: val.baseRate })),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/car-hire/calculate-price",
    method: "POST",
    fields: ["from", "to", "vehicleType", "returnTrip", "waitingHours"],
    availableLocations: Object.entries(LOCATIONS).map(([key, val]) => ({ key, label: val.label })),
    availableVehicles: Object.entries(VEHICLE_RATES).map(([key, val]) => ({ key, label: val.label })),
  });
}
