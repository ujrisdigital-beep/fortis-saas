import type { TransferEvidence, TransferInstruction } from "./transfer";

export function issueProvisionalReceipt(
  instruction: TransferInstruction,
  evidence: TransferEvidence,
) {
  return {
    receiptNo: `RCPT-${instruction.reference}`,
    reference: instruction.reference,
    amountMinor: instruction.amountMinor,
    currency: instruction.currency,
    module: instruction.module,
    serviceId: instruction.serviceId,
    payerName: evidence.payerName,
    method: evidence.method,
    status: "PROVISIONAL" as const,
    notABankConfirmation: true,
    issuedAt: new Date().toISOString(),
    disclaimer:
      "This acknowledges declared transfer evidence. It is not a bank credit advice and not a licensed-escrow receipt.",
  };
}
