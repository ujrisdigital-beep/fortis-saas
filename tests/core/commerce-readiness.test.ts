import { describe, expect, it } from "vitest";
import { canListProducts } from "../../lib/partner/kyb";
import { decideMerchantKyb, resetKybStore, submitMerchantKyb } from "../../lib/partner/kyb-store";
import { commerceGates, publicCommerceReady, sandboxUserTestingReady } from "../../lib/commerce/readiness";

describe("commerce readiness", () => {
  it("keeps public commerce closed without PSP, staff and signatures", () => {
    expect(publicCommerceReady()).toBe(false);
    expect(commerceGates().some((g) => g.id === "licensed_psp" && !g.pass)).toBe(true);
  });

  it("requires env reviewers before sandbox staff testing is ready", () => {
    expect(sandboxUserTestingReady()).toBe(false);
  });

  it("lets a reviewer approve KYB without opening listings for a NOT_STARTED peer", () => {
    resetKybStore();
    const submitted = submitMerchantKyb("org_1");
    expect(submitted.status).toBe("SUBMITTED");
    const decided = decideMerchantKyb("org_1", "reviewer_1", true);
    expect(decided.status).toBe("APPROVED");
    expect(canListProducts(decided)).toBe(true);
    expect(canListProducts({ merchantId: "other", status: "NOT_STARTED" })).toBe(false);
    expect(publicCommerceReady()).toBe(false);
  });
});
