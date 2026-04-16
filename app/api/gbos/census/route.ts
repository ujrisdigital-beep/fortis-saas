import { NextResponse } from "next/server";

// Source: Gambia Bureau of Statistics (GBOS) 2023 Population & Housing Census
const CENSUS_DATA = {
  national: {
    totalPopulation: 2639400,
    malePopulation: 1298200,
    femalePopulation: 1341200,
    annualGrowthRate: 2.8,
    urbanRate: 61.3,
    medianAge: 19.4,
    fertilityRate: 4.6,
    lifeExpectancy: 62.1,
    literacyRate: 67.4,
    lastCensus: 2023,
  },
  regions: [
    { region: "Banjul", population: 31356, households: 7200, growthRate: 0.8, urbanRate: 100, area_km2: 12 },
    { region: "Kanifing", population: 472916, households: 89000, growthRate: 3.1, urbanRate: 100, area_km2: 70 },
    { region: "Brikama", population: 697370, households: 121000, growthRate: 3.4, urbanRate: 45, area_km2: 1764 },
    { region: "Mansakonko", population: 87784, households: 16200, growthRate: 1.9, urbanRate: 22, area_km2: 1618 },
    { region: "Kerewan", population: 233781, households: 42000, growthRate: 2.2, urbanRate: 18, area_km2: 2256 },
    { region: "Kuntaur", population: 120204, households: 21500, growthRate: 1.7, urbanRate: 15, area_km2: 1466 },
    { region: "Janjanbureh", population: 120204, households: 22000, growthRate: 1.8, urbanRate: 28, area_km2: 1427 },
    { region: "Basse", population: 261273, households: 48000, growthRate: 2.9, urbanRate: 32, area_km2: 2069 },
    { region: "Farafenni", population: 154838, households: 28500, growthRate: 2.6, urbanRate: 35, area_km2: 1756 },
  ],
  ageGroups: [
    { group: "0–4", percentage: 17.8 },
    { group: "5–14", percentage: 28.3 },
    { group: "15–24", percentage: 20.4 },
    { group: "25–34", percentage: 13.9 },
    { group: "35–44", percentage: 9.2 },
    { group: "45–54", percentage: 5.8 },
    { group: "55–64", percentage: 3.1 },
    { group: "65+", percentage: 1.5 },
  ],
  ethnicity: [
    { group: "Mandinka", percentage: 33.8 },
    { group: "Fulani/Fula", percentage: 22.1 },
    { group: "Wolof", percentage: 12.2 },
    { group: "Jola/Karoninka", percentage: 10.9 },
    { group: "Serahule", percentage: 7.2 },
    { group: "Serer", percentage: 3.6 },
    { group: "Other Gambian", percentage: 6.9 },
    { group: "Non-Gambian", percentage: 3.3 },
  ],
  updatedAt: "2024-03-01",
  source: "Gambia Bureau of Statistics (GBOS) 2023 PHC",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const view = searchParams.get("view") ?? "summary";

  if (region) {
    const r = CENSUS_DATA.regions.find(r => r.region.toLowerCase() === region.toLowerCase());
    if (!r) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }
    return NextResponse.json({ region: r, source: CENSUS_DATA.source, updatedAt: CENSUS_DATA.updatedAt });
  }

  if (view === "full") {
    return NextResponse.json(CENSUS_DATA);
  }

  // Summary view
  return NextResponse.json({
    national: CENSUS_DATA.national,
    regionCount: CENSUS_DATA.regions.length,
    source: CENSUS_DATA.source,
    updatedAt: CENSUS_DATA.updatedAt,
  });
}
