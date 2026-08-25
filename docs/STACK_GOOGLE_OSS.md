# Recommended stack — Google-first + open source (approved)

Executed: OpenAI removed as a required dependency. Narrative AI is **deterministic first**, optional **Gemini (AI Studio)** if `GEMINI_API_KEY` is set. Resend is optional (dynamic import). Next.js + PostgreSQL/Prisma stay.

## Keep (already aligned)

| Layer | Choice | Why |
|---|---|---|
| App | Next.js 14 + React 18 | OSS, works on Vercel/Firebase Hosting |
| Auth | NextAuth credentials | OSS; Firebase Auth is a later optional add-on |
| DB | PostgreSQL + Prisma | OSS; Cloud SQL is the Google-hosted option |
| Maps | `@react-google-maps/api` + Leaflet/OSM | Google Maps where needed; OSM fallback |
| Data | World Bank WDI, Open-Meteo, Frankfurter/ECB | Free published APIs; WDI also on Google Public Data |
| Crypto/auth helpers | bcryptjs, Node crypto | OSS, no native build |
| Tests | Vitest | OSS |
| In-process PG tests | PGlite | OSS |

## Google resources (use when they reduce cost)

| Resource | Use | Cost note |
|---|---|---|
| [Google AI Studio / Gemini API](https://aistudio.google.com/) | Optional narrative; REST, no SDK | Free tier then pay-as-you-go; **BYOK, off by default** |
| [Google Public Data / World Bank](https://www.google.com/publicdata/explore?ds=d5bncppjof8f9_) | GDP, population, CPI | Free |
| Maps JavaScript / Places | Tourism/rides maps already in repo | Free monthly quota then bill |
| Cloud SQL for Postgres | Managed DB when you leave the sandbox | Low-cost vs bespoke |
| Firebase Hosting / App Hosting | Optional deploy next to AI Studio | Spark/Blaze |
| Firebase Auth | **Not switched yet** — only if you want Google/phone login | Free tier |
| BigQuery public datasets | Later warehouse, not required for pilot | Query pricing |

Do **not** turn on Vertex AI, Dialogflow CX, or Maps Platform premium SKUs until there is a budget owner.

## GitHub / OSS to integrate next (not installed until you say so)

| Repo | Aligns with | Licence (check before pin) |
|---|---|---|
| [Leaflet](https://github.com/Leaflet/Leaflet) | Already used for maps | BSD-2 |
| [Turf](https://github.com/Turfjs/turf) | Already used for geo | MIT |
| [Open-Meteo](https://github.com/open-meteo/open-meteo) | Weather | AGPL server; API is free to consume |
| [World Bank API](https://github.com/worldbank/api) | National stats | Open data |
| [huggingface/transformers.js](https://github.com/huggingface/transformers.js) | In-browser embeddings later | Apache-2.0 |
| [ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp) | Local narrative if Gemini off | MIT |
| [mozilla/pdf.js](https://github.com/mozilla/pdf.js) | GOVERN document extract | Apache-2.0 |
| [tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract) | OCR | Apache-2.0 |
| [nextauthjs/next-auth](https://github.com/nextauthjs/next-auth) | Auth | ISC |
| [prisma/prisma](https://github.com/prisma/prisma) | ORM | Apache-2.0 |
| [electric-sql/pglite](https://github.com/electric-sql/pglite) | Migration tests | Apache-2.0 |

## Explicitly not required

- OpenAI SDK / paid OpenAI keys
- Resend (optional only)
- Stripe (SBN-COMCACHE pending; transfer evidence is the interim rail)
- New Firebase/Auth rewrite in this pass

## What this pass changed

- `openai` package removed from `package.json`
- `lib/openai-client.ts` is a Gemini-optional facade
- Email routes `import()` Resend only when a key exists
- Env: `GEMINI_API_KEY`, `GEMINI_MODEL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
