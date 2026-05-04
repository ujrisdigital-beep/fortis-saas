import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SOIL_DATA = {
  "continental-terminal": {
    name: "Continental Terminal (Upland)",
    description: "Well-drained sandy upland soils, drought-prone",
    pH: 5.5,
    organicCarbon: 0.35,
    salinity: "none",
    crops: {
      groundnut:          { suitability: 85, yield: "1.2 t/ha", fertilizer: "NPK 30-60-20 kg/ha", variety: "Basse Local, ICGV-SM" },
      millet:             { suitability: 80, yield: "0.8 t/ha", fertilizer: "NPK 40-30-20 kg/ha", variety: "Souna-3, ICMV" },
      maize:              { suitability: 70, yield: "1.5 t/ha", fertilizer: "NPK 80-40-30 kg/ha", variety: "EV8728 open-pollinated" },
      cashew:             { suitability: 75, yield: "0.5 t/ha", fertilizer: "Low input, organic preferred", variety: "Local cashew" },
      sesame:             { suitability: 72, yield: "0.6 t/ha", fertilizer: "NPK 20-30-20 kg/ha", variety: "Goran" },
      rice:               { suitability: 20, yield: "Not viable", fertilizer: "Not recommended", variety: "Not suitable for upland" },
      vegetables:         { suitability: 55, yield: "varies", fertilizer: "Balanced NPK + irrigation", variety: "Dry-season with irrigation" },
      "salt-tolerant-rice": { suitability: 10, yield: "Not applicable", fertilizer: "N/A", variety: "Wrong soil type" },
    },
    recommendations: "Focus on drought-tolerant crops. Apply phosphorus at planting. Conservation agriculture recommended to build organic matter.",
  },
  "alluvial-lowland": {
    name: "Alluvial Lowland",
    description: "Hydromorphic clay/silt lowland soils, seasonal flooding",
    pH: 5.2,
    organicCarbon: 0.40,
    salinity: "medium",
    crops: {
      rice:               { suitability: 90, yield: "3.5 t/ha", fertilizer: "NPK 80-40-30 kg/ha split application", variety: "NERICA, Gambia Lowland" },
      "rice-fish":        { suitability: 88, yield: "3.0 t rice + 0.8 t fish/ha", fertilizer: "Integrated — reduce N to 60 kg", variety: "Tilapia + lowland rice" },
      vegetables:         { suitability: 75, yield: "varies", fertilizer: "Balanced NPK + organic", variety: "Wet-season, water-tolerant" },
      groundnut:          { suitability: 38, yield: "0.7 t/ha", fertilizer: "Avoid wet seasons", variety: "Not recommended for wet periods" },
      maize:              { suitability: 50, yield: "1.2 t/ha", fertilizer: "NPK 60-30-20 kg/ha", variety: "Rainy season only" },
      "salt-tolerant-rice": { suitability: 65, yield: "2.0 t/ha", fertilizer: "NPK 60-35-30 kg/ha", variety: "ISRIZ-7 where salinity risk" },
      millet:             { suitability: 30, yield: "0.5 t/ha", fertilizer: "Not ideal", variety: "Avoid waterlogged plots" },
      cashew:             { suitability: 15, yield: "Not viable", fertilizer: "N/A", variety: "Wrong soil type" },
    },
    recommendations: "Excellent for paddy rice and rice-fish systems. Monitor salinity intrusion during dry season. Raised-bed vegetables possible in dry season.",
  },
  "saline-tidal": {
    name: "Saline Tidal Zone",
    description: "Saline tidal swamps with acid sulfate potential",
    pH: 4.8,
    organicCarbon: 0.50,
    salinity: "high",
    crops: {
      "salt-tolerant-rice": { suitability: 88, yield: "2.5 t/ha", fertilizer: "NPK 60-35-40 kg/ha, careful P management", variety: "ISRIZ-7, AfricaRice SalTol" },
      mangrove:             { suitability: 95, yield: "Restoration value", fertilizer: "None required", variety: "Red/White/Black mangrove" },
      rice:                 { suitability: 28, yield: "1.0 t/ha (reduced)", fertilizer: "Not recommended without tolerant varieties", variety: "Standard varieties fail >4 dS/m" },
      vegetables:           { suitability: 15, yield: "Very low", fertilizer: "N/A", variety: "Not suitable" },
      groundnut:            { suitability: 5,  yield: "Negligible", fertilizer: "N/A", variety: "Not suitable" },
      maize:                { suitability: 10, yield: "Negligible", fertilizer: "N/A", variety: "Not suitable" },
      cashew:               { suitability: 5,  yield: "Not viable", fertilizer: "N/A", variety: "Not suitable" },
      millet:               { suitability: 8,  yield: "Negligible", fertilizer: "N/A", variety: "Not suitable" },
    },
    recommendations: "Prioritise ISRIZ-7 salt-tolerant rice. Invest in mangrove restoration for long-term salinity control. Avoid standard rice varieties. Rice-fish aquaculture possible in less saline areas.",
  },
  "coastal-salt": {
    name: "Coastal Salt Production Zone",
    description: "High-salinity coastal zones ideal for solar salt production",
    pH: 7.2,
    organicCarbon: 0.20,
    salinity: "extreme",
    crops: {
      salt:               { suitability: 95, yield: "15–25 t/ha/year", fertilizer: "None", variety: "Solar evaporation ponds", investment: "D500k–D10M/ha", roi: "30–50% annually", giepa: true },
      "brine-shrimp":     { suitability: 70, yield: "0.3–0.8 t/ha", fertilizer: "None", variety: "Artemia culture", investment: "D1M+", roi: "40%+" },
      mangrove:           { suitability: 60, yield: "Ecosystem restoration", fertilizer: "None", variety: "Mangrove for coastal protection" },
      rice:               { suitability: 5,  yield: "Not viable", fertilizer: "N/A", variety: "Not suitable" },
      groundnut:          { suitability: 2,  yield: "Not viable", fertilizer: "N/A", variety: "Not suitable" },
      maize:              { suitability: 2,  yield: "Not viable", fertilizer: "N/A", variety: "Not suitable" },
      vegetables:         { suitability: 5,  yield: "Not viable", fertilizer: "N/A", variety: "Not suitable" },
      millet:             { suitability: 2,  yield: "Not viable", fertilizer: "N/A", variety: "Not suitable" },
    },
    recommendations: "Best suited for solar salt production investment. GIEPA incentives available: 5-year tax holiday, duty-free equipment imports. Contact GIEPA Investment Promotion for licensing.",
  },
  "iron-pan": {
    name: "Iron Pan (Laterite)",
    description: "Laterite hardpan soils with low fertility, central and eastern",
    pH: 5.8,
    organicCarbon: 0.25,
    salinity: "none",
    crops: {
      cashew:             { suitability: 78, yield: "0.6 t/ha", fertilizer: "Organic + NPK 30-35-20 kg/ha", variety: "Local and improved cashew" },
      mango:              { suitability: 75, yield: "5 t/ha at maturity", fertilizer: "Minimal, well-drained", variety: "Kent, Palmer" },
      groundnut:          { suitability: 45, yield: "0.8 t/ha", fertilizer: "NPK 30-50-20 kg/ha", variety: "Only shallow-rooted periods" },
      millet:             { suitability: 55, yield: "0.6 t/ha", fertilizer: "NPK 30-30-20 kg/ha", variety: "Drought-tolerant local" },
      maize:              { suitability: 40, yield: "0.9 t/ha", fertilizer: "Moderate NPK", variety: "Short-season varieties" },
      rice:               { suitability: 10, yield: "Not viable", fertilizer: "N/A", variety: "Not suitable" },
      "salt-tolerant-rice": { suitability: 5, yield: "Not applicable", fertilizer: "N/A", variety: "Wrong soil type" },
      vegetables:         { suitability: 35, yield: "Low", fertilizer: "High organic matter needed", variety: "With irrigation and soil improvement" },
    },
    recommendations: "Best for tree crops (cashew, mango) that can root through laterite layers. Deep subsoiling before planting can improve water penetration. Agroforestry systems recommended.",
  },
} as const;

