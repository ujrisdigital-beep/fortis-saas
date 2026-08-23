# Applet end-to-end QA — 23 August 2026

Machine-readable copy: `GET /api/v2/qa/modules`.

| Applet | Maturity | Real users | Monetisation integration | Headline gap |
|---|---|---|---|---|
| CORE | pilot | yes | yes (sandbox) | Live flag off |
| GROW | pilot | yes | yes (price ID quote) | Not for bank credit |
| ACADEMY | pilot | yes | yes (credential SKU later) | Server question bank only |
| DISCOVER | preview | yes (read) | no tickets | No organiser KYB |
| GOVERN | preview | yes (intake) | no | No staffed case rota |
| PARTNER | internal | **no** | **no** | Demo catalogue / no provider |

## Fixes executed in this pass

- Assessments no longer accept client-supplied answer keys.
- Auto-enrol uses the session user, not a body email.
- ASK UJRIS is authenticated and deterministic.
- Marketplace product **creates** return 503 and are production-blocked.
- Billing quote API: `POST /api/v2/billing/quote` with catalogue `priceId` only.

## Monetisation integration contract

1. Client sends `priceId`.
2. Server returns `amountMinor` + `currency`.
3. Provider intent created only when `module.core.payments.live` is true **and** the decision record is signed.
4. Webhooks post the ledger once.

## Not Production (do not sell as live)

PARTNER GMV, car-hire escrow, ticket sales, court-order PII, blockchain certificates.
