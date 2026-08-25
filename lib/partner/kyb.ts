export type KybStatus = "NOT_STARTED" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface MerchantKyb {
  merchantId: string;
  status: KybStatus;
  submittedAt?: string;
  reviewedBy?: string;
}

export function submitKyb(m: MerchantKyb): MerchantKyb {
  if (m.status !== "NOT_STARTED" && m.status !== "REJECTED") throw new Error("invalid_transition");
  return { ...m, status: "SUBMITTED", submittedAt: new Date().toISOString() };
}

export function decideKyb(m: MerchantKyb, reviewer: string, approve: boolean): MerchantKyb {
  if (m.status !== "SUBMITTED") throw new Error("invalid_transition");
  return { ...m, status: approve ? "APPROVED" : "REJECTED", reviewedBy: reviewer };
}

export function canListProducts(m: MerchantKyb): boolean {
  return m.status === "APPROVED";
}
