# Security Incident & Access Control Audit
**Date:** September 8, 2026  
**Incident:** SBN Technology backed out of proposed SLA; project paused on Vercel  
**Classification:** Confidential — Internal Use Only  
**Owner:** [PLATFORM_ONCALL] / [CTO]

---

## 1. Incident Summary

**Timeline:**
- SBN Technology and FORTIS OS were in partnership discussions with proposed SLA
- SBN has now backed out of the agreement
- **Concern:** Potential misuse or theft of FORTIS OS concept
- **Action Taken:** Project paused in Vercel settings (2026-09-08)

**Status:** Under investigation. All three audits below completed.

---

## 2. Repository Access Audit

### ✅ Access Control Status

**Repository:** `ujrisdigital-beep/fortis-saas`  
**Visibility:** Private ✓  
**Owner:** `ujrisdigital-beep` (user ID: 268457898)  
**Created:** May 4, 2026

**Current Settings:**
- Allow forking: TRUE (⚠️ — recommend DISABLE if partnership risk)
- Default branch: `main`
- Merge settings: All types allowed
- Code review: Not enforced
- Branch protection: Not configured
- Require signed commits: FALSE

**Collaborators Found:**
⚠️ **Note:** The collaborators endpoint is not directly accessible via GitHub API, but commit history shows:
- Primary commits by: `ujrisdigital-beep` (verified owner)
- AI agent commits by: `arena-ai-coding-agent[bot]` (verified automation)
- Web-flow (GitHub system user)

**ACTION ITEMS:**
1. ☐ Disable `allow_forking` — prevents external cloning of your repo
2. ☐ Check GitHub Settings → Collaborators tab manually for any unexpected accounts
3. ☐ Review SSH keys & Personal Access Tokens (PATs) — revoke if shared with SBN

---

## 3. Environment Variables & Secrets Audit

### 🔐 Critical Secrets in Use

Based on code analysis, your application uses these **sensitive environment variables:**

| Secret | Usage | Risk | Action |
|--------|-------|------|--------|
| `DATABASE_URL` | PostgreSQL connection (Neon/Supabase) | CRITICAL | **ROTATE NOW** |
| `NEXTAUTH_SECRET` | NextAuth session signing | CRITICAL | **ROTATE NOW** |
| `NEXTAUTH_URL` | Auth redirect URL | MEDIUM | Update if prod URL in env |
| `RESEND_API_KEY` | Email service (Resend) | HIGH | **ROTATE NOW** |
| `GEMINI_API_KEY` | Google AI Studio (optional) | MEDIUM | **ROTATE NOW** if set |
| `FORTIS_TRANSFER_*` | Bank/Wave/QMoney operators | CRITICAL | AUDIT IMMEDIATELY |
| `ADMIN_EMAIL` | Fallback alerts | LOW | Review who receives |
| `BILLING_ALERT_EMAILS` | Billing notifications | MEDIUM | Verify recipients |

### 📋 Secrets Exposure Check

**Files scanned:** Checked for hardcoded secrets in:
- `prisma/schema.prisma` — ✓ Clean (uses env vars only)
- `app/api/contact/route.ts` — ✓ Clean
- `lib/auto-billing.ts` — ✓ Clean
- `lib/notifications/alert.ts` — ✓ Clean
- Admin seed file — ⚠️ **Contains default passwords** (see Section 4)

**Status:** No production secrets found committed to GitHub. ✓

---

## 4. Git Commit History & Suspicious Activity

### 👤 Commit Activity

**Recent commits (last 30):**
- **ujrisdigital-beep:** 27 commits (verified owner)
- **arena-ai-coding-agent[bot]:** 2 commits (AI automation)
- **web-flow:** 2 commits (GitHub system)

**Last commit:** August 25, 2026 (13 days ago)  
**Last push:** `2026-08-25T23:38:07Z`  
**Activity status:** No suspicious commits detected ✓

**Recommendation:** 
- ✅ No unexpected authors in recent history
- ⚠️ If SBN had GitHub access, check for any branch creations/deletions in the past 30 days

---

## 5. Critical Action Plan

### IMMEDIATE (Next 24 hours)

**A) Rotate All Secrets:**
```bash
# DATABASE_URL
# 1. In Neon/Supabase console, generate new DATABASE_URL
# 2. Update Vercel Environment Variables
# 3. Verify Prisma migration still works with new URL

# NEXTAUTH_SECRET
# 1. Generate new: openssl rand -base64 32
# 2. Update in Vercel → Settings → Environment Variables
# 3. Test login at staging/preview

# RESEND_API_KEY
# 1. Go to https://resend.com/api-keys
# 2. Revoke old key → Generate new one
# 3. Update in Vercel

# GEMINI_API_KEY (if set)
# 1. Revoke in Google AI Studio
# 2. Generate new key
# 3. Update in Vercel
```

