import { describe, expect, it, beforeEach } from "vitest";
import { createInstruction, platformBeneficiary, submitEvidence } from "../../lib/payments/transfer";
import {
  featureForModule,
  grantFromProvisionalTransfer,
  listGrants,
  resetEntitlementStore,
} from "../../lib/entitlements/store";
import { canUseFeature } from "../../lib/core/entitlements";

describe("transfer unlocks other modules", () => {
  beforeEach(() => resetEntitlementStore());

  it("grants GROW full report after matching evidence", () => {
    const inst = createInstruction({
      module: "grow",
      serviceId: "price_grow_diagnostic_gmd_v1",
      amountMinor: 25000,
      currency: "GMD",
      ...platformBeneficiary(),
    });
    const paid = submitEvidence(inst, {
      reference: inst.reference,
      payerName: "Awa",
      method: "bank",
      declaredAmountMinor: 25000,
      proofNote: "GT-001",
      declaredPaidAt: "2026-08-23",
    });
    const grant = grantFromProvisionalTransfer("org_a", paid.instruction.module);
    expect(featureForModule("grow")).toBe("grow.full_report");
    expect(canUseFeature(listGrants("org_a"), "org_a", "grow.full_report")).toBe(true);
    expect(grant.source).toBe("one_off");
  });

  it("maps academy and marketplace modules to distinct features", () => {
    grantFromProvisionalTransfer("org_a", "academy");
    expect(canUseFeature(listGrants("org_a"), "org_a", "academy.assessment")).toBe(true);
    expect(canUseFeature(listGrants("org_a"), "org_a", "marketplace.order")).toBe(false);
  });
});
