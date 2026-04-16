export type GovernmentBody = {
  code: string;
  name: string;
  focus: string;
};

export const gambiaRegions = [
  "Banjul",
  "Kanifing",
  "West Coast Region",
  "Lower River Region",
  "North Bank Region",
  "Central River Region",
  "Upper River Region",
] as const;

export const fxRates = {
  base: "GMD",
  usd: 0.016,
  eur: 0.015,
  updatedAt: "2026-03-26",
} as const;

export const keySectors = [
  "Energy",
  "Agriculture",
  "Housing",
  "Fintech",
  "SaaS",
  "Waste Management",
  "Tourism",
  "Health",
] as const;

export const governmentBodies: GovernmentBody[] = [
  { code: "GIEPA", name: "Gambia Investment & Export Promotion Agency", focus: "Investment and exports" },
  { code: "MOTIE", name: "Ministry of Trade, Industry, Regional Integration & Employment", focus: "Trade and industrial policy" },
  { code: "MOPEM", name: "Ministry of Petroleum, Energy and Mines", focus: "Energy and extractives" },
  { code: "NEA", name: "National Environment Agency", focus: "Environment and climate compliance" },
  { code: "ARIM", name: "Agency for the Regulation of Investments and Migration", focus: "Investment facilitation" },
  { code: "DoA", name: "Department of Agriculture", focus: "Agriculture policy and extension" },
];
