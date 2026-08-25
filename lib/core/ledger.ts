export type LedgerSide = "DEBIT" | "CREDIT";

export interface LedgerLine {
  accountCode: string;
  side: LedgerSide;
  amountMinor: number;
  currency: string;
}

export interface PostedTransaction {
  id: string;
  idempotencyKey: string;
  description: string;
  lines: LedgerLine[];
  reversedById?: string;
  reversesId?: string;
}

export class LedgerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LedgerError";
  }
}

export function assertBalanced(lines: LedgerLine[]): void {
  if (lines.length < 2) throw new LedgerError("need_two_lines");
  const currencies = new Set(lines.map((l) => l.currency));
  if (currencies.size !== 1) throw new LedgerError("mixed_currency");
  for (const line of lines) {
    if (!Number.isInteger(line.amountMinor) || line.amountMinor <= 0) {
      throw new LedgerError("invalid_amount");
    }
  }
  const debit = lines.filter((l) => l.side === "DEBIT").reduce((s, l) => s + l.amountMinor, 0);
  const credit = lines.filter((l) => l.side === "CREDIT").reduce((s, l) => s + l.amountMinor, 0);
  if (debit !== credit) throw new LedgerError("unbalanced");
}

export function postTransaction(
  book: PostedTransaction[],
  input: { idempotencyKey: string; description: string; lines: LedgerLine[] },
): PostedTransaction {
  const existing = book.find((t) => t.idempotencyKey === input.idempotencyKey);
  if (existing) return existing;
  assertBalanced(input.lines);
  const tx: PostedTransaction = {
    id: `ltx_${input.idempotencyKey}`,
    idempotencyKey: input.idempotencyKey,
    description: input.description,
    lines: input.lines,
  };
  book.push(tx);
  return tx;
}

export function reverseTransaction(book: PostedTransaction[], originalId: string, idempotencyKey: string): PostedTransaction {
  const original = book.find((t) => t.id === originalId);
  if (!original) throw new LedgerError("missing_original");
  if (original.reversedById) {
    const existing = book.find((t) => t.id === original.reversedById);
    if (existing) return existing;
  }
  const reverseLines = original.lines.map((l) => ({
    ...l,
    side: (l.side === "DEBIT" ? "CREDIT" : "DEBIT") as LedgerSide,
  }));
  const reversal = postTransaction(book, {
    idempotencyKey,
    description: `Reversal of ${original.id}`,
    lines: reverseLines,
  });
  original.reversedById = reversal.id;
  reversal.reversesId = original.id;
  return reversal;
}

export function postPaymentCapture(
  book: PostedTransaction[],
  input: { organisationId: string; amountMinor: number; currency: string; idempotencyKey: string },
): PostedTransaction {
  return postTransaction(book, {
    idempotencyKey: input.idempotencyKey,
    description: `Capture ${input.organisationId}`,
    lines: [
      { accountCode: "cash_clearing", side: "DEBIT", amountMinor: input.amountMinor, currency: input.currency },
      { accountCode: "deferred_revenue", side: "CREDIT", amountMinor: input.amountMinor, currency: input.currency },
    ],
  });
}

export function postRefund(
  book: PostedTransaction[],
  input: { organisationId: string; amountMinor: number; currency: string; idempotencyKey: string },
): PostedTransaction {
  return postTransaction(book, {
    idempotencyKey: input.idempotencyKey,
    description: `Refund ${input.organisationId}`,
    lines: [
      { accountCode: "deferred_revenue", side: "DEBIT", amountMinor: input.amountMinor, currency: input.currency },
      { accountCode: "cash_clearing", side: "CREDIT", amountMinor: input.amountMinor, currency: input.currency },
    ],
  });
}
