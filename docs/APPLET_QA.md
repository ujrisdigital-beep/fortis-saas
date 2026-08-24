# Applet QA — closed in code

`GET /api/v2/qa/modules`

| Applet | Users | Monetisation hook | Code gaps |
|---|---|---|---|
| CORE | pilot | sandbox quote/webhook | none (CDN/workflow/live sign-off external) |
| GROW | pilot | catalogue price ID | bank credit forbidden |
| ACADEMY | pilot | signed credential | none |
| DISCOVER | preview | tickets refuse without KYB+PSP | organiser KYB external |
| GOVERN | preview | none | malware product + institution contract external |
| PARTNER | preview | checkout blocked; enquiry desk only | licensed PSP + KYB reviewers; empty pro/equipment inventory |

## Closed this pass

- Court-order **dual control** (two distinct officers).
- Evidence **fail-closed** without a malware scanner (no mock extraction).
- Credit-score **refuses** to score.
- Marketplace **GET is empty** — demo SKUs are not live inventory.
- Merchant **KYB** state machine; listing only after APPROVED.
- Ticket **reserve** refuses without organiser KYB and provider.
- Academy **program banks**; public paper has no answer key.
- Pilot **on-call rota** recorded.

## External only

Licensed payment provider, GitHub `workflows` permission, Prisma engine CDN, live-money legal signatures, malware appliance, merchant/organiser KYB staff.
