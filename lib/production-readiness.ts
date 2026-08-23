export type ReadinessReason =
  | "mock-data"
  | "simulated-transaction"
  | "unverified-payment"
  | "placeholder-output"
  | "missing-live-provider";

export interface ProductionBlock {
  path: string;
  methods?: readonly string[];
  reason: ReadinessReason;
  replacement: string;
}

/**
 * Known routes that can produce simulated, placeholder, or unverified results.
 *
 * In production these routes fail closed until their owner removes the entry
 * after the relevant production gates and tests pass. This is deliberately a
 * deny-list for the current migration; Phase 1 will move to an allow-listed
 * module registry and entitlement gateway.
 */
export const PRODUCTION_BLOCKS: readonly ProductionBlock[] = [
  {
    path: "/api/verify-payment",
    methods: ["POST"],
    reason: "unverified-payment",
    replacement: "Signed payment-provider webhook verification",
  },
  {
    path: "/api/subscriptions",
    methods: ["POST"],
    reason: "simulated-transaction",
    replacement: "Provider-backed subscription lifecycle",
  },
  {
    path: "/api/marketplace/checkout",
    methods: ["POST"],
    reason: "simulated-transaction",
    replacement: "Persistent, server-priced provider checkout",
  },
  {
    path: "/api/marketplace/currency-rates",
    methods: ["POST", "PUT", "PATCH", "DELETE"],
    reason: "mock-data",
    replacement: "Timestamped CBG or approved open-data rate adapter",
  },
  {
    path: "/api/marketplace/currency-exchange",
    reason: "simulated-transaction",
    replacement: "Licensed bureau/provider quotes and verified transaction workflow",
  },
  {
    path: "/api/seller/deposit",
    methods: ["POST"],
    reason: "simulated-transaction",
    replacement: "Provider-confirmed merchant onboarding deposit",
  },
  {
    path: "/api/car-hire/bookings",
    methods: ["POST"],
    reason: "missing-live-provider",
    replacement: "Authenticated booking with real payment and insurance controls",
  },
  {
    path: "/api/car-hire/escrow",
    methods: ["POST"],
    reason: "unverified-payment",
    replacement: "Licensed-provider safeguarded funds and reconciled ledger",
  },
  {
    path: "/api/car-hire/claims",
    methods: ["POST", "PUT", "PATCH", "DELETE"],
    reason: "missing-live-provider",
    replacement: "Authenticated claim, evidence and insurer/provider workflow",
  },
  {
    path: "/api/car-hire/vehicles",
    methods: ["POST", "PUT", "PATCH", "DELETE"],
    reason: "missing-live-provider",
    replacement: "Authenticated verified-owner and vehicle onboarding",
  },
  {
    path: "/api/marketplace/dispute",
    methods: ["POST", "PUT", "PATCH", "DELETE"],
    reason: "missing-live-provider",
    replacement: "Authenticated dispute workflow linked to a real paid order",
  },
  {
    path: "/api/marketplace/dispute/[id]/resolve",
    methods: ["POST", "PUT", "PATCH", "DELETE"],
    reason: "missing-live-provider",
    replacement: "Authorised resolution and provider refund/payout action",
  },
  {
    path: "/api/marketplace/order/[id]/confirm-delivery",
    methods: ["POST", "PUT", "PATCH"],
    reason: "missing-live-provider",
    replacement: "Authenticated buyer delivery confirmation and payout event",
  },
  {
    path: "/api/marketplace/order/[id]/confirm-location",
    methods: ["POST", "PUT", "PATCH"],
    reason: "missing-live-provider",
    replacement: "Consent-based verified location confirmation",
  },
  {
    path: "/api/ikenga/deep-search",
    reason: "mock-data",
    replacement: "Authorised live platform lookup",
  },
  {
    path: "/api/evidence/process",
    methods: ["POST"],
    reason: "placeholder-output",
    replacement: "Malware-scanned OCR and evidence extraction pipeline",
  },
  {
    path: "/api/documents/draft",
    methods: ["POST"],
    reason: "placeholder-output",
    replacement: "Local-model or deterministic production document engine",
  },
  {
    path: "/api/presentation/generate",
    methods: ["POST"],
    reason: "placeholder-output",
    replacement: "Queued production presentation renderer",
  },
  {
    path: "/api/audio/summarize",
    methods: ["POST"],
    reason: "placeholder-output",
    replacement: "Browser-native or self-hosted speech engine",
  },
  {
    path: "/api/audio/summary",
    methods: ["POST"],
    reason: "placeholder-output",
    replacement: "Browser-native or self-hosted speech engine",
  },
  {
    path: "/api/translate",
    methods: ["POST"],
    reason: "placeholder-output",
    replacement: "Tested local translation model",
  },
  {
    path: "/api/training/generate-course",
    methods: ["POST"],
    reason: "placeholder-output",
    replacement: "Human-reviewed production course authoring",
  },
  {
    path: "/api/ikenga/generate-logo",
    methods: ["POST"],
    reason: "placeholder-output",
    replacement: "Real local renderer or connected provider",
  },
  {
    path: "/api/admin/content-fetch",
    methods: ["POST"],
    reason: "mock-data",
    replacement: "Registered live source adapter pipeline",
  },
  {
    path: "/api/v2/credit-score",
    reason: "mock-data",
    replacement: "Validated, explainable and consented score model",
  },
  {
    path: "/api/marketplace/products",
    methods: ["POST"],
    reason: "mock-data",
    replacement: "Persistent merchant catalogue with KYB and server prices",
  },
] as const;

const BLOCKED_PAGES = new Map<string, ProductionBlock>([
  [
    "/employers/dashboard",
    {
      path: "/employers/dashboard",
      reason: "mock-data",
      replacement: "Tenant-scoped employer roles and consented matches",
    },
  ],
  [
    "/owner/escrow-dashboard",
    {
      path: "/owner/escrow-dashboard",
      reason: "mock-data",
      replacement: "Authenticated provider-reconciled owner account",
    },
  ],
  [
    "/admin/training-hub",
    {
      path: "/admin/training-hub",
      reason: "mock-data",
      replacement: "Database-backed protected training administration",
    },
  ],
  [
    "/admin/super",
    {
      path: "/admin/super",
      reason: "mock-data",
      replacement: "Protected live operational metrics",
    },
  ],
  [
    "/admin/escalations",
    {
      path: "/admin/escalations",
      reason: "mock-data",
      replacement: "Database-backed protected escalation queue",
    },
  ],
]);

function matchesPath(pattern: string, pathname: string): boolean {
  if (!pattern.includes("[")) return pattern === pathname;
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");
  return (
    patternParts.length === pathParts.length &&
    patternParts.every((part, index) =>
      /^\[[^\]]+\]$/.test(part) || part === pathParts[index],
    )
  );
}

export function getProductionBlock(pathname: string, method: string): ProductionBlock | undefined {
  const apiBlock = PRODUCTION_BLOCKS.find(
    (block) =>
      matchesPath(block.path, pathname) &&
      (!block.methods || block.methods.includes(method.toUpperCase())),
  );

  return apiBlock ?? BLOCKED_PAGES.get(pathname);
}
