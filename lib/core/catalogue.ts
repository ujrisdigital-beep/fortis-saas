export type PriceStatus = "ACTIVE" | "SUPERSEDED" | "RETIRED";

export interface CataloguePrice {
  id: string;
  planId: string;
  currency: string;
  amountMinor: number;
  interval: string;
  status: PriceStatus;
  version: number;
}

export class PriceResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PriceResolutionError";
  }
}

export function resolveCheckoutPrice(prices: CataloguePrice[], priceId: string): CataloguePrice {
  const price = prices.find((p) => p.id === priceId);
  if (!price) {
    throw new PriceResolutionError("unknown_price");
  }
  if (price.status !== "ACTIVE") {
    throw new PriceResolutionError("price_not_purchasable");
  }
  if (!/^[A-Z]{3}$/.test(price.currency)) {
    throw new PriceResolutionError("invalid_currency");
  }
  if (!Number.isInteger(price.amountMinor) || price.amountMinor < 0) {
    throw new PriceResolutionError("invalid_amount");
  }
  return price;
}

export const FORTIS_CATALOGUE: CataloguePrice[] = [
  {
    id: "price_grow_diagnostic_gmd_v1",
    planId: "plan_grow_starter_v1",
    currency: "GMD",
    amountMinor: 25000,
    interval: "one_off",
    status: "ACTIVE",
    version: 1,
  },
  {
    id: "price_academy_assessment_gmd_v1",
    planId: "plan_academy_assess_v1",
    currency: "GMD",
    amountMinor: 15000,
    interval: "one_off",
    status: "ACTIVE",
    version: 1,
  },
  {
    id: "price_rides_trip_gmd_v1",
    planId: "plan_rides_trip_v1",
    currency: "GMD",
    amountMinor: 35000,
    interval: "one_off",
    status: "ACTIVE",
    version: 1,
  },
];

/** @deprecated use FORTIS_CATALOGUE */
export const GROW_DIAGNOSTIC_CATALOGUE = FORTIS_CATALOGUE;
