import { isFlagEnabled } from "../core/feature-flags";

export interface CommerceGate {
  id: string;
  pass: boolean;
  note: string;
}

export function kybReviewers(): string[] {
  return (process.env.FORTIS_KYB_REVIEWERS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function licensedPspNamed(): boolean {
  const name = process.env.FORTIS_LICENSED_PSP ?? "";
  return name.length > 2 && name !== "none" && name !== "sandbox";
}

export function paymentLiveDecisionSigned(): boolean {
  return process.env.FORTIS_PAYMENT_LIVE_SIGNED === "true";
}

export function commerceGates(): CommerceGate[] {
  return [
    {
      id: "live_flag",
      pass: isFlagEnabled("module.core.payments.live"),
      note: "module.core.payments.live default false",
    },
    {
      id: "partner_commerce_flag",
      pass: isFlagEnabled("module.partner.commerce"),
      note: "module.partner.commerce default false",
    },
    {
      id: "licensed_psp",
      pass: licensedPspNamed(),
      note: "Set FORTIS_LICENSED_PSP to the contracted provider legal name",
    },
    {
      id: "kyb_staff",
      pass: kybReviewers().length > 0,
      note: "Comma-separated FORTIS_KYB_REVIEWERS user ids",
    },
    {
      id: "live_money_signatures",
      pass: paymentLiveDecisionSigned(),
      note: "FORTIS_PAYMENT_LIVE_SIGNED after docs/phase-0/PAYMENT_LIVE_DECISION.md",
    },
  ];
}

export function publicCommerceReady(): boolean {
  return commerceGates().every((g) => g.pass);
}

export function sandboxUserTestingReady(): boolean {
  return kybReviewers().length > 0;
}

export function isKybReviewer(userId: string): boolean {
  return kybReviewers().includes(userId);
}
