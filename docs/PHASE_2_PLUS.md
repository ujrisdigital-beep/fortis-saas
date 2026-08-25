# Phases 2–7 production increment

**23 August 2026** — sequential, gated. Live money, KYC submissions and government endorsement remain off.

## Phase 2 — GROW (pilot)

- Versioned diagnostic `grow-uju-1.1.0` with model card (`bankUse: not_authorised`).
- Preview vs entitlement-gated full export.
- Workspace page `/grow/workspace`.
- Grant matcher labels scores as editorial hypotheses and keeps funder URLs + deadlines.
- Cited GBoS/CBG snapshots on assessments.

## Phase 3 — ACADEMY (pilot)

- HMAC-signed credentials (explicitly **not** blockchain).
- Issue: `POST /api/v2/academy/credentials` (admin + `FORTIS_CREDENTIAL_SECRET`).
- Verify: `GET /api/v2/academy/credentials/verify?serial=`.
- Legacy `/api/training/verify` **fail-closed** (no hash-only success).

## Phase 4 — DISCOVER (Release A domain)

- Listing state machine DRAFT → SUBMITTED → VERIFIED; only verified listings are public.

## Phase 7 start — GOVERN intake

- Consent-required complaint intake; no automated determination.
- `POST /api/v2/govern/complaints`.

## Module launch (24 August 2026)

Pilot/preview flags on: CORE, GROW, ACADEMY, DISCOVER listings, GOVERN intake, PARTNER directory, RIDES hire.

Still **off**: live card capture, Discover tickets, Partner commerce.

Transfer catalogue SKUs: GROW GMD 250, Academy GMD 150, Rides GMD 350.

## Still later (not claimed Production)

- Phase 5 marketplace / Phase 6 fleet: licensed provider + KYB.
- GOVERN full case platform, whistleblower, court-order dual control.
- Phase 8 contracted SLA after 60–90 days measured SLOs.
