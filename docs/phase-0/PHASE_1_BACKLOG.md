# Phase 1 backlog — FORTIS CORE foundation

Estimates are engineering ranges after Phase 0 discovery, not contractual delivery dates. Sequence is dependency-led.

## Epic 1 — Build and security baseline (1–2 weeks)

- Resolve all generated-client/typecheck/build failures under pinned Node 20.
- Triage and remediate production high/critical dependency findings.
- Replace deprecated lint stack deliberately.
- Add secret scan and CI production-override guard.
- Protect or remove every unauthorised admin/API route.

**Acceptance:** clean locked install, Prisma generation, typecheck, lint, tests, build and production audit in CI.

## Epic 2 — Tenant identity and authorization (2–3 weeks)

- Organisation membership schema and migration.
- Permission catalogue and policy helper.
- Email verification, session revocation and admin MFA/step-up.
- Apply policies to admin, billing, marketplace, training and GOVERN APIs.
- Add role/tenant matrix tests.

**Acceptance:** cross-tenant access and unprivileged admin access fail in automated tests and audit events are emitted.

## Epic 3 — Catalogue and entitlements (2 weeks)

- Applet/product/plan/price/entitlement schema.
- Admin-managed versioned catalogue.
- Entitlement check/reservation API.
- Replace hard-coded pricing in one GROW vertical slice.

**Acceptance:** browser submits a price ID; server resolves amount/currency and grants nothing without verified purchase/subscription state.

## Epic 4 — Usage metering (2 weeks)

- Append-only usage and reservation entities.
- GROW diagnostic/report units.
- Customer usage view and operator correction via reversing events.
- Limits, alerts and idempotency tests.

**Acceptance:** concurrent requests cannot exceed a hard allowance and every completed/failed operation is traceable.

## Epic 5 — Payment sandbox and ledger (3–5 weeks after provider selection)

- Provider adapter interface and selected sandbox adapter.
- Payment intent and signed event inbox.
- Double-entry posting and invariants.
- Refund and reconciliation flows.
- Customer receipt and operator exception queue.

**Acceptance:** duplicate/out-of-order webhooks do not double-post; provider statement and FORTIS ledger reconcile for test scenarios.

## Epic 6 — Live data exchange (2–4 weeks for first sources)

- Source/provenance entities and raw object store.
- GBoS/CBG/World Bank first approved adapters.
- Quality/freshness/conflict handling.
- FORTIS Data Trust Mark UI component.

**Acceptance:** every displayed indicator links to exact source/version and stale/failure states do not masquerade as current.

## Epic 7 — Free/local AI vertical slice (2–4 weeks)

- Internal model adapter contract.
- Deterministic/retrieval-first GROW report.
- Benchmark one local narrative model and embeddings.
- Source citation and evaluation harness.
- Queue/capacity/fallback behaviour.

**Acceptance:** GROW completes without a paid AI API; if inference is unavailable, users receive the deterministic sourced report, not fabricated output.

## Epic 8 — Operations and launch controls (2 weeks, parallel)

- error/log/trace/metric stack;
- status and dependency health;
- backups and restore test;
- incident and payment runbooks;
- module launch checklist and feature flags;
- low-bandwidth/accessibility baseline.

**Acceptance:** the first Core/GROW pilot has alerts, owner, runbook, rollback and measurable SLOs.

## Phase 1 exit decision

Proceed to the GROW production launch only when Epics 1–4, 6–8 pass and the paid journey has either a certified sandbox payment path or remains an explicitly non-payment pilot. Live money requires separate approval after Epic 5 evidence and provider/legal/finance sign-off.
