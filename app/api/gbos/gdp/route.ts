import { NextResponse } from "next/server";

// Source: GBOS National Accounts Statistics & World Bank data
const GDP_DATA = {
  current: {
    year: 2024,
    gdpUSD: 2.18e9,       // $2.18 billion
    gdpGMD: 152.6e9,      // D152.6 billion
    gdpPerCapitaUSD: 826,
    gdpPerCapitaGMD: 57820,
    realGrowthRate: 5.3,
    nominalGrowthRate: 8.7,
    inflation: 10.1,
    currency: "GMD",
    exchangeRate: 70,
  },
  historical: [
    { year: 2015, gdpUSD: 0.97e9, growthRate: 4.1 },
    { year: 2016, gdpUSD: 0.97e9, growthRate: 1.9 },
    { year: 2017, gdpUSD: 0.97e9, growthRate: 3.5 },
    { year: 2018, gdpUSD: 1.09e9, growthRate: 7.2 },
    { year: 2019, gdpUSD: 1.13e9, growthRate: 6.1 },
    { year: 2020, gdpUSD: 1.06e9, growthRate: -0.2 },
    { year: 2021, gdpUSD: 1.21e9, growthRate: 5.6 },
    { year: 2022, gdpUSD: 1.52e9, growthRate: 4.9 },
    { year: 2023, gdpUSD: 1.87e9, growthRate: 5.7 },
    { year: 2024, gdpUSD: 2.18e9, growthRate: 5.3 },
  ],
  sectorContributions: [
    { sector: "Agriculture", share: 22.1, growthRate: 3.2 },
    { sector: "Tourism", share: 12.4, growthRate: 18.5 },
    { sector: "Trade & Commerce", share: 18.9, growthRate: 6.1 },
    { sector: "Financial Services", share: 8.7, growthRate: 9.3 },
    { sector: "Construction", share: 7.4, growthRate: 11.2 },
    { sector: "Transport & Logistics", share: 6.8, growthRate: 5.4 },
    { sector: "ICT & Telecoms", share: 5.6, growthRate: 22.1 },
    { sector: "Manufacturing", share: 4.2, growthRate: 4.8 },
    { sector: "Government Services", share: 8.3, growthRate: 2.1 },
    { sector: "Other", share: 5.6, growthRate: 3.9 },
  ],
  tradeBalance: {
    exports2024USD: 186e6,
    imports2024USD: 721e6,
    deficit2024USD: -535e6,
    topExports: ["Groundnuts", "Fish", "Cashews", "Re-exports"],
    topImports: ["Food", "Fuel", "Machinery", "Vehicles"],
  },
  source: "GBOS National Accounts 2024 / World Bank WDI",
  updatedAt: "2025-03-15",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view") ?? "current";

  if (view === "historical") {
    return NextResponse.json({ historical: GDP_DATA.historical, source: GDP_DATA.source });
  }
  if (view === "sectors") {
    return NextResponse.json({ sectors: GDP_DATA.sectorContributions, source: GDP_DATA.source });
  }
  if (view === "trade") {
    return NextResponse.json({ trade: GDP_DATA.tradeBalance, source: GDP_DATA.source });
  }
  if (view === "full") {
    return NextResponse.json(GDP_DATA);
  }

  return NextResponse.json({ current: GDP_DATA.current, source: GDP_DATA.source, updatedAt: GDP_DATA.updatedAt });
}
