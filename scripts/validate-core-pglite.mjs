#!/usr/bin/env node
/**
 * Apply Prisma SQL migrations to an in-process Postgres (PGlite)
 * and assert FORTIS CORE tables + check constraints exist.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

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

const migrationsDir = join(process.cwd(), "prisma/migrations");
const dirs = readdirSync(migrationsDir)
  .filter((name) => /^\d+_/.test(name))
  .sort();

const db = new PGlite();

for (const dir of dirs) {
  const sql = readFileSync(join(migrationsDir, dir, "migration.sql"), "utf8");
  process.stdout.write(`Applying ${dir}… `);
  await db.exec(sql);
  console.log("ok");
}

const listed = await db.query(
  `SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public' AND table_name = ANY($1)`,
  [required],
);
const found = new Set(listed.rows.map((r) => r.table_name));
const missing = required.filter((t) => !found.has(t));
if (missing.length) {
  console.error("Missing Core tables:", missing.join(", "));
  process.exit(1);
}

const constraints = await db.query(
  `SELECT conname FROM pg_constraint
   WHERE conname = ANY($1)`,
  [["LedgerEntry_amount_pos", "Price_amountMinor_nonneg", "UsageReservation_units_pos"]],
);
if (constraints.rows.length !== 3) {
  console.error("Missing money/usage check constraints:", constraints.rows);
  process.exit(1);
}

const unbalanced = await db.query(
  `SELECT 1 FROM pg_constraint WHERE conname = 'LedgerEntry_amount_pos'`,
);
if (!unbalanced.rows.length) {
  process.exit(1);
}

console.log(`FORTIS CORE PGlite validation passed (${required.length} tables, 3 check constraints).`);
await db.close();
