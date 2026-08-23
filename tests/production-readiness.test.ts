import { describe, expect, it } from "vitest";
import { getProductionBlock, PRODUCTION_BLOCKS } from "../lib/production-readiness";

describe("production readiness fail-closed policy", () => {
  it("blocks simulated payment verification", () => {
    expect(getProductionBlock("/api/verify-payment", "POST")?.reason).toBe("unverified-payment");
  });

  it("blocks subscription activation writes but permits catalogue reads", () => {
    expect(getProductionBlock("/api/subscriptions", "POST")).toBeDefined();
    expect(getProductionBlock("/api/subscriptions", "GET")).toBeUndefined();
  });

  it("blocks known mock admin pages", () => {
    expect(getProductionBlock("/admin/super", "GET")?.reason).toBe("mock-data");
  });

  it("matches dynamic financial routes", () => {
    expect(getProductionBlock("/api/marketplace/order/order-123/confirm-delivery", "POST")).toBeDefined();
    expect(getProductionBlock("/api/marketplace/dispute/dispute-123/resolve", "POST")).toBeDefined();
  });

  it("does not accidentally block unrelated routes", () => {
    expect(getProductionBlock("/", "GET")).toBeUndefined();
    expect(getProductionBlock("/api/health", "GET")).toBeUndefined();
  });

  it("documents a real replacement for every blocked API", () => {
    for (const block of PRODUCTION_BLOCKS) {
      expect(block.replacement.trim().length).toBeGreaterThan(10);
    }
  });
});
