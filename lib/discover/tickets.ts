export interface TicketSku {
  eventId: string;
  name: string;
  quantity: number;
  priceId: string;
}

export function reserveTicket(
  sku: TicketSku,
  qty: number,
  opts: { providerReady: boolean; organiserKybApproved: boolean },
) {
  if (!opts.organiserKybApproved) return { ok: false as const, reason: "organiser_kyb_required" };
  if (!opts.providerReady) return { ok: false as const, reason: "payment_provider_required" };
  if (qty < 1 || qty > sku.quantity) return { ok: false as const, reason: "insufficient_inventory" };
  return { ok: true as const, remaining: sku.quantity - qty, priceId: sku.priceId };
}
