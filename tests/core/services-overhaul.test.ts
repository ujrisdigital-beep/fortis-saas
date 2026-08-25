import { describe, expect, it } from "vitest";
import { openServiceEnquiry, publicLiveListings, resetServiceEnquiries } from "../../lib/services/enquiries";
import {
  attemptDeskCheckout,
  commissionPreview,
  estimateFreight,
  openDeskThread,
  postDeskMessage,
  resetDeskThreads,
} from "../../lib/services/desk";
import { detectOffPlatformLeak, redactLeaks } from "../../lib/services/lead-containment";

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

  it("keeps desk checkout and escrow closed", () => {
    resetDeskThreads();
    const t = openDeskThread({ kind: "logistics", subject: "Banjul Port to Dakar", firstMessage: "2 t rice" });
    expect(t.booked).toBe(false);
    expect(t.escrow).toBe(false);
    const pay = attemptDeskCheckout(t.id);
    expect(pay.status).toBe(503);
    expect(pay.escrow).toBe(false);
    const fee = commissionPreview(100_000);
    expect(fee.collectable).toBe(false);
    expect(fee.commissionMinor).toBe(8000);
    const fx = estimateFreight({ kg: 100, origin: "Banjul Port", dest: "Dakar, Senegal" });
    expect(fx.freshness).toBe("ILLUSTRATIVE_MODEL");
  });

  it("strips WhatsApp and phone so merchants cannot lift the lead", () => {
    expect(detectOffPlatformLeak("chat me on https://wa.me/2209901234").some((h) => h.kind === "whatsapp")).toBe(true);
    expect(redactLeaks("pay me +220 7701234")).toMatch(/blocked:phone/);
    resetDeskThreads();
    const t = openDeskThread({ kind: "equipment", subject: "mixer", firstMessage: "need a mixer" });
    const after = postDeskMessage(t.id, "WhatsApp me +2209901234 and pay Wave", "merchant");
    expect(after.messages.at(-1)?.body).not.toMatch(/9901234/i);
    expect(after.circumventionFlags.length).toBeGreaterThan(0);
  });
});
