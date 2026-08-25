# FORTIS-SBN — product pack + five operational systems

**MVP in production-pilot:** Core, GROW preview + transfer, Academy vocational, empty Partner, free Ombudsman desk.  
**Not MVP:** live PSP commerce, USSD, official National Assembly filing, multilingual UI.

## PRD (one page)

| Item | Spec |
|---|---|
| Users | Gambian SMEs, learners, citizens, Ombudsman officers (future login) |
| Jobs | Diagnose, learn, enquire, lodge public-authority complaints |
| Non-goals | Fake escrow, fake CBG FX, self-serve CEO, AI judgments |
| Success | Honest empty shelves; OMB- refs; GROW transfer |

## TRD

Next 14, NextAuth, Prisma, fail-closed flags, HMAC Academy, transfer FTS-, OMB-/DIS- complaints, optional Gemini.

## User flow (Ombudsman)

Citizen → exclusions → form (identity or whistleblower) → machine screen → RECEIVED → officer TRIAGED/CLOSED.

## Design system

Gambia green `#1B4D3E`, gold `#D4AF37`, DM Sans, plain language, mobile first.

## Schema (logical)

Complaint: reference, channel, category, consent, screen flags, contact?, whistleblower, status.

## Monetisation

Citizen Ombudsman = **$0**. Institutional hosting contracted. GROW/Academy/Rides transfer SKUs. No $19 Pro claim until catalogue says so.

## Launch / UA / growth

`/demo` → `/ombudsman` and `/grow/workspace`. No fake enrolments. Lead magnet: free GROW preview + free complaint desk.

---

## Five systems

1. **Process:** MSOMP + this pack + `docs/COMMERCE_READINESS.md`.  
2. **RACI:** CTO accountable; platform on-call responsible; legal consulted; Ombudsman office informed.  
3. **Tracking:** audit events, complaint status, `/api/v2/status`.  
4. **Comms:** daily status GET; weekly audit; no Slack product yet.  
5. **UJRIS learning:** `lib/ujris/task-memory.ts` — counts human-used categories so the next pre-screen is better. Not a neural net.

---

## Five-person AI department (outcomes, this project)

**Researcher — pain that already exists**

| Pain | Exact language | Where they try | Existing fix |
|---|---|---|---|
| Fake delivery / escrow | “marked delivered, never received” | Jumia Trustpilot | WhatsApp groups |
| Can’t get a public office to answer | “applied months ago, no reply” | Radio, family, paper letter | Walk-in ministries |
| Skills but no proof | “certificate nobody checks” | Facebook courses | GTTI / Garage |
| Fake listings | “the excavator wasn’t real” | Jiji / FB | Cash on sight |
| Card rails don’t fit GMD life | “just send Wave” | Mobile money | Wave/QMoney |

**Strategist — lead magnets (fast → convert)**

1. Free Ombudsman intake + reference (live).  
2. Free GROW preview JSON.  
3. One-page “how to write a maladministration complaint”.  
4. Transfer receipt explainer.  
5. Academy digital-literacy outline.

**Copywriter — hook + bullets + CTA**

Hook: *Lodge a public complaint for free. A human officer reads it. The computer does not decide.*  
Bullets: Free · Human admissibility · Advisory, not a court order.  
CTA: Lodge on `/ombudsman`.

**Builder — one pager:** `/ombudsman` (this ship).  
**Marketer:** channels = WhatsApp status + radio talking points + `/demo`; cadence weekly; metric = OMB- refs with consent, not vanity traffic.
