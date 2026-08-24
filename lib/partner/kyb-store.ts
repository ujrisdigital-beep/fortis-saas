import { decideKyb, submitKyb, type MerchantKyb } from "./kyb";

const rows = new Map<string, MerchantKyb>();

export function getKyb(merchantId: string): MerchantKyb {
  return rows.get(merchantId) ?? { merchantId, status: "NOT_STARTED" };
}

export function submitMerchantKyb(merchantId: string): MerchantKyb {
  const next = submitKyb(getKyb(merchantId));
  rows.set(merchantId, next);
  return next;
}

export function decideMerchantKyb(merchantId: string, reviewer: string, approve: boolean): MerchantKyb {
  const next = decideKyb(getKyb(merchantId), reviewer, approve);
  rows.set(merchantId, next);
  return next;
}

export function listSubmittedKyb(): MerchantKyb[] {
  return [...rows.values()].filter((r) => r.status === "SUBMITTED");
}

export function resetKybStore(): void {
  rows.clear();
}
