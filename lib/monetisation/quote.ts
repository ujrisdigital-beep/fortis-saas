import { GROW_DIAGNOSTIC_CATALOGUE, resolveCheckoutPrice } from "../core/catalogue";
import { isFlagEnabled } from "../core/feature-flags";

export function quoteByPriceId(priceId: string) {
  const price = resolveCheckoutPrice(GROW_DIAGNOSTIC_CATALOGUE, priceId);
  return {
    priceId: price.id,
    amountMinor: price.amountMinor,
    currency: price.currency,
    interval: price.interval,
    liveCapture: isFlagEnabled("module.core.payments.live"),
    next: isFlagEnabled("module.core.payments.live")
      ? "create_provider_intent"
      : "sandbox_or_invoice_only",
  };
}
