import { describe, expect, it } from "vitest";
import { canReleasePii, firstApprove, secondApprove } from "../../lib/govern/dual-control";
import { scanEvidence } from "../../lib/govern/evidence";
import { canListProducts, decideKyb, submitKyb } from "../../lib/partner/kyb";
import { reserveTicket } from "../../lib/discover/tickets";
import { publicQuestions } from "../../lib/academy/banks";
import { rotaFor } from "../../lib/core/ops-rota";
import { remainingExternalGaps } from "../../lib/qa/module-readiness";

describe("GOVERN dual control and evidence", () => {
  it("requires two distinct officers before PII release", () => {
    const pending = { id: "1", requestedBy: "a", status: "pending" as const };
    expect(() => firstApprove(pending, "a")).toThrow("separation_of_duties");
    const partial = firstApprove(pending, "b");
    expect(canReleasePii(partial)).toBe(false);
    expect(() => secondApprove(partial, "b")).toThrow("separation_of_duties");
    const active = secondApprove(partial, "c");
    expect(canReleasePii(active)).toBe(true);
  });

  it("rejects evidence when no scanner is configured", () => {
    expect(scanEvidence({ bytes: new Uint8Array([1]), scannerConfigured: false }).accepted).toBe(false);
    expect(scanEvidence({ bytes: new Uint8Array([1]), scannerConfigured: true }).accepted).toBe(true);
  });
});

describe("PARTNER KYB", () => {
  it("blocks listing until approved", () => {
    let m = { merchantId: "m1", status: "NOT_STARTED" as const };
    expect(canListProducts(m)).toBe(false);
    m = submitKyb(m);
    m = decideKyb(m, "reviewer", true);
    expect(canListProducts(m)).toBe(true);
  });
});

describe("DISCOVER tickets", () => {
  it("will not sell without organiser KYB and provider", () => {
    const sku = { eventId: "e1", name: "Festival", quantity: 10, priceId: "price_x" };
    expect(reserveTicket(sku, 1, { providerReady: false, organiserKybApproved: true }).ok).toBe(false);
    expect(reserveTicket(sku, 1, { providerReady: true, organiserKybApproved: false }).ok).toBe(false);
    expect(reserveTicket(sku, 1, { providerReady: true, organiserKybApproved: true }).ok).toBe(true);
  });
});

describe("ACADEMY banks", () => {
  it("never exposes correctIndex on the public paper", () => {
    const paper = publicQuestions("digital-literacy");
    expect(paper[0]).not.toHaveProperty("correctIndex");
    expect(paper[0].options.length).toBeGreaterThan(1);
  });
});

describe("ops rota", () => {
  it("names a duty owner for every public applet", () => {
    for (const applet of ["core", "grow", "academy", "discover", "govern"]) {
      expect(rotaFor(applet)?.owner).toBeTruthy();
    }
  });
});

describe("remaining gaps", () => {
  it("only lists external (non-code) gaps", () => {
    for (const gap of remainingExternalGaps()) {
      expect(gap.toLowerCase()).toMatch(/external|unauthorised|policy/);
    }
  });
});
