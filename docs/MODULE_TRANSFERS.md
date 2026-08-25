# Transfer pay on every monetised module

While SBN-COMCACHE is pending, **every paid unlock** uses the same bank/wallet transfer + evidence flow.

| Module | Unlock after evidence |
|---|---|
| Rides | Provisional trip (`/rides`) |
| GROW | Full blueprint (`/grow/workspace` + `/pay/transfer`) |
| Academy | Paid assessment / certificate eligibility |
| Marketplace | Fulfilment flag (`GET /api/v2/marketplace/orders`) |
| Core catalogue | Generic grant via `/pay/transfer` |

Legacy `/services/car-hire` and `/api/marketplace/checkout` remain fail-closed. Use v2 routes.
