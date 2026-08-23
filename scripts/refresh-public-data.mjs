#!/usr/bin/env node
/** Refresh data/published/worldbank-gm.json from the World Bank API. */
import { writeFileSync } from "node:fs";

const INDICATORS = {
  "NY.GDP.MKTP.CD": "GDP (current US$)",
  "NY.GDP.PCAP.CD": "GDP per capita (current US$)",
  "NY.GDP.MKTP.KD.ZG": "GDP growth (annual %)",
  "SP.POP.TOTL": "Population, total",
  "SP.URB.TOTL.IN.ZS": "Urban population (%)",
  "FP.CPI.TOTL.ZG": "Inflation, consumer prices (annual %)",
  "SP.DYN.LE00.IN": "Life expectancy at birth",
};

const series = [];
for (const [indicator, label] of Object.entries(INDICATORS)) {
  const url = `https://api.worldbank.org/v2/country/GM/indicator/${indicator}?format=json&mrnev=1&per_page=1`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Fetch failed", indicator, res.status);
    process.exit(1);
  }
  const json = await res.json();
  const row = json?.[1]?.[0];
  if (!row || row.value == null) continue;
  series.push({ indicator, label, country: "GM", date: row.date, value: row.value });
}

const out = {
  publisher: "World Bank World Development Indicators",
  licence: "CC-BY-4.0",
  sourceUrl: "https://api.worldbank.org/v2/country/GM/indicator",
  googlePublicData: "https://www.google.com/publicdata/explore?ds=d5bncppjof8f9_",
  retrievedAt: new Date().toISOString(),
  classification: "open",
  series,
};
writeFileSync("data/published/worldbank-gm.json", `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${series.length} series.`);
