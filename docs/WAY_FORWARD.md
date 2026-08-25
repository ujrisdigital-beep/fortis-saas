# Way forward — authorised collector + real subscribers

**Date:** 25 August 2026 (Europe/London)  
**Goal:** An **authorised entity** partners with FORTIS INVICTA LTD so real users can subscribe and **someone licensed collects the money**.  
**Attached `table.csv`:** not readable in this workspace. Re-drop it if you want row-by-row mapping. This audit uses the live repo + CBG-public lists + Mall/Gambia.com-style marketplace SOP.

**Verdict:** Keep selling **GROW / Academy / Rides by transfer**. Do **not** open Mall-style multi-vendor checkout until a licensed collector is under contract. SBN going quiet is a **procurement problem**, not a product stop.

---

## 1. Complete platform check

| Surface | Real-user ready? | Money | Honest status |
|---|---|---|---|
| Accounts / email verify / PUBLIC role | Yes | — | Pilot |
| **GROW** diagnostic + GMD 250 catalogue | Yes | Transfer evidence only | Pilot — **lead SKU** |
| **Academy** learn + GMD 150 signed cert | Yes | Transfer | Pilot |
| **Rides** | Yes (owner-listed) | Transfer, not escrow | Pilot |
| **Discover** listings | Browse yes | Tickets **closed** | Preview |
| **Govern / Ombudsman** | Yes, free | No money | Preview |
| **Partner directory + KYB machine** | Apply yes | Commerce **closed** | Preview |
| Logistics / equipment / professionals | Enquiry + DSK- thread | Pay **503**; 4% SLA take not collectable | Preview |
| Marketplace inventory / checkout | Empty / 503 | Off | Correct |
| Credit score | 503 | — | Correct |
| Live cards / licensed escrow | Off | Off | Correct |

**Flags:** `module.core.payments.live` = false · `module.partner.commerce` = false · `FORTIS_LICENSED_PSP` unset · `PAYMENT_LIVE_SIGNED` false · `FORTIS_KYB_REVIEWERS` empty.

**What already works for “real users” without SBN:** register → GROW preview → pay GMD 250 by bank/Wave/QMoney/Afrimoney **to FORTIS INVICTA’s own account** → staff accept evidence → entitlement. That is **single-merchant collection**, not a marketplace.

**What is blocked on purpose:** taking money **for third-party merchants** (Mall model). That needs a licensed PSP/bank as merchant-of-record or marketplace acquirer. FORTIS must not hold other people’s money.

---

## 2. Mall Gambia / Gambia.com SOP — what to copy, what not to fake

Public Gambia marketplace pattern (Gambia.com / mDalasi-style + generic mall SOP):

| SOP step | What they do | FORTIS today | Copy? |
|---|---|---|---|
| 1. Seller apply | Form + shop details | Partner KYB submit | Yes — keep |
| 2. KYC/KYB | ID, business reg, TIN | Machine exists; **no staff reviewers** | Yes — hire/name reviewers |
| 3. Contract | Commission + prohibited goods | Terms §11 lead-containment | Yes — add collector exhibit |
| 4. List goods | Seller publishes SKUs | Public catalogue **empty** | Only after KYB **Approved** |
| 5. Buyer pays **on platform** | Wallet / card / agent cash-in | Transfer for FORTIS SKUs only | Yes for GROW; Mall-pay later |
| 6. Platform holds / splits | Wallet or PSP delayed payout | **Not licensed** — 503 | **Do not copy until collector signs** |
| 7. Delivery / complete | Buyer confirm | Not built for goods | Phase after money |
| 8. Commission | Auto deduct | 4% SLA (3% FORTIS + 1% integrator) | Wire into PSP split |
| 9. Off-platform ban | Weak on most local malls (WhatsApp) | We **redact** wa.me / +220 | Keep — this is our edge |
| 10. Disputes | Informal | DIS- desk vs Ombudsman OMB- | Keep dual channel |

**Do not imitate:** fake “available now” fleets, invented GMV, WhatsApp checkout, calling a hash a wallet, or claiming mDalasi/GamSwitch integration we do not have.

