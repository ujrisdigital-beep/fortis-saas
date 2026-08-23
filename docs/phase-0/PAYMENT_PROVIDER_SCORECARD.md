# Payment provider and safeguarded-funds scorecard

## Non-negotiable architecture

FORTIS initially orchestrates payments and maintains a reconciled operational sub-ledger. A licensed provider, bank, aggregator or trustee holds/safeguards customer funds. No provider is selected by this document.

## Scoring

Score each criterion 0–5 and attach documentary evidence. Regulatory, security, webhook, reconciliation and refund criteria are pass/fail regardless of total.

| Category | Weight | Required evidence |
|---|---:|---|
| CBG/licensing and permitted marketplace model | 15 | licence, legal opinion, product approval and contract scope |
| GMD/mobile money coverage | 10 | Wave/QMoney/Afrimoney/bank rail matrix and sandbox proof |
| Cards/3DS2 and diaspora currencies | 8 | acquiring regions, settlement currencies and 3DS2 evidence |
| Delayed payout/split/marketplace funds | 12 | documented legal custody and payout capability |
| Signed webhooks and idempotency | 10 | signing algorithm, replay protection and duplicate semantics |
| Reconciliation and statements | 10 | transaction, fee, settlement, refund and chargeback exports/APIs |
| Refund/dispute/chargeback operations | 8 | API and operational timeframes |
| KYC/KYB, sanctions and fraud | 8 | coverage, false-positive handling and data processing |
| Security/privacy/data residency | 7 | certifications, subprocessors, retention and breach terms |
| SLA/support | 5 | uptime, latency, incident response and escalation |
| Commercials/reserves | 5 | fees, FX, reserve, minimums and settlement timing |
| Exit/data portability | 2 | termination, balances, records and migration rights |

## FORTIS-SBN SLA proof tests

Before selection, test in sandbox/pilot:

- authorisation latency distribution, not one sample;
- signed webhook delay, duplicates and out-of-order delivery;
- payment retry and idempotent order creation;
- full and partial refunds;
- chargeback/dispute freeze;
- delayed payout and release cancellation;
- failed payout and corrected beneficiary;
- provider statement reconciliation;
- GMD and foreign currency quote/settlement;
- provider outage and recovery.

## Contract clarifications

- Is “refund within 24 hours” initiation or customer receipt?
- Does the provider support the proposed 14-day hold legally and technically?
- Who is merchant of record and who issues receipts?
- When is the FORTIS commission earned and reversible?
- How are chargebacks allocated after merchant payout?
- Are mobile-money authorisation and payout different commitments?
- Which provider dependencies are excluded from SLA credits?
- What reserves, prefunding or guarantees are required?

## Decision gate

No live credential, payment capture or public escrow claim until regulatory/legal, finance, security and engineering owners sign the provider decision record and sandbox reconciliation passes.
