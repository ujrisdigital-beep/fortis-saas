export type TransferMethod = "bank" | "wave" | "qmoney" | "afrimoney";
export type TransferStatus = "AWAITING_TRANSFER" | "EVIDENCE_SUBMITTED" | "PROVISIONAL_ACCESS" | "REJECTED";

export interface TransferInstruction {
  id: string;
  reference: string;
  organisationHint?: string;
  module: "rides" | "grow" | "academy" | "marketplace" | "core";
  serviceId: string;
  amountMinor: number;
  currency: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryBank: string;
  status: TransferStatus;
  createdAt: string;
}

export interface TransferEvidence {
  reference: string;
  payerName: string;
  method: TransferMethod;
  declaredAmountMinor: number;
  proofNote: string;
  declaredPaidAt: string;
  submittedAt: string;
}

export function newTransferReference(now = new Date()): string {
  const y = now.getUTCFullYear();
  const n = Math.floor(100000 + Math.random() * 900000);
  return `FTS-${y}-${n}`;
}

export function createInstruction(
  input: Omit<TransferInstruction, "id" | "reference" | "status" | "createdAt">,
): TransferInstruction {
  if (!Number.isInteger(input.amountMinor) || input.amountMinor <= 0) {
    throw new Error("invalid_amount");
  }
  const reference = newTransferReference();
  return {
    ...input,
    id: `tr_${reference}`,
    reference,
    status: "AWAITING_TRANSFER",
    createdAt: new Date().toISOString(),
  };
}

export function submitEvidence(
  instruction: TransferInstruction,
  evidence: Omit<TransferEvidence, "submittedAt">,
): { instruction: TransferInstruction; evidence: TransferEvidence } {
  if (instruction.status === "REJECTED") throw new Error("rejected");
  if (evidence.reference !== instruction.reference) throw new Error("reference_mismatch");
  if (evidence.declaredAmountMinor !== instruction.amountMinor) throw new Error("amount_mismatch");
  if (!evidence.payerName.trim() || !evidence.proofNote.trim()) throw new Error("incomplete_evidence");
  const stored: TransferEvidence = { ...evidence, submittedAt: new Date().toISOString() };
  return {
    instruction: { ...instruction, status: "PROVISIONAL_ACCESS" },
    evidence: stored,
  };
}

export function canUseService(instruction: TransferInstruction): boolean {
  return instruction.status === "PROVISIONAL_ACCESS";
}

export function platformBeneficiary() {
  return {
    beneficiaryName: process.env.FORTIS_TRANSFER_ACCOUNT_NAME ?? "FORTIS INVICTA LTD",
    beneficiaryAccount: process.env.FORTIS_TRANSFER_ACCOUNT_NUMBER ?? "PENDING-OPERATOR-ACCOUNT",
    beneficiaryBank: process.env.FORTIS_TRANSFER_BANK ?? "Operator-nominated bank / Wave / QMoney",
    note: "Interim bank/wallet transfer while SBN-COMCACHE SLA is pending. Access is provisional after evidence.",
  };
}