Mall Gambia wins on **local cash-in agents + one wallet**. FORTIS wins on **diagnostics, skills, government-grade honesty**. Partner with their *collector*, do not try to become CBG overnight.

---

## 3. Recommended partnership model

```
User / SME  →  FORTIS OS (onboard, SKU, thread, entitlement)
                    ↓  instruction to pay
Licensed collector (bank / CBG MMO / authorised aggregator)
                    ↓  settlement statement
FORTIS INVICTA LTD (GROW/Academy revenue)
Merchant (later)     (net of 4% SLA take)
```

**Entity A — money (mandatory).** One of: QMoney, Afrimoney, Trust Bank / Ecobank / GTBank merchant account, or Waychit **if** they show CBG/sponsor-bank paper. See `docs/SBN_ALTERNATIVE_SLA_SHOP.md`.

**Entity B — optional agents.** If you want Mall-like cash-in, the collector’s agent network — not FORTIS staff taking cash.

FORTIS INVICTA remains **software + KYB ops**. The partner is named on receipts: “payment processed by [LEGAL NAME]”.

---

## 4. Way forward (Cadja on the ground + product)

### Week 1 — do not wait for SBN

1. Open / confirm **FORTIS INVICTA LTD** accounts: Trust Bank **and** one of QMoney/Afrimoney business.  
2. Print pay-in details on `/pay/transfer` (already the rail).  
3. Name **two KYB reviewers** (`FORTIS_KYB_REVIEWERS`). Human, in Gambia if possible.  
4. Walk the six SLA questions at QMoney, Afrimoney, Trust Bank, Ecobank, Waychit.  
5. Leave the one-page ask in `SBN_ALTERNATIVE_SLA_SHOP.md` on each desk.

### Weeks 2–4 — first authorised collector

6. Sign a **single-merchant** acquiring/SLA first (GROW + Academy + Rides only). Easier licence than marketplace.  
7. Fill `docs/phase-0/PAYMENT_LIVE_DECISION.md` (legal, finance, security). Set `FORTIS_LICENSED_PSP` to their **legal name**.  
8. Engineering: webhook adapter + reconcile to transfer ledger. **Then** consider `payments.live` for those three SKUs only.  
9. Onboard **real subscribers:** 20–50 SMEs on GROW GMD 250. Measure conversion. No fake GMV.

### Days 30–90 — Mall-like commerce (only if collector can split)

10. Contract addendum: **split payout / delayed release** — 3% FORTIS INVICTA + 1% integrator.  
11. Approve **one** merchant category (start: equipment **or** inter-city courier — not 23 fake SKUs).  
12. Flip `module.partner.commerce` only when readiness JSON is all-green.  
13. Keep DSK- threads; never publish merchant WhatsApp.

### Parallel (does not need SBN)

- Ombudsman stays free.  
- Academy stays learn-free / pay-for-cert.  
- Discover stays browse-only.

---

## 5. Success metrics (honest)

| Metric | Target 90 days | How we know |
|---|---|---|
| Licensed collector named in env + contract | 1 | `FORTIS_LICENSED_PSP` ≠ empty |
| GROW paid unlocks (transfer or collector) | 20+ | Ledger, not a dashboard widget |
| KYB approved merchants | 0 until collector can split; then ≤5 | KYB store |
| Public marketplace GMV | **0** until step 12 | Checkout 503 |
| Off-platform leak flags | Tracked | `circumventionFlags` |

---

## 6. Decision for the board

| Option | Recommendation |
|---|---|
| Wait for SBN CEO | **No.** Parallel-shop. |
| FORTIS holds customer funds | **No.** Not licensed. |
| GROW subscribers now via transfer + bank/MMO | **Yes — this week.** |
| Full Mall clone | **After** collector can legally split. |
| WhatsApp to close deals | **No.** Kills commission. |

**Owner on the ground:** Cadjatu Djalo — bank/MMO meetings.  
**Owner on platform:** keep gates fail-closed until the signed name exists.
