import { describe, expect, it } from "vitest";
import { FORTIS_CATALOGUE, resolveCheckoutPrice } from "../../lib/core/catalogue";
import { launchedModules, scorecardAligned } from "../../lib/core/modules";
import { quoteByPriceId } from "../../lib/monetisation/quote";
import { reserveTicket } from "../../lib/discover/tickets";
import { canListProducts } from "../../lib/partner/kyb";

describe("remaining modules launched honestly", () => {
  it("exposes every SBN applet as launched except gated money rails", () => {
    const ids = launchedModules().map((m) => m.id);
    expect(ids).toEqual(expect.arrayContaining(["core", "grow", "academy", "discover", "govern", "partner"]));
    expect(scorecardAligned()).toBe(true);
  });

  it("quotes academy and rides catalogue prices without live capture", () => {
    expect(FORTIS_CATALOGUE.map((p) => p.id)).toContain("price_academy_assessment_gmd_v1");
    const academy = quoteByPriceId("price_academy_assessment_gmd_v1");
    expect(academy.amountMinor).toBe(15000);
    expect(academy.liveCapture).toBe(false);
    expect(resolveCheckoutPrice(FORTIS_CATALOGUE, "price_rides_trip_gmd_v1").amountMinor).toBe(35000);
  });

  it("keeps ticket sales and merchant listings fail-closed", () => {
    const ticket = reserveTicket(
      { eventId: "e1", name: "Fest", quantity: 10, priceId: "price_x" },
      1,
      { providerReady: false, organiserKybApproved: false },
    );
    expect(ticket.ok).toBe(false);
    expect(canListProducts({ merchantId: "m1", status: "NOT_STARTED" })).toBe(false);
  });
});
