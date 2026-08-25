# Real-user onboarding and QA

Pilot users can register, verify email, join an organisation as `org_owner`, and use GROW preview. This is **not** a claim that marketplace money or official government services are live.

## Journey

1. `/onboarding`  
2. `/auth/register` — name, email, organisation, strong password, terms + privacy  
3. Email token (`/auth/verify`)  
4. `/auth/login`  
5. `/grow/workspace` preview  

Self-serve accounts are always `User.role = PUBLIC`. Privilege is membership-based. Requesting `CEO` is rejected.

## Industry QA covered in tests

| Area | Evidence |
|---|---|
| Password complexity | `evaluatePassword` |
| Disposable email | register plan |
| Consent | terms + privacy required |
| Privilege escalation | roleRequest blocked |
| Rate limit | 5 registrations / 15 min / IP |
| Email token | hashed, expiring, single-use |
| Tenant policy | existing Phase 1 tests |
| Ledger / webhooks | existing Phase 1 tests |
| Credential verify fail-closed | Phase 2 tests |

## Still not opened to real money

Live payments, KYC/KYB filings, and marketplace capture remain fail-closed.
