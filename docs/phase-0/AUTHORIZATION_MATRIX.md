# Initial authorization matrix

This is the minimum target for Phase 1. “Own” means the resource belongs to the authenticated user or one of their active organisation memberships.

| Domain/action | Public | Authenticated user | Organisation member | Manager | Applet operator | Finance admin | Security admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| Read approved public data/content | yes | yes | yes | yes | yes | yes | yes |
| View own profile/usage | no | own | own | own | no default | no default | audited support only |
| Create GROW assessment | limited entitlement | own | own organisation | organisation | support only | no | no |
| View GROW report | no | own | organisation scope | organisation scope | support by consent | no | audited support only |
| Learn/enrol/progress | approved public catalogue | own | assigned seats | assigned cohort | academy scope | no | audited support only |
| Issue/revoke credential | verify only | no | no | no | academy issuer | no | audited emergency only |
| Merchant catalogue write | read approved | own approved merchant | merchant scope | merchant scope | partner operator | no | security review only |
| Order/payment action | no | own order | buyer/merchant scope | no default | support, no payment impersonation | approved finance action | freeze only |
| Refund/payout | no | request own | request scope | no default | recommend/operate by policy | dual-controlled approval | freeze only |
| GOVERN case/evidence | approved public law only | own case | assigned case | assigned team | govern operator | no | dual-controlled audited access |
| Data source publish | read published | no | no | no | data steward/reviewer separation | no | no |
| Admin metrics/config | no | no | no | tenant-only | applet-only | billing-only | security-only |
| User/role administration | no | no | tenant invite if granted | tenant membership | no default | no | platform security with audit |

## Enforcement rules

- Tenant and user identity come from the verified session, never request body/query parameters.
- Every access decision specifies applet, resource, action and organisation.
- Sensitive access requires reason, audit event and where defined step-up authentication.
- Finance, credential issuance, evidence access and role elevation use separation of duties/dual control.
- “SUPER_ADMIN” is not a routine operating identity and cannot bypass audit.
- API keys have scopes, tenant binding, expiry, rotation and revocation.
- Public routes are explicit allow-list entries; everything else denies by default.

## Immediate risk

Most legacy APIs do not yet implement this matrix. Phase 0 blocks known simulated financial writes, but comprehensive authorization remediation is a Phase 1 release blocker.