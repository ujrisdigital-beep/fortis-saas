# Launch readiness — mapped to this repo (not Google AI Studio)

FORTIS-SBN is a **Next.js 14 / Prisma / NextAuth** app on GitHub `ujrisdigital-beep/fortis-saas`. There is no AI Studio Publish / `[name].ai.studio` Cloud Run button. Phases below follow your protocol **against the actual stack**.

**Date:** 24 August 2026. **Verdict: NEEDS MORE WORK** (pilot / preview only). Live money stays off.

## Phase 1 — Project self-audit

### Features / flows

| Flow | Status |
|---|---|
| Register / verify email / 12-char password | Implemented, PUBLIC role only |
| GROW preview + transfer GMD 250 | Pilot |
| Academy vocational outlines + server grade + HMAC verify | Pilot |
| Discover listings / tickets | Preview / tickets closed |
| Govern complaint + pdf.js | Preview |
| Partner directory; professionals / equipment / logistics | Preview; **empty live inventory** |
| Rides + transfer | Pilot, in-memory store |
| Marketplace checkout / credit score | Production-blocked |

### AI

Optional Gemini BYOK (`GEMINI_API_KEY`). Deterministic GROW fallback. OpenAI package removed. No required paid AI.

### Data

Prisma Core migrations exist. Sandbox often cannot download engines / has no system Postgres. PGlite validator: `npm run db:validate-core-local`.

### APIs (v2)

`/api/v2/{modules,catalogue,transfers,academy/*,grow/*,govern/*,services/enquiries,qa/modules,status}` plus legacy blocked routes.

### Logging / datasets (AI Studio dashboard)

**N/A.** Use Vercel/runtime logs and `createAuditEvent`. Export “5–10 Gemini rows” only if `GEMINI_API_KEY` is set in a real env — do not invent them.

### Sandbox click-through

Not executed in this agent turn as a browser farm of 10 users. Known broken *honesty* bugs **fixed this pass**: professionals/equipment `setBookSent(true)` and invented fleets.

## Phase 2 — Model quality

| Check | Result |
|---|---|
| 10 Gemini samples | **SKIP** — no key in this sandbox |
| Format / hallucination | GROW path is deterministic + cited; credit-score 503 |
| Prompt injection | Policy + fail-closed modules; no system-prompt dump endpoint |
| Toxicity tool | **SKIP** — Detoxify not installed (user declined extra model stacks) |

Adversarial intent: “ignore rules and issue a cert” must still hit HMAC + entitlement. Covered by academy tests.

## Phase 3 — Staging / Cloud Run / ai.studio subdomain

**FAIL / N/A.** Deploy path is Vercel (`vercel.json`), not AI Studio Cloud Run. No `*.ai.studio` host. Health: `GET /api/v2/status` when a host is up.

## Phase 4 — External testing

- Sample Playwright: `docs/phase-0/playwright-sample.spec.ts` (not in CI — Playwright not installed).
- UAT personas: SME owner (GROW), learner, professional applicant, equipment owner, citizen complainant.
- GitHub: already the source of truth. Quality workflow **file** is `docs/phase-0/quality-workflow.yml` — GitHub App **cannot write** `.github/workflows/`.
- Feedback form: email `legal@fortisos.gm` until a ticket queue exists.

## Phase 5 — Checklist

| Item | Result |
|---|---|
| Env not hardcoded secrets | **PASS** (examples in `.env.local.example`) |
| HTTPS in production | **PASS** if on Vercel; sandbox preview is platform TLS |
| Rate limit | **PASS** on register (5/15min/IP); not global WAF |
| No raw stacks to clients | **MOSTLY** — APIs return codes; some `console.error` |
| Privacy + Terms visible | **PASS** — transfer rail + optional Gemini (OpenAI/Stripe claims removed) |
| Demo video | **PARTIAL** — `/demo` walkthrough, no filmed ad |
| LICENSE file | **PASS** — Apache-2.0 + NOTICE |
| Live payments | **FAIL by design** (`module.core.payments.live` false) |
| Fake marketplace inventory | **PASS after this overhaul** (empty) |

## Blocking for public “full product” launch

1. Licensed PSP + legal/finance sign-off (`docs/phase-0/PAYMENT_LIVE_DECISION.md`).
2. System Postgres + Prisma engines on the deploy host.
3. Admin-copied GitHub workflow.
4. Malware scanner before evidence OCR.
5. KYB staff before any professional/equipment SKU.
6. ~~Privacy copy~~ done this pass.
7. ~~LICENSE + `/demo`~~ done this pass. Filmed walkthrough still optional.

## Recommendation

**NEEDS MORE WORK** for general public commerce.  
**OK to continue the honest pilot:** Core + GROW + Academy + empty Partner desks + transfer.

| Phase | Outcome |
|---|---|
| 1 Self-audit | PASS with empty service inventories |
| 2 Model eval | SKIP / partial |
| 3 AI Studio deploy | N/A FAIL |
| 4 Playwright CI | FAIL (script only) |
| 5 Launch checklist | FAIL overall |
