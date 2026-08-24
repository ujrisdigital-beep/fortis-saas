import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { isFlagEnabled } from "../../lib/core/feature-flags";

describe("public-commerce hygiene", () => {
  it("keeps live payments off", () => {
    expect(isFlagEnabled("module.core.payments.live")).toBe(false);
  });

  it("does not publish invented escrow or GMV on the super-admin page", () => {
    const admin = readFileSync("app/admin/super/page.tsx", "utf8");
    expect(admin).not.toMatch(/MOCK_AGGREGATES|escrowHolding|subscriptionMRR/);
    expect(admin).toMatch(/Commerce is not live/);
  });

  it("does not advertise OpenAI or Stripe as the live rail", () => {
    const privacy = readFileSync("app/privacy/page.tsx", "utf8");
    const terms = readFileSync("app/terms/page.tsx", "utf8");
    expect(privacy).not.toMatch(/OpenAI/);
    expect(terms).not.toMatch(/Stripe/);
  });
});
