import { GROW_DIAGNOSTIC_CATALOGUE, resolveCheckoutPrice } from "./catalogue";

/** GROW vertical slice: browser may only submit a price ID. */
export function growCheckoutQuote(priceId: string) {
  const price = resolveCheckoutPrice(GROW_DIAGNOSTIC_CATALOGUE, priceId);
  return {
    priceId: price.id,
    amountMinor: price.amountMinor,
    currency: price.currency,
    display: `${price.currency} ${(price.amountMinor / 100).toFixed(2)}`,
  };
}
