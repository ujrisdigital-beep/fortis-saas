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

  it("does not sell demo marketplace inventory or escrow checkout", () => {
    const store = readFileSync("app/marketplace/page.tsx", "utf8");
    const checkout = readFileSync("app/api/marketplace/checkout/route.ts", "utf8");
    const dash = readFileSync("app/api/marketplace/dashboard/route.ts", "utf8");
    expect(store).not.toMatch(/DEMO_PRODUCTS|Escrow-protected payments/);
    expect(checkout).toMatch(/503/);
    expect(dash).toMatch(/totalGMDEscrowed: 0/);
  });

  it("resources menu exists and waste hub is not a WhatsApp carbon desk", () => {
    const nav = readFileSync("components/navbar.tsx", "utf8");
    const waste = readFileSync("app/resources/waste/page.tsx", "utf8");
    expect(nav).toMatch(/name: \"Resources\"/);
    expect(waste).not.toMatch(/wa\.me/);
    expect(waste).toMatch(/not issued carbon credits/);
  });

  it("does not advertise OpenAI or Stripe as the live rail", () => {
    const privacy = readFileSync("app/privacy/page.tsx", "utf8");
    const terms = readFileSync("app/terms/page.tsx", "utf8");
    expect(privacy).not.toMatch(/OpenAI/);
    expect(terms).not.toMatch(/Stripe/);
  });
});
