export type FinancialInstitution = {
  name: string;
  category: "Bank" | "Mobile Money" | "Processor";
  role: string;
  fit: "HIGH" | "MEDIUM";
  useCases: string[];
  notes: string;
};

export const financialInstitutions: FinancialInstitution[] = [
  {
    name: "Ecobank Gambia",
    category: "Bank",
    role: "Primary banking and corporate settlement partner",
    fit: "HIGH",
    useCases: ["Investor receipts", "Corporate collections", "Sponsor settlements", "Payroll and supplier transfers"],
    notes: "Best anchor bank because Fortis already references Ecobank in corporate banking context.",
  },
  {
    name: "Trust Bank Gambia",
    category: "Bank",
    role: "Merchant services and SME collections",
    fit: "HIGH",
    useCases: ["Subscription collections", "Domestic transfers", "Corporate sponsorship flows"],
    notes: "Strong local footprint for domestic commercial relationships.",
  },
  {
    name: "Guaranty Trust Bank Gambia",
    category: "Bank",
    role: "Corporate banking and transaction rails",
    fit: "MEDIUM",
    useCases: ["Business accounts", "Supplier payments", "Local B2B collections"],
    notes: "Useful as secondary banking redundancy and competitive terms.",
  },
  {
    name: "QMoney",
    category: "Mobile Money",
    role: "Mass-market wallet collection and payout rail",
    fit: "HIGH",
    useCases: ["Agent payouts", "SME subscription micro-payments", "Field collections"],
    notes: "Important for last-mile access and agent network operations.",
  },
  {
    name: "Africell Money",
    category: "Mobile Money",
    role: "Consumer wallet and distributed collection rail",
    fit: "HIGH",
    useCases: ["Retail payments", "Partner reimbursements", "Community program disbursements"],
    notes: "Good for user adoption where mobile money convenience matters most.",
  },
  {
    name: "Afrimoney",
    category: "Mobile Money",
    role: "Alternative mobile payout rail",
    fit: "MEDIUM",
    useCases: ["Agent liquidity", "Rural disbursements", "Backup wallet routing"],
    notes: "Useful for redundancy and regional coverage.",
  },
  {
    name: "Stripe",
    category: "Processor",
    role: "International card processing and investor receipts",
    fit: "HIGH",
    useCases: ["Diaspora investment", "DFI card payments", "International subscriptions"],
    notes: "Best for external partners, not a replacement for local banking rails.",
  },
];

export const securityPrinciples = [
  "All payment keys remain server-side only and never reach client bundles.",
  "PII and financial metadata are encrypted at rest and limited by role-based access.",
  "Every payment event is logged, signed, and reconciled against source institution records.",
  "No AI model receives raw bank credentials, card numbers, or secret tokens.",
  "AI agents operate on masked operational summaries, not direct payment secrets.",
  "Webhook signatures must be verified before any payment state update is accepted.",
];
