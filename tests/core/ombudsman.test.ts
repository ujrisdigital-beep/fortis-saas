import { describe, expect, it } from "vitest";
import { openComplaint, publicComplaintView } from "../../lib/govern/complaints";
import { findComplaint, resetComplaintStore, saveComplaint } from "../../lib/govern/store";

describe("public ombudsman desk", () => {
  it("stores a free complaint and looks it up without a determination", () => {
    resetComplaintStore();
    const c = openComplaint({
      subject: "Delay on a licence",
      body: "Applied in March, no reply",
      consent: true,
      category: "delay",
      organisationNamed: "A public office",
    });
    saveComplaint(c);
    const found = findComplaint(c.reference);
    expect(found?.feeToPublic).toBe("free");
    expect(publicComplaintView(found!).determination).toBeNull();
  });
});
