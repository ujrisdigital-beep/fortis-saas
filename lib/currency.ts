// Currency utility — used across all pages
// Rates: 1 USD = 70 GMD, 1 GBP = 85 GMD, 1 EUR = 75 GMD

export type Currency = "GMD" | "USD" | "GBP" | "EUR";

export const RATES: Record<Currency, number> = {
  GMD: 1,
  USD: 1 / 70,
  GBP: 1 / 85,
  EUR: 1 / 75,
};

export const SYMBOLS: Record<Currency, string> = {
  GMD: "D",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  GMD: "GMD (Dalasi)",
  USD: "USD (Dollar)",
  GBP: "GBP (Pound)",
  EUR: "EUR (Euro)",
};

/** Convert an amount from GMD to target currency */
export function convertFromGMD(gmd: number, to: Currency): number {
  return gmd * RATES[to];
}

/** Format a GMD amount in the target currency */
export function formatCurrency(gmd: number, currency: Currency, decimals = 0): string {
  const amount = convertFromGMD(gmd, currency);
  const sym = SYMBOLS[currency];
  if (currency === "GMD") return `${sym}${Math.round(amount).toLocaleString()}`;
  return `${sym}${amount.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals || 2 })}`;
}

/** Format with both currencies shown */
export function formatDual(gmd: number, currency: Currency): string {
  if (currency === "GMD") return formatCurrency(gmd, "GMD");
  return `${formatCurrency(gmd, currency)} (${formatCurrency(gmd, "GMD")})`;
}

export const LS_KEY = "fortis_currency";

export function getStoredCurrency(): Currency {
  if (typeof window === "undefined") return "GMD";
  return (localStorage.getItem(LS_KEY) as Currency) ?? "GMD";
}

export function storeCurrency(c: Currency) {
  if (typeof window !== "undefined") localStorage.setItem(LS_KEY, c);
}
