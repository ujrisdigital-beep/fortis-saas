import { describe, expect, it } from "vitest";
import { splitSlaCommission } from "../../lib/commerce/sla-commission";
import {
  advanceMallOrder,
  officialStoreEligible,
  publicMallListings,
  sellerScore,
} from "../../lib/commerce/mall-sop";

describe("SLA 4% split", () => {
  it("gives 3% to FORTIS and 1% to the integrator", () => {
    const s = splitSlaCommission(100_000);
    expect(s.fortisMinor).toBe(3000);
    expect(s.integratorMinor).toBe(1000);
    expect(s.merchantNetMinor).toBe(96_000);
    expect(s.collectable).toBe(false);
  });
});

describe("Jumia-style SOP without fake GMV", () => {
  it("keeps the public mall empty", () => {
    expect(publicMallListings()).toEqual([]);
  });

  it("does not award Official Store without KYB + collector id", () => {
    expect(officialStoreEligible({ kyb: "PENDING" })).toBe(false);
    expect(officialStoreEligible({ kyb: "APPROVED", collectorSubMerchantId: "sub_1" })).toBe(true);
  });

  it("refuses illegal order jumps", () => {
    expect(() => advanceMallOrder("DRAFT", "SETTLED")).toThrow("invalid_mall_transition");
    expect(advanceMallOrder("DRAFT", "AWAITING_COLLECTOR_PAY")).toBe("AWAITING_COLLECTOR_PAY");
  });

  it("withholds seller score until ten jobs", () => {
    expect(sellerScore({ delivered: 2, cancelled: 0, returned: 0 }).ready).toBe(false);
    expect(sellerScore({ delivered: 9, cancelled: 1, returned: 0 }).ready).toBe(true);
  });
});