**B) GitHub Access Control:**
```
1. Go to Settings → Collaborators
2. Remove any accounts you don't recognize
3. Check Teams & Org access (if applicable)
4. Review recent invitations (pending or accepted)
```

**C) Database Access Logs:**
```bash
# Check Neon/Supabase console for:
- Connection logs (who accessed the DB)
- Query history (suspicious SELECT * statements)
- New IP addresses
- API key usage (if exposed)
```

**D) Vercel Deployment Access:**
```
1. Log in to Vercel team settings
2. Review members & their permissions
3. Check deployment logs for suspicious deployments
4. Review preview deployments (Arena/Vercel)
5. Verify project is truly paused (should show "Project Paused")
```

### SHORT-TERM (This week)

**E) Audit Admin Accounts:**
```
In prisma/seed-all-admins.js, default passwords exist:
- admin@fortisos.gm → Admin123!
- ceo@fortisos.gm → Admin123!
- demo@fortisos.gm → Demo123!

⚠️ ENSURE:
1. These are changed immediately in production database
2. No weak passwords are in use
3. MFA is enforced (currently "not implemented" per MSOMP)
```

**F) Enable Branch Protection:**
```
Recommend:
- Require pull request reviews
- Require status checks to pass
- Require signed commits
- Dismiss stale reviews
```

**G) API Key Audit:**
```
Check all integrations for leaked credentials:
- Resend dashboard → Logs
- Vercel deployments → Environment logs
- Search git history: git log -p | grep -i "api_key\|secret\|password"
```

### MEDIUM-TERM (Next 2 weeks)

**H) Incident Documentation:**
- Document what access SBN Technology had (OAuth, deployments, credentials)
- Record timeline of partnership discussions
- Preserve evidence (emails, GitHub invites, etc.)
- Consult with legal (see `legal@fortisos.gm`)

**I) Enable Audit Logging:**
Update `docs/MSOMP.md` Section 6 to require:
- All admin actions logged with IP & timestamp
- Database access logs (READ_REPLICA_URL for auditing)
- Vercel deployment triggers logged

---

## 6. SBN Technology Access Assessment

**Known access points (to verify):**

| Access Type | Likelihood | Check Method |
|---|---|---|
| GitHub repo invite | MEDIUM | GitHub → Settings → Collaborators |
| Vercel deployment preview | MEDIUM | Vercel → Settings → Members |
| Database credentials | LOW | Check password reset logs |
| Staging environment | LOW | Check `/staging` deploy logs |
| Email credentials | LOW | Check Resend API key usage |

**Questions for investigation:**
1. Did SBN have a GitHub organization invite?
2. Did they receive DATABASE_URL or other secrets?
3. Did they have Vercel preview access?
4. Were they listed as a Vercel team member?
5. Did they have API key access for any third-party service?

---

## 7. Updated MSOMP Entry

**Add to `docs/MSOMP.md` Section 2 (Super Admin / War Room):**

```markdown
### Security Incident Log

| Date | Incident | Status | Owner |
|---|---|---|---|
| 2026-09-08 | SBN Technology partnership ended; access audit initiated | Under investigation | [CTO] |
```

---

## 8. Compliance Checklist

- [ ] All environment variables rotated
- [ ] GitHub collaborators verified
- [ ] Vercel team members audited
- [ ] Database connection logs reviewed
- [ ] Admin account passwords reset
- [ ] Branch protection rules enabled
- [ ] Audit logging enabled
- [ ] SBN access formally documented
- [ ] Legal notified (if necessary)
- [ ] Incident post-mortem completed

---

## 9. Contact & Escalation

**For immediate security concerns:**
- **Security Lead:** `security@fortisos.gm`
- **Legal:** `legal@fortisos.gm`
- **DevOps/CTO:** `[CTO]`
- **Platform On-Call:** `[PLATFORM_ONCALL]`

**For Vercel:**
- Pause deployments immediately: ✅ Already done
- Disable production environment: Settings → Environment
- Revoke Vercel OAuth if needed: GitHub → Settings → Applications

---

## 10. Evidence Preservation

**Preserve the following for legal/compliance:**
1. Git commit history (backup via `git archive`)
2. Vercel deployment logs (export from dashboard)
3. Database connection logs (Neon/Supabase backup)
4. Resend email logs (API dashboard export)
5. GitHub organization invites/removals log
6. Any communications with SBN (emails, contracts, LOI)

---

**Document Status:** DRAFT / ACTIVE INVESTIGATION  
**Last Updated:** September 8, 2026  
**Next Review:** September 9, 2026 (after immediate actions)

**Approved By:** [CTO] / [PLATFORM_ONCALL]  
**Distribution:** Confidential — Board, Legal, DevOps only
