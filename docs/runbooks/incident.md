# Incident runbook

Owner: platform on-call  
SLO: Core/GROW API availability 99.5% monthly; GROW p95 < 2.5s for deterministic reports.

## Detect

- `/api/v2/status` returns `degraded` or 5xx.
- Error budget burn on 5xx / webhook lag.

## Respond

1. Declare incident in #ops; assign commander.
2. Set `module.grow.launch=false` if user-facing corruption.
3. Fail closed on payments (`module.core.payments.live` remains false).
4. Prefer deterministic GROW path; do not enable paid AI during incident.

## Rollback

- Revert the last deploy of `arena/*` or `main`.
- Prisma: do not roll back Core migrations; disable flags instead.

## Close

- Timeline, customer impact, action items within 48h.
