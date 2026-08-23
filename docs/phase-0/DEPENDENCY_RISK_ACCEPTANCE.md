# Production dependency risk acceptance

**Date:** 23 August 2026  
**Scope:** Next.js 14.2.35 and Prisma 6.19.2 production high findings reported by `npm audit --omit=dev`.

## Decision

Remain on the pinned Next 14 / Prisma 6 line for the Core/GROW pilot. A forced `npm audit fix --force` requires a major framework upgrade and is out of band for this Phase 1 delivery.

## Compensating controls

- Production fail-closed middleware for simulated payment and mock admin routes.
- Signed webhook verification; no live payment credentials.
- Membership policy on admin, billing, marketplace, training and GOVERN APIs.
- CI production audit remains a **release blocker** until owners accept a dated exception for a specific deploy.

## Review

Re-open when Next 15/16 upgrade is scheduled with full regression of auth, payments and Prisma.
