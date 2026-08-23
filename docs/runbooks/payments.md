# Payment runbook (sandbox only)

Live money is **not authorised**. `module.core.payments.live` stays false until legal/finance/security sign the provider decision record.

## Sandbox

- Adapter: `fortis_sandbox`.
- Webhooks: HMAC `timestamp.payload`, 5 minute skew.
- Duplicate `provider+externalId` must not double-post the ledger.

## Exceptions

Open `ReconciliationException` rows. Never edit posted ledger lines; post a reversal.

## Outage

If the sandbox adapter fails, checkout returns 503. Do not fall back to simulated capture.
