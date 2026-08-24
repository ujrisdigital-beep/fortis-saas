# Review-mining + gap closer — FORTIS-SBN (Gambia SME / skills / trusted local commerce)

**Target sector:** Digital operating tools for Gambian SMEs, youth skills, and trusted local services (not global generic SaaS).

**Date:** 24 August 2026. Reviews below are from public Trustpilot / product-category patterns plus FORTIS’s own fail-closed audit — not invented 5-star quotes for FORTIS.

## Step 1 — Competitor review mining

| Product | Role |
|---|---|
| Jumia (regional marketplace) | E-commerce + delivery |
| Jiji / Facebook Marketplace | Classifieds, equipment, gigs |
| Wave / QMoney / Afrimoney | Payments people actually use |
| Google Digital Garage / Skillshop | Free digital marketing courses |
| GTTI / NAQAA TVET + WhatsApp groups | How work is actually found |

### What users praise

- Mobile-money speed and familiarity (Wave).
- Classifieds reach (Facebook / Jiji) — someone answers the same day.
- Jumia: when delivery actually arrives, catalogue breadth.
- Garage: free, structured marketing modules and a known brand badge.
- TVET: hands-on trades when you can physically attend.

### What users hate (recurring)

- Jumia Trustpilot: **marked delivered / never received**, OTP after the fact, wrong item, refunds that stall. [1](https://www.trustpilot.com/review/jumia.com)
- Classifieds: fake listings, no KYB, no receipt, dispute = shouting.
- Global LMS: not Gambia-priced, not Wolof/phone-first, certs that employers cannot verify locally.
- TVET: urban, fee-barred, curricula lag employers (ILO / employer survey).
- “Escrow” apps that are not licensed custody.

## Step 2 — Pain gap

**One gap:** *A Gambia-priced, verifiable path from skill → paid proof → introduction to a real counterparty, without fake inventory or fake bookings.*

Competitors either (a) sell goods with weak last-mile trust, (b) sell global certificates nobody locally checks, or (c) run WhatsApp chaos with no HMAC, no catalogue price, no consent record.

They ignore it because last-mile KYB + GMD transfer + honest empty shelves do not look like a Series-A marketplace screenshot.

**Emotional / economic cost:** youth pay for “courses” and “bookings” that never happened; SMEs hire from rumours; FORTIS previously *reproduced the same lie* (fake professionals, fake excavators, `setBookSent(true)`).

## Step 3 — Gap closer (already the SBN sequence)

1. **Name:** FORTIS ACADEMY + PARTNER desk — *Learn free. Prove with a signed paper. Enquire — do not fake-book.*
2. **Format:** Next.js outlines + server banks + transfer SKU + empty live inventory + consented enquiry API.
3. **Architecture:** programmes.ts, HMAC credentials, `POST /api/v2/services/enquiries`, Partner KYB, fail-closed checkout.
4. **Pitch:** Competitors show 23 excavators and 17 “verified” lawyers. We show **zero** until KYB. You still get a dated enquiry id.
5. **Sample deliverable:** enquiry response `{ booked: false, status: "RECEIVED" }` and Academy construction-literacy paper.

This blueprint is **implemented as preview**, not a live marketplace.
