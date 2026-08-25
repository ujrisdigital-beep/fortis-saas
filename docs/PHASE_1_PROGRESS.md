# FORTIS-SBN Phase 1 progress

Updated: 23 August 2026

## Exit status

Epics 1–4 and 6–8 are implemented. Epic 5 sandbox is certified. **Live money is closed for Phase 1 as a non-payment pilot** (see `PAYMENT_LIVE_DECISION.md`).

Phases 2–4/7 domain slices continue in `docs/PHASE_2_PLUS.md`.

## Previously blocked items

### PostgreSQL Core migration — **validated**

All three Prisma SQL migrations apply cleanly on PostgreSQL (PGlite, Postgres-compatible):

```
npm run db:validate-core-local
```

Result: 24 Core tables + check constraints `LedgerEntry_amount_pos`, `Price_amountMinor_nonneg`, `UsageReservation_units_pos`.

This sandbox cannot reach `binaries.prisma.sh` or Debian apt, so the Prisma *engine binary* and a system `postgres` package are still unavailable here. Schema correctness does not depend on those downloads. CI with network can still run `prisma generate` / `migrate deploy`.

### GitHub Actions workflow file — **cannot be committed by this token**

The GitHub App rejects creates/updates under `.github/workflows/` (`workflows` permission missing). The complete workflow lives at `docs/phase-0/quality-workflow.yml`. A repo admin must copy it to `.github/workflows/quality.yml`. That is a permission gate, not missing work.

### Live money — **closed without live capture**

Phase 1 exit text allows a certified sandbox **or** an explicit non-payment pilot. Both are now recorded. Forging legal/finance signatures is not done. `module.core.payments.live` stays `false`.
