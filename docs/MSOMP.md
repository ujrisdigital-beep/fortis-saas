# Master Systems Operations & Maintenance Protocol (MSOMP)

**System:** FORTIS OS / FORTIS-SBN  
**Document status:** Binding for the honest **pilot**. Public **commerce remains NEEDS MORE WORK**.  
**Effective:** 24 August 2026  
**Primary environment names:** `local` · `preview` (Arena/Vercel) · `staging` `[STAGING_URL]` · `production` `[https://fortisos.cloud]`  
**Cloud:** `[Vercel]` app + `[Neon/Supabase/self-hosted PostgreSQL]` — **not** AWS root / Mongo / Stripe / Mixpanel unless later contracted.

This protocol is written for *this* repo. Placeholders in `[brackets]` are operator-filled. Do not invent a Stripe ledger or Datadog tenant that does not exist.

---

## Section 1: Global Access & Sign-In Matrix

| Role | Environment | URL | Auth | Complexity / MFA | Lockout escalation |
|---|---|---|---|---|---|
| End user | production | `[https://fortisos.cloud]/auth/login` | NextAuth credentials (email + password). **No** social/magic-link in code today. | 12-char policy (`lib/onboarding/password.ts`) | `legal@fortisos.gm` → `[PLATFORM_ONCALL]` |
| End user | preview | `[PREVIEW_HOST]/auth/login` | same | same | same |
| Staff / moderator | production | `[https://fortisos.cloud]/admin/*` | NextAuth + membership `org_admin` / dual-control for court orders. **Not** IP-allowlisted yet. | MFA **not** implemented — treat as gap | `[SECURITY_LEAD]` |
| Super admin UI | production | `/admin/super` | **Production-blocked** as mock-data unless `FORTIS_ALLOW_NON_PRODUCTION_MODULES=true`. Even then KPIs must come from `/api/v2/status`, not invented GMV. | — | `[CTO]` |
| Cloud console | `[Vercel team]` | `[vercel.com]` | `[SSO/MFA via Vercel]` · no shared root | Rotate invite; no shared password | `[DEVOPS]` |
| SSH / bastion | `[none in this SaaS path]` | N/A | Container/Vercel — **no SSH, no root** | If a VM is added: keys 90 days, no root | `[DEVOPS]` |
| Database R/W | private | `DATABASE_URL` | Prisma migrate deploy only from CI/architect. Reporting: `[READ_REPLICA_URL]` or none | Never paste prod URL in Slack | `[DATA_STEWARD]` |
| Transfer ops | operator | env `FORTIS_TRANSFER_*` | Human bank/Wave/QMoney — not an API | Dual-person for account number change | `[FINANCE]` + legal |
| Email | `[Resend]` | dashboard | `RESEND_API_KEY` | Rotate 90 days | `[PLATFORM_ONCALL]` |
| Optional AI | Google AI Studio | `GEMINI_API_KEY` | BYOK, off by default | Never required | `[AI_OWNER]` |
| Payments PSP | **OFF** | — | `module.core.payments.live=false` | Do not create Stripe as source of truth | `[FINANCE]` |

Password recovery: `/api/auth/forgot-password` + email if Resend configured.

**Who is the primary owner of this protocol?** `[PLATFORM_ONCALL]`

---

## Section 2: Super Admin / War Room

**Single source of operational truth for the pilot:** `GET /api/v2/status` and `GET /api/v2/qa/modules`.

Mandatory daily widgets (honest):

| Widget | Where |
|---|---|
| Process health | `/api/health` (heap/uptime) |
| Core deps + flags | `/api/v2/status` — **live payments must read false** |
| Applet maturity | `/api/v2/qa/modules` |
| Pending support | `[SUPPORT_INBOX legal@fortisos.gm]` — no ticket product yet |
| Error rate / CPU | `[HOST_METRICS: Vercel analytics / not installed]` |

**North star (pilot):** completed GROW previews and transfer *instructions* with unique `FTS-` refs — **not** MRR, escrow, or listing count.

Feature flags: `lib/core/feature-flags.ts` + `FORTIS_FLAG_*` env. Kill switch: set `module.grow.launch=false`; **never** set `module.core.payments.live=true` without `docs/phase-0/PAYMENT_LIVE_DECISION.md` signatures.

Audit: `createAuditEvent` / policy denials. Super-admin impersonation **does not exist** — do not add it for launch.

**Who is the primary owner of this protocol?** `[CTO]`

---

## Section 3: Data locator (no guessing)

