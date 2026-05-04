// app/api/airport/schedule/route.ts
// Banjul International Airport live flights via OpenSky Network
// ICAO airport code: GBYD

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface OpenSkyFlight {
  icao24: string;
  firstSeen: number;
  estDepartureAirport: string | null;
  lastSeen: number;
  estArrivalAirport: string | null;
  callsign: string | null;
  estDepartureAirportHorizDistance: number | null;
  estDepartureAirportVertDistance: number | null;
  estArrivalAirportHorizDistance: number | null;
  estArrivalAirportVertDistance: number | null;
  departureAirportCandidatesCount: number;
  arrivalAirportCandidatesCount: number;
}

const AIRLINE_CODES: Record<string, string> = {
  GIB: "Gambia Bird",
  BRU: "Brussels Airlines",
  TAP: "TAP Air Portugal",
  RYR: "Ryanair",
  EZY: "easyJet",
  QTR: "Qatar Airways",
  ETH: "Ethiopian Airlines",
  TUI: "TUI Airways",
  MON: "Monarch",
  TOM: "Thomson",
  TCX: "Thomas Cook",
  NIG: "Air Nigeria",
  DLH: "Lufthansa",
  BAW: "British Airways",
  AFR: "Air France",
  KQA: "Kenya Airways",
  RAM: "Royal Air Maroc",
  UAE: "Emirates",
};

function getAirlineName(callsign: string | null): string {
  if (!callsign) return "Unknown";
  const code = callsign.replace(/\d/g, "").toUpperCase().trim();
  return AIRLINE_CODES[code] || callsign.trim();
}

function formatTime(unixTs: number): string {
  return new Date(unixTs * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", timeZone: "Africa/Banjul",
  });
}

export async function GET() {
  const now = Math.floor(Date.now() / 1000);
  const begin = now - 6 * 3600; // last 6 hours
  const end = now;

  try {
    // OpenSky Network free API — no auth required for basic queries
    const [arrivalsRes, departuresRes] = await Promise.allSettled([
      fetch(
        `https://opensky-network.org/api/flights/arrival?airport=GBYD&begin=${begin}&end=${end}`,
        { signal: AbortSignal.timeout(10000), headers: { "Accept": "application/json" } }
      ),
      fetch(
        `https://opensky-network.org/api/flights/departure?airport=GBYD&begin=${begin}&end=${end}`,
        { signal: AbortSignal.timeout(10000), headers: { "Accept": "application/json" } }
      ),
    ]);

    const arrivals: OpenSkyFlight[] =
      arrivalsRes.status === "fulfilled" && arrivalsRes.value.ok
        ? await arrivalsRes.value.json()
        : [];

    const departures: OpenSkyFlight[] =
      departuresRes.status === "fulfilled" && departuresRes.value.ok
        ? await departuresRes.value.json()
        : [];

    const formattedArrivals = arrivals.slice(0, 15).map(f => ({
      callsign: f.callsign?.trim() || "N/A",
      airline: getAirlineName(f.callsign),
      origin: f.estDepartureAirport || "Unknown",
      arrivalTime: formatTime(f.lastSeen),
      icao24: f.icao24,
    }));

    const formattedDepartures = departures.slice(0, 15).map(f => ({
      callsign: f.callsign?.trim() || "N/A",
      airline: getAirlineName(f.callsign),
      destination: f.estArrivalAirport || "Unknown",
      departureTime: formatTime(f.firstSeen),
      icao24: f.icao24,
    }));

    return NextResponse.json({
      ok: true,
      airport: "Banjul International Airport",
      icao: "GBYD",
      iata: "BJL",
      timezone: "Africa/Banjul (GMT+0)",
      fetchedAt: new Date().toISOString(),
      arrivals: formattedArrivals,
      departures: formattedDepartures,
      source: "OpenSky Network",
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: "Could not fetch flight data",
      details: String(err),
      // Fallback sample data
      airport: "Banjul International Airport",
      icao: "GBYD",
      arrivals: [],
      departures: [],
    }, { status: 503 });
  }
}
