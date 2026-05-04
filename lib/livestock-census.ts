export interface LivestockData {
  region: string;
  cattle: number;
  goats: number;
  sheep: number;
  poultry: number;
  pigs: number;
  horses: number;
  total: number;
}

// Source: GBoS Livestock Census 2023 estimates (rounded figures)
export const LIVESTOCK_CENSUS: LivestockData[] = [
  { region: "Banjul",        cattle:   500,  goats:   2000,  sheep:   1500,  poultry:   15000,  pigs:  200,  horses:    50,  total:   19250  },
  { region: "Kanifing",      cattle:  3000,  goats:   8000,  sheep:   6000,  poultry:   80000,  pigs:  800,  horses:   200,  total:   98000  },
  { region: "West Coast",    cattle: 25000,  goats:  45000,  sheep:  35000,  poultry:  300000,  pigs: 3000,  horses:  1500,  total:  409500  },
  { region: "Lower River",   cattle: 35000,  goats:  60000,  sheep:  50000,  poultry:  400000,  pigs: 2000,  horses:  2000,  total:  549000  },
  { region: "North Bank",    cattle: 55000,  goats:  95000,  sheep:  75000,  poultry:  650000,  pigs: 1500,  horses:  5000,  total:  881500  },
  { region: "Central River", cattle: 65000,  goats: 110000,  sheep:  90000,  poultry:  750000,  pigs: 1000,  horses:  6000,  total: 1022000  },
  { region: "Upper River",   cattle: 80000,  goats: 130000,  sheep: 105000,  poultry:  900000,  pigs:  500,  horses:  7500,  total: 1223000  },
];

export const LIVESTOCK_TOTALS: LivestockData = {
  region: "National Total",
  cattle:  LIVESTOCK_CENSUS.reduce((s, r) => s + r.cattle,  0),
  goats:   LIVESTOCK_CENSUS.reduce((s, r) => s + r.goats,   0),
  sheep:   LIVESTOCK_CENSUS.reduce((s, r) => s + r.sheep,   0),
  poultry: LIVESTOCK_CENSUS.reduce((s, r) => s + r.poultry, 0),
  pigs:    LIVESTOCK_CENSUS.reduce((s, r) => s + r.pigs,    0),
  horses:  LIVESTOCK_CENSUS.reduce((s, r) => s + r.horses,  0),
  total:   LIVESTOCK_CENSUS.reduce((s, r) => s + r.total,   0),
};

export const LIVESTOCK_TYPES: { key: keyof LivestockData; label: string; emoji: string; color: string }[] = [
  { key: "cattle",  label: "Cattle",  emoji: "🐄", color: "#92400e" },
  { key: "goats",   label: "Goats",   emoji: "🐐", color: "#065f46" },
  { key: "sheep",   label: "Sheep",   emoji: "🐑", color: "#1e3a5f" },
  { key: "poultry", label: "Poultry", emoji: "🐓", color: "#7c3aed" },
  { key: "pigs",    label: "Pigs",    emoji: "🐖", color: "#be185d" },
  { key: "horses",  label: "Horses",  emoji: "🐴", color: "#374151" },
];

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000)    return (n / 1000).toFixed(0)    + "K";
  return n.toString();
}
