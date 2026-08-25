# Epic 5 sandbox certification

**Certified:** 23 August 2026  
**Mode:** `fortis_sandbox` only  
**Live money:** not authorised

## Evidence (automated)

`tests/core/phase1-core.test.ts` proves:

- idempotent payment intent creation;
- HMAC-SHA256 webhook signatures with skew rejection;
- duplicate provider event IDs do not double-post the ledger;
- balanced debit/credit posting and reverse-not-edit;
- provider statement vs ledger reconciliation for capture + refund.

## Pilot posture

FORTIS-SBN Phase 1 exit allows either a certified sandbox path **or** an explicit non-payment pilot. This branch is both: sandbox is certified for tests, and production live capture remains flag-off (`module.core.payments.live=false`).

Engineering cannot sign legal, finance or regulatory boxes. Those remain empty in `PAYMENT_LIVE_DECISION.md`.
