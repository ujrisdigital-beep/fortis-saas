export interface ProviderStatementLine {
  externalId: string;
  amountMinor: number;
  currency: string;
  type: "capture" | "refund" | "fee";
}

export interface LedgerFact {
  sourceExternalId: string;
  amountMinor: number;
  currency: string;
  type: "capture" | "refund" | "fee";
}

export interface ReconciliationException {
  kind: "missing_ledger" | "missing_provider" | "amount_mismatch";
  detail: string;
}

export function reconcile(provider: ProviderStatementLine[], ledger: LedgerFact[]): {
  balanced: boolean;
  exceptions: ReconciliationException[];
} {
  const exceptions: ReconciliationException[] = [];
  const ledgerById = new Map(ledger.map((l) => [l.sourceExternalId, l]));
  const providerById = new Map(provider.map((p) => [p.externalId, p]));

  for (const line of provider) {
    const fact = ledgerById.get(line.externalId);
    if (!fact) {
      exceptions.push({ kind: "missing_ledger", detail: line.externalId });
      continue;
    }
    if (fact.amountMinor !== line.amountMinor || fact.currency !== line.currency || fact.type !== line.type) {
      exceptions.push({ kind: "amount_mismatch", detail: line.externalId });
    }
  }
  for (const fact of ledger) {
    if (!providerById.has(fact.sourceExternalId)) {
      exceptions.push({ kind: "missing_provider", detail: fact.sourceExternalId });
    }
  }
  return { balanced: exceptions.length === 0, exceptions };
}
