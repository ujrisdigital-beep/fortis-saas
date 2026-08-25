# Google ops (optional)

Not required for the pilot. Use when you want AI Studio + Google Cloud next to this repo.

## Cloud SQL (Postgres)

Same `DATABASE_URL` as today. Run `npx prisma migrate deploy`.

## Firebase Hosting / App Hosting

`firebase.json` is a placeholder. Prefer Next.js on Cloud Run or Firebase App Hosting rather than static `out/` unless you export.

## Maps

Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Leaflet/OSM remains the no-key fallback.

## Gemini

`GEMINI_API_KEY` from AI Studio. GROW may add a narrative **on top of** the deterministic report only. No invented statistics.
