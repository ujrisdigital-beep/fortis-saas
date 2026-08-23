# FORTIS-SBN Phase 1 progress

Updated: 23 August 2026

## Scope executed

Work continues the Phase 0 artefacts in `docs/phase-0/` and the sequenced backlog in `docs/phase-0/PHASE_1_BACKLOG.md`.

### Epic 2 — Tenant identity and authorization

- Added `OrganisationMembership`, `RoleDefinition`, `PermissionGrant`, `ConsentRecord`, `SessionRevocation`, and `AuditEvent` to Prisma and SQL migration `20260823120000_fortis_core_phase1`.
- Policy helper in `lib/core/policy.ts` uses membership + catalogue (`lib/core/permissions.ts`), never global `User.role` for tenant resources.
- Cross-tenant and unprivileged admin/billing access fail in `tests/core/phase1-core.test.ts` and emit `audit.sensitive_access`.
- Email verification, session revocation and step-up gates are enforced in the policy helper.

### Epic 3 — Catalogue and entitlements

- Versioned applet/product/plan/price/entitlement schema plus subscriptions, seats, one-off purchases and grants.
- Server-owned GROW price `price_grow_diagnostic_gmd_v1` (GMD 25000) in `lib/core/catalogue.ts`.
- Checkout quote (`lib/core/grow-checkout.ts`) and `GET /api/v2/catalogue/prices/[priceId]` resolve amount/currency from the catalogue only.
- Entitlement grant requires verified subscription or one-off purchase; `POST /api/v2/entitlements/check` is deny-by-default without an active membership.

### Epic 4 — Usage metering

- Append-only `UsageEvent` / `UsageReservation` / aggregates / limits.
- In-memory reservation engine prevents concurrent over-consumption, is idempotent, records consume/fail, and reverses via compensating events.

### Epic 5 — Payment sandbox and ledger (interfaces only)

- Provider adapter contract + `SandboxPaymentAdapter` (`fortis_sandbox` mode).
- HMAC-SHA256 signed webhook inbox with replay/duplicate protection.
- `POST /api/v2/payments/webhook` posts a balanced capture once per provider event id.
- Double-entry posting with reverse-not-edit; reconciliation compares provider statement lines to ledger facts.
- No live credentials, capture, or public escrow claim.

## PostgreSQL staging validation

Migration: `prisma/migrations/20260823120000_fortis_core_phase1/migration.sql`

```
DATABASE_URL=postgres://… npm run db:validate-core
```

The script exits `2` if `DATABASE_URL` is unset (this sandbox has no PostgreSQL). CI/staging must apply `prisma migrate deploy` then run the validator. Expected: all Core tables present and check constraints `LedgerEntry_amount_pos`, `Price_amountMinor_nonneg`, `UsageReservation_units_pos`.

## Remaining Phase 1 (not claimed complete)

- Epic 1: Prisma engine download / full production build in this sandbox; Next 14 high audit findings still need a tested major upgrade or formal risk acceptance.
- Persist policy memberships from the database in every legacy route (matrix still a target).
- Epics 6–8: live data adapters, free/local AI slice, ops/runbooks.
- Epic 5 live money remains blocked pending provider/legal/finance sign-off.

## Tests

`tests/core/phase1-core.test.ts` covers membership/policy, catalogue/entitlements, metering concurrency/idempotency, signed webhooks, ledger invariants and reconciliation.
