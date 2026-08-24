import { describe, expect, it } from "vitest";
import { openServiceEnquiry, publicLiveListings, resetServiceEnquiries } from "../../lib/services/enquiries";

describe("partner service verticals", () => {
  it("keeps live professional and equipment inventory empty", () => {
    expect(publicLiveListings()).toEqual([]);
  });

  it("accepts consented enquiries and never marks them booked", () => {
    resetServiceEnquiries();
    expect(() =>
      openServiceEnquiry({ kind: "professionals", name: "A", phone: "220", note: "need a plumber", consent: false }),
    ).toThrow("consent_required");
    const e = openServiceEnquiry({
      kind: "equipment",
      name: "A",
      phone: "220",
      note: "need a mixer",
      consent: true,
    });
    expect(e.status).toBe("RECEIVED");
  });
});
