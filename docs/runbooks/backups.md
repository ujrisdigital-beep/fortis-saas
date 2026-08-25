# Backups and restore

## Backup

- Nightly `pg_dump` of staging/production PostgreSQL to encrypted object storage.
- Retain 30 daily + 12 monthly dumps.
- Prisma migrations are the schema source of truth.

## Restore test (quarterly)

1. Provision empty PostgreSQL 16.
2. Restore latest dump.
3. `npx prisma migrate deploy` (should be no-op).
4. `npm run db:validate-core`.
5. Log restore RTO/RPO.

RPO target: 24h. RTO target: 4h for Core/GROW pilot.