| Business object | Technical location | Rule |
|---|---|---|
| User PII, password hash | PostgreSQL `User` via Prisma (`prisma/schema.prisma`) | No ad-hoc prod SELECT of hashes. Use read replica if added. |
| Memberships / tenant | `Membership`, session `orgId` only | Never trust client org id |
| Catalogue prices | `lib/core/catalogue.ts` + DB when migrated | Server is price authority |
| Transfer instructions | in-memory `rideStore` **and** Prisma tables from `20260824100000_*` | Dual-write still incomplete — treat memory as volatile |
| Entitlements | `lib/entitlements/store.ts` (memory) + schema | Provisional after evidence |
| Academy credentials | HMAC + `lib/academy/registry.ts` | Fail-closed verify |
| Complaints / enquiries | `lib/govern/complaints.ts`, `lib/services/enquiries.ts` | Consent required; `booked: false` |
| Email send log | Resend dashboard if key set | No Mongo `email_logs` |
| Payments | **No Stripe.** Transfer evidence only | Do not aggregate `status=succeeded` cards |
| App errors | Host logs + `console.error` | No Sentry tenant unless `[SENTRY_DSN]` added |
| CMS | **None** — copy is in repo | Missing copy = git, not Contentful draft |
| Public inventory | empty by design | Partner GET stays empty |

**Who is the primary owner of this protocol?** `[DATA_STEWARD]`

---

## Section 4: Maintenance SOPs

**Daily (Europe/London 09:00 for Leeds operator, plus Banjul overlap):**

1. `GET /api/v2/status` — `paymentLive` = blocked.  
2. Confirm last transfer evidence queue (operator inbox).  
3. If Resend on: bounce/fail check.  
4. Backup mail: see `docs/runbooks/backups.md`.

**Weekly (Monday 09:00 UTC):** `npm run security:audit`; review p95 if host metrics exist; rotate any leaked secret.

**Monthly DR:** restore last dump to a scratch DB; record RPO/RTO. **Targets** RPO &lt; 24h / RTO &lt; 4h until a standby is contracted (prompt’s 5/15 min is **not** claimed).

**Patch:** staging 48h then production. Prisma: `migrate deploy` by architect, not app boot.

**Who is the primary owner of this protocol?** `[DEVOPS]`

---

## Section 5: Deploy & rollback

Pre-deploy: `npm test` (`tests/core`). E2E Playwright is sample-only.

Deploy: Vercel/git push to `[production branch]`. **Not** blue-green/canary in-repo. Rollback = revert git deploy. Error-rate 5% / 3s homepage: revert immediately (`docs/runbooks/incident.md` Sev-1/2).

Migrations: **never** auto `db push` in production. Architect runs `prisma migrate deploy` with dry review of SQL.

Commerce flags stay false on every deploy checklist.

**Who is the primary owner of this protocol?** `[LEAD_ENGINEER]`

---

## Section 6: Training manuals (outline)

### A. Staff

1. Status + QA modules; do not impersonate users.  
2. Consent logs: enquiry/complaint records; GDPR/GDPA requests → `privacy@fortisos.gm`.  
3. KYC/KYB: machine exists; **no staff product** — escalate to `[COMPLIANCE]`, do not approve merchants in Slack.  
4. Escalation: copy/UX → builder; 5xx/auth → DevOps; money/legal → Finance + legal.

### B. End user (`/demo`)

1. Register, verify email, 12-char password. No MFA yet.  
2. GROW preview → transfer instruction → Academy outline.  
3. Professionals/equipment show **0** listings.  
4. Support: `legal@fortisos.gm` (priority informal until a ticket tool exists).

**Who is the primary owner of this protocol?** `[SUPPORT_LEAD]`

---

## Section 7: Pre-launch checklist (commerce)

Must be signed 24h before **any** public commerce claim. Pilot publish does **not** require this full list.

- [ ] SSL valid &gt; 90 days on `[fortisos.cloud]`  
- [ ] Prod env: no `localhost` `NEXTAUTH_URL`  
- [ ] `module.core.payments.live=false` **or** signed PAYMENT_LIVE_DECISION  
- [ ] Rate limit: register exists; global WAF `[VERCEL/WAF]` configured  
- [ ] Privacy/Terms dated (24 Aug 2026+) — no Stripe/OpenAI-as-rail  
- [ ] Analytics: **do not** require Mixpanel; if added, consent first  
- [ ] `legal@fortisos.gm` monitored  
- [ ] Team MFA on Vercel/GitHub `[pending]`  
- [ ] Empty public inventory verified  
- [ ] LICENSE + `/demo` present  
- [ ] GitHub workflow copied by a human  

**Commerce launch: FAIL until PSP + KYB staff + legal.**  
**Pilot launch: allowed with the honest surfaces only.**

**Who is the primary owner of this protocol?** `[CTO]`
