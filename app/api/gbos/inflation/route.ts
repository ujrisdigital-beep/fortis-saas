import { NextResponse } from "next/server";

const INFLATION_DATA = {
  current: {
    year: 2024,
    month: "December",
    headlineInflation: 10.1,
    foodInflation: 13.4,
    nonFoodInflation: 7.8,
    coreInflation: 8.9,
    exchangeRateGMDUSD: 70.0,
    exchangeRateGMDGBP: 85.0,
    exchangeRateGMDEUR: 75.0,
    policyRate: 17.0,
  },
  monthly: [
    { month: "Jan 2024", headline: 16.7, food: 21.2, nonFood: 12.8 },
    { month: "Feb 2024", headline: 15.4, food: 19.8, nonFood: 11.9 },
    { month: "Mar 2024", headline: 14.8, food: 18.4, nonFood: 11.6 },
    { month: "Apr 2024", headline: 13.9, food: 17.1, nonFood: 11.1 },
    { month: "May 2024", headline: 13.2, food: 16.3, nonFood: 10.7 },
    { month: "Jun 2024", headline: 12.6, food: 15.8, nonFood: 10.2 },
    { month: "Jul 2024", headline: 12.1, food: 15.2, nonFood: 9.8 },
    { month: "Aug 2024", headline: 11.5, food: 14.7, nonFood: 9.3 },
    { month: "Sep 2024", headline: 11.0, food: 14.1, nonFood: 8.9 },
    { month: "Oct 2024", headline: 10.7, food: 13.8, nonFood: 8.5 },
    { month: "Nov 2024", headline: 10.4, food: 13.6, nonFood: 8.1 },
    { month: "Dec 2024", headline: 10.1, food: 13.4, nonFood: 7.8 },
  ],
  cpiBasket: [
    { category: "Food & Non-Alcoholic Beverages", weight: 45.2, yoyChange: 13.4 },
    { category: "Housing, Water, Electricity", weight: 18.6, yoyChange: 9.1 },
    { category: "Transport", weight: 9.8, yoyChange: 11.2 },
    { category: "Clothing & Footwear", weight: 7.3, yoyChange: 6.8 },
    { category: "Communication", weight: 4.1, yoyChange: 2.3 },
    { category: "Education", weight: 3.9, yoyChange: 7.4 },
    { category: "Health", weight: 3.7, yoyChange: 8.9 },
    { category: "Recreation & Culture", weight: 2.4, yoyChange: 5.1 },
    { category: "Other", weight: 5.0, yoyChange: 6.2 },
  ],
  source: "GBOS Consumer Price Index / Central Bank of The Gambia",
  updatedAt: "2025-01-15",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view") ?? "current";

  if (view === "monthly") {
    return NextResponse.json({ monthly: INFLATION_DATA.monthly, source: INFLATION_DATA.source });
  }
  if (view === "basket") {
    return NextResponse.json({ basket: INFLATION_DATA.cpiBasket, source: INFLATION_DATA.source });
  }
  if (view === "full") {
    return NextResponse.json(INFLATION_DATA);
  }

  return NextResponse.json({ current: INFLATION_DATA.current, source: INFLATION_DATA.source, updatedAt: INFLATION_DATA.updatedAt });
}
