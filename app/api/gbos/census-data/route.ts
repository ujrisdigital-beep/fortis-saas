// app/api/gbos/census-data/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fallback static data if DB empty
const NATIONAL_FALLBACK = [
  { year: 1963, population: 315486, growthRate: null, source: "GBOS First Modern Census" },
  { year: 1973, population: 493499, growthRate: 4.58, source: "GBOS Census" },
  { year: 1983, population: 687817, growthRate: 3.38, source: "GBOS Census" },
  { year: 1993, population: 1038145, growthRate: 4.20, source: "GBOS Census" },
  { year: 2003, population: 1360681, growthRate: 2.74, source: "GBOS Census" },
  { year: 2013, population: 1882450, growthRate: 3.30, source: "GBOS Census" },
  { year: 2024, population: 2422712, growthRate: 2.32, source: "GBOS Digital Census (Preliminary)" },
];

const URBANISATION = [
  { year: 1973, urbanShare: 22.8 },
  { year: 1983, urbanShare: 30.5 },
  { year: 1993, urbanShare: 37.1 },
  { year: 2003, urbanShare: 45.2 },
  { year: 2013, urbanShare: 52.3 },
  { year: 2024, urbanShare: 58.7 },
];

export async function GET() {
  try {
    const [national, lga, colonial, historical] = await Promise.all([
      prisma.censusData.findMany({ orderBy: { year: "asc" } }),
      prisma.lGACensusData.findMany({ orderBy: [{ year: "asc" }, { lga: "asc" }] }),
      prisma.colonialCensus.findMany({ orderBy: { year: "asc" } }),
      prisma.historicalEstimate.findMany({ orderBy: { period: "asc" } }),
    ]);

    const nationalData = national.length > 0 ? national : NATIONAL_FALLBACK;

    const summary = {
      firstModernCensus: { year: 1963, population: 315486 },
      latestCensus: { year: 2024, population: 2422712 },
      totalGrowth1963to2024: `${(((2422712 - 315486) / 315486) * 100).toFixed(1)}%`,
      averageDecadalGrowth: 3.4,
    };

    return NextResponse.json({
      ok: true,
      national: nationalData,
      lga,
      colonial,
      historical,
      urbanisation: URBANISATION,
      summary,
    });
  } catch {
    return NextResponse.json({ ok: true, national: NATIONAL_FALLBACK, lga: [], colonial: [], historical: [], urbanisation: URBANISATION, summary: { firstModernCensus: { year: 1963, population: 315486 }, latestCensus: { year: 2024, population: 2422712 }, totalGrowth1963to2024: "668.1%", averageDecadalGrowth: 3.4 } });
  }
}
