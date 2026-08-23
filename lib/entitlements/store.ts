import type { EntitlementGrant } from "../core/entitlements";
import { grantAfterVerifiedPurchase } from "../core/entitlements";

const grants: EntitlementGrant[] = [];

const FEATURE_BY_MODULE: Record<string, string> = {
  grow: "grow.full_report",
  academy: "academy.assessment",
  marketplace: "marketplace.order",
  rides: "rides.trip",
  core: "core.generic",
};

export function featureForModule(module: string): string {
  return FEATURE_BY_MODULE[module] ?? "core.generic";
}

export function grantFromProvisionalTransfer(organisationId: string, module: string): EntitlementGrant {
  const grant = grantAfterVerifiedPurchase(
    { subscriptionActive: false, oneOffVerified: true },
    organisationId,
    featureForModule(module),
  );
  grants.push(grant);
  return grant;
}

export function listGrants(organisationId: string): EntitlementGrant[] {
  return grants.filter((g) => g.organisationId === organisationId);
}

export function resetEntitlementStore(): void {
  grants.length = 0;
}
