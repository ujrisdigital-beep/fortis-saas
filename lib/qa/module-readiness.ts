export type AppletId = "core" | "grow" | "academy" | "discover" | "govern" | "partner";
export type Gate = "A_commercial" | "B_data" | "C_security" | "D_financial" | "E_quality" | "F_ops";
export type Maturity = "internal" | "preview" | "pilot" | "production";

export interface AppletScorecard {
  applet: AppletId;
  name: string;
  maturity: Maturity;
  monetisationReady: boolean;
  realUserReady: boolean;
  gates: Record<Gate, { pass: boolean; note: string }>;
  gaps: string[];
  next: string;
}

export const APPLET_SCORECARDS: AppletScorecard[] = [
  {
    applet: "core",
    name: "FORTIS CORE",
    maturity: "pilot",
    monetisationReady: true,
    realUserReady: true,
    gates: {
      A_commercial: { pass: true, note: "Shared control plane" },
      B_data: { pass: true, note: "Core schema migrated and PGlite-validated" },
      C_security: { pass: true, note: "Policy, onboarding QA, fail-closed modules" },
      D_financial: { pass: true, note: "Sandbox + ledger; live flag off" },
      E_quality: { pass: true, note: "Automated suites" },
      F_ops: { pass: true, note: "Status, runbooks, pilot rota" },
    },
    gaps: ["External: Prisma CDN / GitHub workflows permission / live-money signatures"],
    next: "Admin copies quality-workflow.yml; owners sign PAYMENT_LIVE_DECISION",
  },
  {
    applet: "grow",
    name: "FORTIS GROW",
    maturity: "pilot",
    monetisationReady: true,
    realUserReady: true,
    gates: {
      A_commercial: { pass: true, note: "Preview free / entitled export" },
      B_data: { pass: true, note: "Versioned diagnostic + citations" },
      C_security: { pass: true, note: "Membership gated" },
      D_financial: { pass: true, note: "Catalogue quote; credit score refuse" },
      E_quality: { pass: true, note: "Reproducible scores" },
      F_ops: { pass: true, note: "Workspace" },
    },
    gaps: ["Bank credit remains unauthorised by policy"],
    next: "Wire sandbox checkout to price_grow_diagnostic_gmd_v1 after provider keys",
  },
  {
    applet: "academy",
    name: "FORTIS ACADEMY",
    maturity: "pilot",
    monetisationReady: true,
    realUserReady: true,
    gates: {
      A_commercial: { pass: true, note: "Learn free / signed credential" },
      B_data: { pass: true, note: "Program-scoped server banks" },
      C_security: { pass: true, note: "Session grading; no client keys" },
      D_financial: { pass: true, note: "No fake paid certs" },
      E_quality: { pass: true, note: "HMAC verify fail-closed" },
      F_ops: { pass: true, note: "Public verify" },
    },
    gaps: [],
    next: "Catalogue SKU for assessment attempts when provider is live",
  },
  {
    applet: "discover",
    name: "DISCOVER GAMBIA",
    maturity: "preview",
    monetisationReady: false,
    realUserReady: true,
    gates: {
      A_commercial: { pass: true, note: "Free discovery" },
      B_data: { pass: true, note: "Verified listings only" },
      C_security: { pass: true, note: "Drafts hidden" },
      D_financial: { pass: true, note: "Ticket reserve refuses without KYB+provider" },
      E_quality: { pass: true, note: "Transition tests" },
      F_ops: { pass: true, note: "Rota slot" },
    },
    gaps: ["External organiser KYB + payment provider for ticket sales"],
    next: "Do not advertise booking until reserve() returns ok",
  },
  {
    applet: "govern",
    name: "FORTIS GOVERN",
    maturity: "preview",
    realUserReady: true,
    monetisationReady: false,
    gates: {
      A_commercial: { pass: true, note: "Consenting intake" },
      B_data: { pass: true, note: "Complaints + citation engine" },
      C_security: { pass: true, note: "Dual-control court orders; evidence scan fail-closed" },
      D_financial: { pass: true, note: "No money" },
      E_quality: { pass: true, note: "No auto-judgment" },
      F_ops: { pass: true, note: "Pilot duty rota recorded" },
    },
    gaps: ["External malware scanner product; institutional contract"],
    next: "Set FORTIS_MALWARE_SCANNER only when a real scanner exists",
  },
  {
    applet: "partner",
    name: "FORTIS PARTNER",
    maturity: "internal",
    monetisationReady: false,
    realUserReady: false,
    gates: {
      A_commercial: { pass: false, note: "No contracted merchant cohort" },
      B_data: { pass: true, note: "Demo catalogue unpublished" },
      C_security: { pass: true, note: "Writes auth + KYB machine" },
      D_financial: { pass: true, note: "Checkout production-blocked" },
      E_quality: { pass: true, note: "Empty public inventory is honest" },
      F_ops: { pass: false, note: "Trust & safety staff external" },
    },
    gaps: ["External licensed marketplace provider + KYB reviewers"],
    next: "Keep commerce closed; KYB must be APPROVED before any SKU",
  },
];

export function scorecardFor(applet: AppletId): AppletScorecard {
  const row = APPLET_SCORECARDS.find((s) => s.applet === applet);
  if (!row) throw new Error("unknown_applet");
  return row;
}

export function monetisationIntegrationSurface() {
  return {
    checkout: "POST /api/v2/billing/quote",
    priceAuthority: "server catalogue only",
    webhook: "POST /api/v2/payments/webhook",
    liveFlag: "module.core.payments.live",
    liveEnabled: false,
  };
}

export function remainingExternalGaps(): string[] {
  return APPLET_SCORECARDS.flatMap((s) => s.gaps);
}
