# Mock, simulation and false-live audit

## Policy

Production must never return a successful payment, subscription, order, payout, publication, evidence extraction, credential, live statistic or provider lookup unless a real authoritative system confirms it.

Educational scenario exercises may remain only when clearly presented as fictional coursework; they must not create financial, employment, legal or official records.

## Routes now blocked in production

The deny policy is implemented in `lib/production-readiness.ts` and enforced by `middleware.ts` unless the explicitly dangerous override `FORTIS_ALLOW_NON_PRODUCTION_MODULES=true` is set.

### Simulated financial behaviour

- `POST /api/verify-payment` — accepts references without provider verification
- `POST /api/subscriptions` — marks subscriptions active without payment
- `POST /api/marketplace/checkout` — constructs a non-persistent “escrow” order from browser-supplied prices
- `/api/marketplace/currency-rates` — simulated price movement
- `/api/marketplace/currency-exchange` — demo bureaux, rates and transaction references
- `POST /api/seller/deposit` — generates an unpersisted deposit without provider confirmation
- financial writes under `/api/car-hire/*` — no licensed provider/reconciled funds flow
- marketplace delivery, location and dispute resolution writes — not linked to a production payment/provider workflow

### Placeholder/generated success

- `POST /api/evidence/process`
- `POST /api/documents/draft`
- `POST /api/presentation/generate`
- `POST /api/audio/summarize`
- `POST /api/audio/summary`
- `POST /api/translate`
- `POST /api/training/generate-course`
- `POST /api/ikenga/generate-logo`

### False-live or unvalidated data

- `/api/ikenga/deep-search`
- `/api/admin/content-fetch`
- `/api/v2/credit-score`

### Mock-backed pages

- `/employers/dashboard`
- `/owner/escrow-dashboard`
- `/admin/training-hub`
- `/admin/super`
- `/admin/escalations`

## Additional source findings to resolve

Repository scanning found mock/placeholder indicators in approximately 130 source lines. High-priority examples include:

- mock audio states in UJU and Ikenga interfaces;
- placeholder video generation;
- simulated file processing in `MediaUpload`;
- live marketplace counter simulation;
- hard-coded employer roles and candidate matches;
- simulated admin/master metrics;
- static testimonials making operational and blockchain claims;
- static admin diagnostics represented as service status;
- demo owner IDs and seed administrator credentials.

The generated registry marks files containing indicators as `rebuild-or-integrate` for owner review.

## Remediation rule

Each blocked item can be removed from the deny policy only when:

1. its real provider/data/domain implementation exists;
2. authentication, authorization and tenancy checks exist;
3. request and response schemas are validated;
4. integration and failure-path tests pass;
5. telemetry and runbook exist;
6. the module launch checklist links evidence;
7. product, security and—where relevant—finance/legal owners approve it.

## Production configuration

The override must remain unset or `false` in production. CI should reject deployments that set it to `true`. A later Phase 1 allow-listed module gateway will replace the temporary deny-list so new routes fail closed by default.
