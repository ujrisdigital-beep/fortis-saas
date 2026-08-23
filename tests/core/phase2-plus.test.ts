import { describe, expect, it } from "vitest";
import { exportFullReport, hashGrowInput, runGrowDiagnostic } from "../../lib/grow/diagnostic";
import { matchGrants } from "../../lib/grow/grants";
import { newSerial, signCredential, verifyCredential } from "../../lib/academy/credentials";
import { publicListings, submitListing, verifyListing, type Listing } from "../../lib/discover/listings";
import { advanceComplaint, openComplaint } from "../../lib/govern/complaints";

describe("GROW diagnostic and export", () => {
  it("is reproducible and explainable", () => {
    const input = { businessOverview: "Rice mill with a sales process and cashflow plan." };
    const a = runGrowDiagnostic(input, []);
    const b = runGrowDiagnostic(input, []);
    expect(a.inputHash).toBe(hashGrowInput(input));
    expect(a.preview.scores).toEqual(b.preview.scores);
    expect(a.preview.modelCard.bankUse).toBe("not_authorised");
  });

  it("refuses full export without entitlement", () => {
    const { full } = runGrowDiagnostic({ businessOverview: "Shop" }, []);
    expect(() => exportFullReport(full, false)).toThrow("export_requires_entitlement");
    expect(exportFullReport(full, true).format).toBe("application/json");
  });
});

describe("GROW grants", () => {
  it("labels catalogue scores as editorial and dates them", () => {
    const matches = matchGrants({ country: "Gambia", sectors: ["agriculture"], asOf: "2026-08-23" });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((m) => m.scoreKind === "editorial_hypothesis")).toBe(true);
    expect(matches.every((m) => m.retrievedAsOf === "2026-08-23")).toBe(true);
    expect(matches.every((m) => m.url.startsWith("http"))).toBe(true);
  });
});

describe("ACADEMY signed credentials", () => {
  it("verifies HMAC signatures and rejects revoked or forged records", () => {
    const secret = "test-secret";
    const rec = signCredential(
      {
        serial: newSerial(new Date("2026-08-23")),
        learnerId: "u1",
        programId: "p1",
        programTitle: "Digital skills",
        issuedAt: "2026-08-23T00:00:00.000Z",
      },
      secret,
    );
    expect(verifyCredential(rec, secret).valid).toBe(true);
    expect(verifyCredential({ ...rec, signature: "00".repeat(32) }, secret).valid).toBe(false);
    expect(verifyCredential({ ...rec, revokedAt: "2026-08-24T00:00:00.000Z" }, secret).reason).toBe("revoked");
  });
});

describe("DISCOVER listings", () => {
  it("only publishes verified listings", () => {
    let listing: Listing = { id: "1", name: "Kunta Kinteh Island", category: "heritage", status: "DRAFT" };
    listing = submitListing(listing);
    expect(publicListings([listing])).toHaveLength(0);
    listing = verifyListing(listing);
    expect(publicListings([listing])).toHaveLength(1);
  });
});

describe("GOVERN complaints", () => {
  it("requires consent and does not auto-resolve", () => {
    expect(() => openComplaint({ subject: "x", body: "y", consent: false })).toThrow("consent_required");
    const c = openComplaint({ subject: "Billing", body: "Need a human review", consent: true });
    expect(c.status).toBe("RECEIVED");
    expect(advanceComplaint(c, "TRIAGED").status).toBe("TRIAGED");
    expect(() => advanceComplaint(c, "CLOSED")).toThrow("invalid_transition");
  });
});
