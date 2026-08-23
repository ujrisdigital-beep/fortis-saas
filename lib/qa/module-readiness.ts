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
      A_commercial: { pass: true, note: "Shared control plane; not a customer SKU" },
      B_data: { pass: true, note: "Memberships, catalogue, ledger, provenance schema migrated" },
      C_security: { pass: true, note: "Policy helper, fail-closed modules, register hardening" },
      D_financial: { pass: true, note: "Sandbox adapter + ledger; live flag off" },
      E_quality: { pass: true, note: "Automated policy/ledger/onboarding tests" },
      F_ops: { pass: true, note: "Status, runbooks, feature flags" },
    },
    gaps: ["Prisma engine download still blocked in this sandbox", "GitHub workflow file needs admin copy"],
    next: "Keep live payments off until PAYMENT_LIVE_DECISION is signed",
  },
  {
    applet: "grow",
    name: "FORTIS GROW",
    maturity: "pilot",
    monetisationReady: true,
    realUserReady: true,
    gates: {
      A_commercial: { pass: true, note: "Preview free / full export entitled" },
      B_data: { pass: true, note: "Versioned diagnostic + cited snapshots" },
      C_security: { pass: true, note: "Membership-gated assessments" },
      D_financial: { pass: true, note: "Catalogue price ID; no browser amount" },
      E_quality: { pass: true, note: "Reproducible scores and export gate tests" },
      F_ops: { pass: true, note: "Workspace + status" },
    },
    gaps: ["Bank credit use remains unauthorised", "Grant scores are editorial"],
    next: "Attach sandbox checkout to price_grow_diagnostic_gmd_v1",
  },
  {
    applet: "academy",
    name: "FORTIS ACADEMY",
    maturity: "pilot",
    monetisationReady: true,
    realUserReady: true,
    gates: {
      A_commercial: { pass: true, note: "Free learn / paid signed credential path" },
      B_data: { pass: true, note: "Programs, enrollments, signed credentials" },
      C_security: { pass: true, note: "Session-bound progress; issuer is admin-only" },
      D_financial: { pass: true, note: "Credential issuance not simulated as paid" },
      E_quality: { pass: true, note: "HMAC verify; hash-only checks fail closed" },
      F_ops: { pass: true, note: "Public verify endpoint" },
    },
    gaps: ["Question banks must be server-owned", "No blockchain claim"],
    next: "Sell assessment attempt via catalogue after provider onboarding",
  },
  {
    applet: "discover",
    name: "DISCOVER GAMBIA",
    maturity: "preview",
    monetisationReady: false,
    realUserReady: true,
    gates: {
      A_commercial: { pass: true, note: "Free discovery; ticketing later" },
      B_data: { pass: true, note: "Verified-only listing state machine" },
      C_security: { pass: true, note: "Draft listings not public" },
      D_financial: { pass: false, note: "No ticket checkout until organiser KYB + provider" },
      E_quality: { pass: true, note: "Listing transition tests" },
      F_ops: { pass: true, note: "Correction via listing status" },
    },
    gaps: ["No real ticket inventory", "Directory records still mixed maturity"],
    next: "Release B ticketing after provider + organiser KYB",
  },
  {
    applet: "govern",
    name: "FORTIS GOVERN",
    maturity: "preview",
    realUserReady: true,
    monetisationReady: false,
    gates: {
      A_commercial: { pass: true, note: "Public intake; institutional licence later" },
      B_data: { pass: true, note: "Complaint entity + citation-first legal engine" },
      C_security: { pass: true, note: "Consent required; compliance logs protected" },
      D_financial: { pass: true, note: "No money movement" },
      E_quality: { pass: true, note: "No auto-determination" },
      F_ops: { pass: false, note: "Staffed case rota not in this repo" },
    },
    gaps: ["Evidence malware scan not live", "Court-order dual control not complete"],
    next: "Institutional pilot contract before Production label",
  },
  {
    applet: "partner",
    name: "FORTIS PARTNER",
    maturity: "internal",
    monetisationReady: false,
    realUserReady: false,
    gates: {
      A_commercial: { pass: false, note: "Pilot cohort not contracted" },
      B_data: { pass: false, note: "Product catalogue still demo memory store" },
      C_security: { pass: false, note: "Writes historically unauthenticated" },
      D_financial: { pass: false, note: "Checkout simulated; production-blocked" },
      E_quality: { pass: false, note: "Mock GMV metrics" },
      F_ops: { pass: false, note: "Trust & safety staffing absent" },
    },
    gaps: [
      "No licensed marketplace provider",
      "No KYB",
      "Demo products must not appear as live inventory",
    ],
    next: "Keep fail-closed until provider + KYB + persistent catalogue",
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
