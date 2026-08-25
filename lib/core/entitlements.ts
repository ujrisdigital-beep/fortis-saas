export type EntitlementState = "PENDING" | "ACTIVE" | "REVOKED" | "EXPIRED";

export interface EntitlementGrant {
  organisationId: string;
  featureKey: string;
  state: EntitlementState;
  source: string;
}

export interface PurchaseState {
  subscriptionActive: boolean;
  oneOffVerified: boolean;
}

export function canUseFeature(grants: EntitlementGrant[], organisationId: string, featureKey: string): boolean {
  return grants.some(
    (g) => g.organisationId === organisationId && g.featureKey === featureKey && g.state === "ACTIVE",
  );
}

export function grantAfterVerifiedPurchase(
  purchase: PurchaseState,
  organisationId: string,
  featureKey: string,
): EntitlementGrant {
  if (!purchase.subscriptionActive && !purchase.oneOffVerified) {
    throw new Error("no_verified_purchase");
  }
  return {
    organisationId,
    featureKey,
    state: "ACTIVE",
    source: purchase.subscriptionActive ? "subscription" : "one_off",
  };
}

export function reserveEntitlementCheck(input: {
  grants: EntitlementGrant[];
  organisationId: string;
  featureKey: string;
}): { allowed: boolean; reason: string } {
  if (!canUseFeature(input.grants, input.organisationId, input.featureKey)) {
    return { allowed: false, reason: "entitlement_missing" };
  }
  return { allowed: true, reason: "ok" };
}
