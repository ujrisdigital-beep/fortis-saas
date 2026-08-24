import { describe, expect, it } from "vitest";
import { createInstruction, platformBeneficiary, submitEvidence } from "../../lib/payments/transfer";
import { issueProvisionalReceipt } from "../../lib/payments/receipt";

describe("bankable receipt", () => {
  it("issues a provisional receipt that is not a bank confirmation", () => {
    const inst = createInstruction({
      module: "grow",
      serviceId: "price_grow_diagnostic_gmd_v1",
      amountMinor: 25000,
      currency: "GMD",
      ...platformBeneficiary(),
    });
    const { evidence } = submitEvidence(inst, {
      reference: inst.reference,
      payerName: "Awa Njie",
      method: "wave",
      declaredAmountMinor: 25000,
      proofNote: "WV-1",
      declaredPaidAt: "2026-08-24",
    });
    const receipt = issueProvisionalReceipt({ ...inst, status: "PROVISIONAL_ACCESS" }, evidence);
    expect(receipt.receiptNo).toBe(`RCPT-${inst.reference}`);
    expect(receipt.notABankConfirmation).toBe(true);
    expect(receipt.amountMinor).toBe(25000);
  });
});
