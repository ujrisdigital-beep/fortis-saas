/**
 * Jumia / Konga / Mall Gambia patterns we adopt — without fake GMV.
 * Checkout stays closed until licensed collector + KYB.
 */

export const MALL_CATEGORIES = [
  { id: "phones", label: "Phones & tablets", jumia: true },
  { id: "fashion", label: "Fashion", jumia: true },
  { id: "home", label: "Home & kitchen", jumia: true },
  { id: "grocery", label: "Grocery / wet market", mall: true },
  { id: "construction", label: "Construction plant", fortis: true },
  { id: "agri", label: "Farm inputs", fortis: true },
  { id: "logistics", label: "Freight & courier", fortis: true },
] as const;

export type MallOrderState =
  | "DRAFT"
  | "AWAITING_COLLECTOR_PAY"
  | "HELD_BY_COLLECTOR"
  | "DISPATCHED"
  | "DELIVERED"
  | "RETURN_WINDOW"
  | "SETTLED"
  | "REFUNDED"
  | "CANCELLED";

export const MALL_TRANSITIONS: Record<MallOrderState, MallOrderState[]> = {
  DRAFT: ["AWAITING_COLLECTOR_PAY", "CANCELLED"],
  AWAITING_COLLECTOR_PAY: ["HELD_BY_COLLECTOR", "CANCELLED"],
  HELD_BY_COLLECTOR: ["DISPATCHED", "REFUNDED", "CANCELLED"],
  DISPATCHED: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["RETURN_WINDOW", "SETTLED"],
  RETURN_WINDOW: ["SETTLED", "REFUNDED"],
  SETTLED: [],
  REFUNDED: [],
  CANCELLED: [],
};

export const BUYER_PROTECTION = {
  returnCalendarDays: 7,
  officialStoreRequires: "KYB APPROVED + collector sub-merchant id",
  sellerScoreMinOrders: 10,
  payOnDelivery: false, // cash-on-delivery only after collector agents exist
  jumiaExpressEquivalent: false, // no FORTIS warehouse
};

export function advanceMallOrder(from: MallOrderState, to: MallOrderState): MallOrderState {
  if (!MALL_TRANSITIONS[from].includes(to)) throw new Error("invalid_mall_transition");
  return to;
}

export function officialStoreEligible(input: { kyb: "APPROVED" | string; collectorSubMerchantId?: string }) {
  return input.kyb === "APPROVED" && Boolean(input.collectorSubMerchantId);
}

export function sellerScore(input: { delivered: number; cancelled: number; returned: number }) {
  const n = input.delivered + input.cancelled + input.returned;
  if (n < BUYER_PROTECTION.sellerScoreMinOrders) {
    return { ready: false as const, note: "Too few completed jobs — no Jumia-style score yet." };
  }
  const raw = (input.delivered / n) * 5;
  return { ready: true as const, score: Math.round(raw * 10) / 10, n };
}

export const publicMallListings = (): [] => [];
