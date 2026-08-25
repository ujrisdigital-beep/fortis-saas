# Public commerce — path to real user testing

**Status:** NEEDS MORE WORK for public GMV. Sandbox + transfer remain the only pay rails.

## What is ready in code

- Empty public inventory (`GET /api/marketplace/products`).
- Checkout **503**.
- KYB state machine + store: `POST /api/v2/commerce/kyb/submit`.
- Staff queue: `GET/POST /api/v2/commerce/kyb/queue` — **503 until** `FORTIS_KYB_REVIEWERS` lists real user ids.
- Gate board: `GET /api/v2/commerce/readiness`.
- Sandbox intent: `POST /api/v2/commerce/sandbox-intent` (not a card charge).
- Transfer SKUs: GROW / Academy / Rides.

## What staff / SBN must still provide

1. Licensed PSP name in `FORTIS_LICENSED_PSP` and a signed adapter (not sandbox).
2. KYB reviewers: `FORTIS_KYB_REVIEWERS=userId1,userId2`.
3. Legal/finance/security on `PAYMENT_LIVE_DECISION.md` then `FORTIS_PAYMENT_LIVE_SIGNED=true`.
4. Flip `module.core.payments.live` and `module.partner.commerce` **only after 1–3**.

## Real-user test protocol (sandbox)

1. Create org owner account.
2. Submit KYB.
3. Reviewer on the allow-list approves or rejects.
4. Confirm marketplace GET still empty.
5. Pay GROW via `/pay/transfer` (not checkout).
6. Record issues in `#ops`.

Do not invite the public to “buy Gambia” until readiness JSON shows `publicCommerceReady: true`.
