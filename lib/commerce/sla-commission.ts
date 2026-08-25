/** Proposed collector SLA take — not collectable until licensed PSP. */

export const SLA_TAKE_BPS = 400; // 4.00% of GMV
export const FORTIS_SHARE_BPS = 300; // 3.00% to FORTIS INVICTA LTD
export const INTEGRATOR_SHARE_BPS = 100; // 1.00% to the licensed integrator / collector
export const MERCHANT_NET_BPS = 10_000 - SLA_TAKE_BPS;

export type CommissionSplit = {
  currency: "GMD";
  amountMinor: number;
  slaTakeBps: typeof SLA_TAKE_BPS;
  fortisMinor: number;
  integratorMinor: number;
  merchantNetMinor: number;
  collectable: false;
  schedule: "proposed_sla";
};

export function splitSlaCommission(amountMinor: number): CommissionSplit {
  const gross = Math.max(0, Math.round(amountMinor));
  const fortisMinor = Math.round((gross * FORTIS_SHARE_BPS) / 10_000);
  const integratorMinor = Math.round((gross * INTEGRATOR_SHARE_BPS) / 10_000);
  return {
    currency: "GMD",
    amountMinor: gross,
    slaTakeBps: SLA_TAKE_BPS,
    fortisMinor,
    integratorMinor,
    merchantNetMinor: gross - fortisMinor - integratorMinor,
    collectable: false,
    schedule: "proposed_sla",
  };
}
