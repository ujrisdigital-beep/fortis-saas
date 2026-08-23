# FORTIS-SBN Phase 1 progress

Updated: 23 August 2026

## Exit status

Epics 1–4 and 6–8 are implemented for the Core/GROW pilot with automated tests. Epic 5 sandbox path is implemented; **live money remains explicitly blocked** until `docs/phase-0/PAYMENT_LIVE_DECISION.md` is signed.

## Epic 1 — Build and security baseline

- Quality workflow activated at `.github/workflows/quality.yml` (Prisma generate, migrate deploy on Postgres 16, typecheck, lint, test, build, production audit, secret scan).
- Transitional ESLint baseline retained; Core modules are typed.
- Next 14 / Prisma high audit findings: formal risk acceptance in `docs/phase-0/DEPENDENCY_RISK_ACCEPTANCE.md` with compensating controls. Audit remains a CI blocker until a dated deploy exception.

## Epic 2 — Tenant identity and authorization

- Memberships persisted via Prisma (`loadActiveMemberships` fail-closed).
- `requireApiAccess` applied to admin, billing (`/api/subscriptions` POST), marketplace checkout/dashboard, training progress/certificates, and GOVERN compliance logs.
- Session tenant is trusted; query `userId` spoofing removed from training progress.
- OpenAI admin stats no longer accept an email query bypass.

## Epic 3–5

Unchanged from prior delivery: catalogue, entitlements, metering, sandbox adapter, signed webhooks, ledger, reconciliation. Live payments flag default `false`.

## Epic 6 — Live data exchange

- Entities + migration `20260823140000_fortis_core_live_data`.
- Adapters: GBoS, CBG FX, World Bank WDI with checksums and provenance.
- Freshness never masquerades STALE/UNAVAILABLE as current.
- `DataTrustMark` component and `GET /api/v2/sources/[sourceKey]`.

## Epic 7 — Free/local AI vertical slice

- Internal adapter contract; deterministic retrieval-first GROW report.
- Unavailable inference falls back to sourced deterministic text, never fabricated output.
- `/api/uju-cycle` and `/api/v2/grow/report` use the deterministic engine.

## Epic 8 — Operations

- `/api/v2/status` dependency health and SLOs.
- Runbooks: incident, payments, backups, module launch.
- Feature flags in `lib/core/feature-flags.ts`.
- Accessibility / low-bandwidth checks on the launch checklist.

## Staging validation

```
DATABASE_URL=postgres://… npx prisma migrate deploy
DATABASE_URL=postgres://… npm run db:validate-core
```

This sandbox has no PostgreSQL; CI service container is the staging proof path.
