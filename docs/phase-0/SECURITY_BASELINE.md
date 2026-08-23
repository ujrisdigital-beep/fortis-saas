# Security and build baseline

**Assessed:** 23 August 2026

## Completed

- Removed tracked `.env.production` and `.env.localcd` files.
- Added ignore rules for all non-example environment files.
- Replaced environment example with non-secret development placeholders.
- Removed accidental tracked root files.
- Upgraded NextAuth from 4.24.11 to 4.24.15, removing the previously reported critical advisory.
- Upgraded Nodemailer to 9.0.5 and Resend to the current locked release.
- Replaced native `bcrypt` with `bcryptjs` to remove native binary installation fragility and duplicate bcrypt dependencies.
- Pinned Node 20 and npm 10.
- Added a CI quality/security workflow template. Activation under `.github/workflows/` requires a GitHub credential with workflow permission.
- Added production fail-closed controls and tests for known simulated/placeholder modules.
- Added initial authorization target matrix.

## Verified locally

- TypeScript check: pass
- ESLint transitional baseline: pass
- Production-readiness tests: 6 pass
- Next.js compilation: pass
- Full build: blocked at page-data collection because Prisma client generation could not download the Prisma engine from `binaries.prisma.sh` in this sandbox network

The Prisma failure is an environment download failure, not accepted as a passing build. CI must generate the real client and complete the build before merge/deployment.

## Remaining production dependency audit

`npm audit --omit=dev` currently reports:

- 0 critical
- 7 high
- 0 moderate

The high findings are in the legacy Next.js 14 line and Prisma/config dependency tree. Available npm fixes require major framework change or Prisma version strategy and must be handled as a tested migration, not an unreviewed forced audit fix. CI intentionally treats the production audit as a release blocker.

## Transitional compiler/lint debt

The codebase had no ESLint configuration and many legacy style/type findings. A transitional config now allows a clean baseline while retaining core Next/TypeScript rules. `noImplicitAny` is explicitly disabled because Prisma client generation was unavailable and legacy handlers contain untyped callback values.

Phase 1 must tighten these rules module by module, starting with Core, payment, identity and GOVERN code. Production-critical new modules should not rely on the relaxed legacy rules.

## Required credential action

A populated Vercel OIDC value was found in a tracked production environment file. Its value was not copied into documentation. The owner must rotate/invalidate any still-valid deployment credential and review repository history and Vercel/GitHub audit logs.

## Deployment gate

Do not deploy this branch to production until:

1. Prisma client generation and full build pass in CI;
2. production high/critical dependency findings are resolved or formally risk-accepted with compensating controls;
3. `FORTIS_ALLOW_NON_PRODUCTION_MODULES` is absent or `false`;
4. protected APIs have server-side authorization;
5. required secrets are stored only in managed environment/secret systems.
