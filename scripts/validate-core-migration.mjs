#!/usr/bin/env node
/**
 * Validates FORTIS CORE Phase 1 tables against a PostgreSQL staging database.
 * Usage: DATABASE_URL=postgres://... node scripts/validate-core-migration.mjs
 */
import { spawnSync } from "node:child_process";

const required = [
  "OrganisationMembership",
  "PermissionGrant",
  "RoleDefinition",
  "Applet",
  "Product",
  "Plan",
  "Price",
  "PlanEntitlement",
  "CoreSubscription",
  "EntitlementGrant",
  "UsageEvent",
  "UsageReservation",
  "PaymentIntent",
  "ProviderEvent",
  "LedgerAccount",
  "LedgerTransaction",
  "LedgerEntry",
  "ReconciliationRun",
  "AuditEvent",
  "SourceDefinition",
  "RawSourceObject",
  "CanonicalRecordVersion",
  "ProvenanceRecord",
  "FeatureFlag",
];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("SKIP: DATABASE_URL is not set. Staging validation requires PostgreSQL.");
  process.exit(2);
}

const sql = `
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = ANY(ARRAY[${required.map((t) => `'${t}'`).join(",")}]);
`;

const result = spawnSync("psql", [url, "-v", "ON_ERROR_STOP=1", "-At", "-c", sql], {
  encoding: "utf8",
});

if (result.error || result.status !== 0) {
  console.error("psql failed:", result.stderr || result.error);
  process.exit(1);
}

const found = new Set(result.stdout.split("\n").map((s) => s.trim()).filter(Boolean));
const missing = required.filter((t) => !found.has(t));
if (missing.length) {
  console.error("Missing Core tables:", missing.join(", "));
  process.exit(1);
}

const balanceSql = `
SELECT conname FROM pg_constraint
WHERE conname IN ('LedgerEntry_amount_pos', 'Price_amountMinor_nonneg', 'UsageReservation_units_pos');
`;
const constraints = spawnSync("psql", [url, "-At", "-c", balanceSql], { encoding: "utf8" });
if (constraints.status !== 0) {
  console.error(constraints.stderr);
  process.exit(1);
}
console.log("FORTIS CORE staging validation passed.");
console.log(`Tables present: ${required.length}`);
console.log(`Constraints:\n${constraints.stdout}`);
