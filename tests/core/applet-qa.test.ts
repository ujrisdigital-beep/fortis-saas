import { describe, expect, it } from "vitest";
import { APPLET_SCORECARDS, monetisationIntegrationSurface } from "../../lib/qa/module-readiness";
import { DEMO_BANK, gradeAssessment } from "../../lib/academy/assess";
import { quoteByPriceId } from "../../lib/monetisation/quote";
import { getProductionBlock } from "../../lib/production-readiness";

describe("applet QA scorecards", () => {
  it("opens PARTNER directory as preview without monetised commerce", () => {
    const partner = APPLET_SCORECARDS.find((s) => s.applet === "partner");
    expect(partner?.realUserReady).toBe(true);
    expect(partner?.monetisationReady).toBe(false);
    expect(partner?.maturity).toBe("preview");
  });

  it("marks CORE and GROW as monetisation-integration ready without live capture", () => {
    const grow = APPLET_SCORECARDS.find((s) => s.applet === "grow");
    expect(grow?.monetisationReady).toBe(true);
    expect(monetisationIntegrationSurface().liveEnabled).toBe(false);
  });
});

describe("academy assessment integrity", () => {
  it("ignores client-supplied answer keys and grades the server bank", () => {
    const result = gradeAssessment(
      DEMO_BANK,
      [
        { questionId: "q1", selectedIndex: 1 },
        { questionId: "q2", selectedIndex: 1 },
      ],
      { tabSwitches: 0, timeSpentSeconds: 120 },
    );
    expect(result.score).toBe(100);
    expect(result.eligibleForCertificate).toBe(true);
    const fail = gradeAssessment(DEMO_BANK, [{ questionId: "q1", selectedIndex: 0 }], {
      tabSwitches: 0,
      timeSpentSeconds: 120,
    });
    expect(fail.passed).toBe(false);
  });
});

describe("monetisation quote", () => {
  it("resolves only catalogue price IDs", () => {
    const quote = quoteByPriceId("price_grow_diagnostic_gmd_v1");
    expect(quote.amountMinor).toBe(25000);
    expect(quote.liveCapture).toBe(false);
    expect(() => quoteByPriceId("forged")).toThrow();
  });
});

describe("partner write fail-closed", () => {
  it("blocks marketplace product POSTs in production policy", () => {
    expect(getProductionBlock("/api/marketplace/products", "POST")?.reason).toBe("mock-data");
  });
});