type SoilId = keyof typeof SOIL_DATA;
type CropId = keyof (typeof SOIL_DATA)[SoilId]["crops"];

// Determine soil type from coordinates (simplified)
function getSoilFromCoords(lat: number, lng: number): SoilId {
  if (lng < -16.6 && lat > 13.3 && lat < 13.6) return "saline-tidal";
  if (lng >= -16.6 && lng < -16.3 && lat > 13.3) return "coastal-salt";
  if (lng >= -16.3 && lng < -15.5 && lat > 13.1 && lat < 13.6) return "alluvial-lowland";
  if (lng >= -14.7 && lat > 13.0) return "iron-pan";
  return "continental-terminal";
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const soilParam = params.get("soil") as SoilId | null;
  const cropParam = params.get("crop");
  const lat = params.get("lat");
  const lng = params.get("lng");

  // Detect soil from coordinates if provided
  let soilId: SoilId | null = soilParam;
  if (!soilId && lat && lng) {
    soilId = getSoilFromCoords(parseFloat(lat), parseFloat(lng));
  }

  // Return all soils
  if (!soilId) {
    return NextResponse.json({
      success: true,
      soils: Object.entries(SOIL_DATA).map(([id, d]) => ({
        id,
        name: d.name,
        description: d.description,
        pH: d.pH,
        salinity: d.salinity,
        availableCrops: Object.keys(d.crops),
      })),
    });
  }

  const soil = SOIL_DATA[soilId];
  if (!soil) {
    return NextResponse.json({ error: "Soil type not found" }, { status: 404 });
  }

  // Return all crops for this soil
  if (!cropParam) {
    const ranked = Object.entries(soil.crops)
      .map(([id, c]) => ({ id, ...c }))
      .sort((a, b) => b.suitability - a.suitability);

    return NextResponse.json({
      success: true,
      soil: { id: soilId, ...soil, crops: undefined },
      recommendations: soil.recommendations,
      crops: ranked,
    });
  }

  // Return specific crop
  const crop = (soil.crops as Record<string, unknown>)[cropParam];
  if (!crop) {
    return NextResponse.json({ error: "Crop data not found for this soil type" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    soil: { id: soilId, name: soil.name, pH: soil.pH, salinity: soil.salinity },
    crop: { id: cropParam, ...crop as object },
    recommendations: soil.recommendations,
  });
}
