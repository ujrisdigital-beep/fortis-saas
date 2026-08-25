# Alternative counterparties if SBN will not sit

**For:** Cadjatu Djalo, on the ground in The Gambia  
**As of:** 25 August 2026  
**Status:** Shopping list only. No company below has a FORTIS contract. Do not tell anyone they have “agreed” until a signed SLA + CBG-permitted product scope exist.

If the SBN office will not receive the CEO, treat that as **counterparty risk**, not a platform outage. FORTIS already sells GROW / Academy / Rides on **bank or wallet transfer**. Public commerce stays closed until a **licensed** holder of customer funds is named.

## What we actually need (same SLA shape as SBN-COMCACHE)

Ask every shop the same six questions. If they cannot answer in writing, they are not a substitute.

1. **Licence.** CBG (or home regulator + CBG no-objection) for the product we will sell: retail collection, merchant acquiring, marketplace split / delayed payout, or only bill-pay.
2. **Who holds the money.** Named trustee / bank / MMO. FORTIS must not be the custodian.
3. **GMD rails.** Wave / QMoney / Afrimoney / bank transfer / GamSwitch. Sandbox + signed webhooks.
4. **Commission.** Can they split **8%** to FORTIS and the rest to the merchant on the same payment, or only settle FORTIS later?
5. **SLA numbers they will put in a contract.** Availability, payout hours, refund initiation hours, incident phone. Our *targets* (99.9%, sub-2s auth, 24h refund *initiation*) are **not** promises until they back them.
6. **Exit.** How we get statements, balances and customer records if they walk.

Score them with `docs/phase-0/PAYMENT_PROVIDER_SCORECARD.md`. Regulatory, webhooks, refunds and reconciliation are pass/fail.

## Walk order this week (Greater Banjul)

### A — CBG-listed mobile money (must visit)

Published on [cbg.gm/mobile-money](https://www.cbg.gm/mobile-money):

| Operator | Contact on CBG page | Why go |
|---|---|---|
| **QMoney Financial Services Ltd** (QCell) | Mustapha Kah · Kairaba Ave, Serrekunda · +220 3333313 · [qmoney.gm](http://qmoney.gm/) | Domestic GMD collection; merchant API if they have one |
| **Afrimobile Money / Afrimoney** (Africell) | Alieu Badara Mbye · 43 Kairaba Ave · +220 7400000 / 4376066 · [africell.gm](https://www.africell.gm/) | Same — largest operator-led wallet |

Ask for **business / merchant API + settlement account in FORTIS INVICTA LTD’s name**, not a personal CEO wallet.

**Wave Gambia** is widely used but is **not** on that two-row CBG table. Treat Wave as a **commercial conversation + counsel**, not as “already licensed for our marketplace model.”

### B — Banks on the national payment system

CBG participants include Trust Bank, GTBank Gambia, Ecobank Gambia, Access Bank Gambia, Zenith Bank Gambia, Standard Chartered Gambia, AGIB, FIB, FBN Gambia, BSIC, Mega Bank. Source: [cbg.gm/list-of-participants-in-the-payment-system](https://www.cbg.gm/list-of-participants-in-the-payment-system).

**First three doors for Cadja this week:**

1. **Trust Bank Ltd** — existing Gambia SME/mortgage language in our tools; merchant account + GamSwitch POS/online if offered.
2. **Ecobank Gambia** — regional group; useful if diaspora/ECOWAS settlement matters.
3. **GTBank Gambia** — merchant acquiring + later Nigeria corridor (do not claim it until they write it).

Ask each bank: *merchant acquiring for a software company that will later need marketplace delayed payout*. If they only do shop POS, they can still take **GROW GMD 250** transfers today.

### C — Local aggregator (verify licence in the room)

**Waychit** (Brufut; [waychit.com](https://waychit.com/); info@waychit.com) publicly claims Wave + QMoney + Afrimoney + cards + APS + Yonna in one API. That is the closest *product shape* to “one SLA, many rails.”

**Do not sign until they show:** CBG authorisation (or sponsor bank letter) for *merchant aggregation*, not only consumer bill-pay.

Other names to ask CBG’s payments desk to confirm on a register: **APS Wallet, Nafa, Yonna Wallet**. We do not have their licences in this repo.

### D — Regional PSPs (only if they will name Gambia)

| Firm | Honest status | Use |
|---|---|---|
| **Flutterwave** | Strong West Africa; Senegal/BCEAO presence reported. **Gambia is not automatic.** | Ask country coverage + who is merchant of record |
| **Paystack (Stripe)** | Core markets NG/GH/KE/ZA. Unlikely to be the Gambia merchant account. | Diaspora card checkout only if they confirm |
| **Hubtel / Zeepay (Ghana)** | Good for GH; not a Gambia licence | Only if they have a Gambia sponsor bank |
| **HandyPay and similar “Stripe for WhatsApp”** | Conflicts with our **no off-platform chat** rule | Do not use as the Partner rail |

### E — If SBN was also “hosting / 99.9% ops”, not just money

Payments SLA ≠ uptime SLA. For infrastructure, shop **QuantumNet** (Kairaba Ave / Serrekunda) and any ISO-minded host that will put restore tests in writing. FORTIS still must not sell 99.9% until we have measured SLOs (see `docs/SBN_PRODUCTION_PLAN.md` §13).

## One-page ask Cadja can leave on the desk

> FORTIS INVICTA LTD needs a **licensed** partner to collect GMD for catalogue SKUs (GROW GMD 250, Academy GMD 150, Rides) and, later, **split payout** for Partner hires (8% platform). We will **not** hold customer money. We need sandbox, signed webhooks, daily statements, and a written SLA. Transfer evidence is our rail until you go live. Contact: CEO Cadjatu Djalo (on the ground).

## What not to do this week

- Do not pause GROW transfer sales because SBN will not open the door.
- Do not flip `FORTIS_LICENSED_PSP` or `PAYMENT_LIVE_SIGNED` on a handshake.
- Do not promise merchants escrow.
- Do not send leads to the new partner’s WhatsApp.

When a name is chosen, put the legal name in `FORTIS_LICENSED_PSP`, attach the contract to `docs/phase-0/PAYMENT_LIVE_DECISION.md`, and only then ask engineering to wire the adapter.
