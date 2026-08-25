import { describe, expect, it } from "vitest";
import { openComplaint, publicComplaintView } from "../../lib/govern/complaints";
import { findComplaint, resetComplaintStore, saveComplaint } from "../../lib/govern/store";
import { rememberCategory, resetTaskMemory, suggestCategory } from "../../lib/ujris/task-memory";

describe("public ombudsman desk", () => {
  it("requires identity or whistleblower and never binds recommendations", () => {
    expect(() =>
      openComplaint({ subject: "x", body: "y", consent: true }),
    ).toThrow("identity_or_whistleblower_required");
    const c = openComplaint({
      subject: "Delay on a licence",
      body: "Applied in March, no reply",
      consent: true,
      category: "delay",
      contact: "220000",
    });
    expect(c.recommendationsBinding).toBe(false);
    expect(c.screen.humanDecisionRequired).toBe(true);
  });

  it("separates platform disputes from Ombudsman Act cases", () => {
    const d = openComplaint({
      subject: "Order",
      body: "No delivery",
      consent: true,
      channel: "platform_dispute",
      contact: "a@b.c",
      againstPublicAuthority: false,
    });
    expect(d.reference.startsWith("DIS-")).toBe(true);
    expect(publicComplaintView(d).notice).toMatch(/Not an Ombudsman Act/);
  });

  it("lets UJRIS memory rank a category after a task", () => {
    resetTaskMemory();
    rememberCategory("delay");
    rememberCategory("delay");
    expect(suggestCategory("something vague", "other").category).toBe("delay");
  });

  it("looks up a stored file", () => {
    resetComplaintStore();
    const c = openComplaint({
      subject: "x",
      body: "y",
      consent: true,
      whistleblower: true,
    });
    saveComplaint(c);
    expect(findComplaint(c.reference)?.feeToPublic).toBe("free");
  });
});
