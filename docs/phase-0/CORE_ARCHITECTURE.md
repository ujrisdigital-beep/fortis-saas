# FORTIS CORE — Phase 1 architecture design

This is a design artefact. It does not authorise or apply database migrations.

## Domain boundaries

- Identity and organisations
- Product catalogue and entitlements
- Usage metering
- Payments and provider events
- Double-entry operational sub-ledger
- Data source/provenance exchange
- Files and evidence
- Notifications
- Audit and operations

## Proposed entities

### Identity/tenancy

- `AccountUser`
- `Organisation`
- `OrganisationMembership`
- `RoleDefinition`
- `PermissionGrant`
- `ConsentRecord`
- `SessionRevocation`

Global roles in the legacy `User` model will not be trusted for tenant resources. Permission checks use membership, resource ownership, applet, action and optional step-up state.

### Catalogue/entitlement

- `Applet`
- `Product`
- `Plan`
- `Price`
- `PlanEntitlement`
- `Subscription`
- `SubscriptionItem`
- `SeatAssignment`
- `OneOffPurchase`
- `EntitlementGrant`

Prices are versioned and immutable after use. A checkout references a server-owned price ID.

### Usage

- `UsageEvent`
- `UsageReservation`
- `UsageAggregate`
- `UsageLimit`
- `InvoiceUsageLine`

Events are append-only and idempotent. Reservations prevent concurrent over-consumption.

### Payments/ledger

- `PaymentCustomer`
- `ProviderAccount`
- `PaymentIntent`
- `PaymentAttempt`
- `ProviderEvent`
- `Refund`
- `Dispute`
- `Payout`
- `Settlement`
- `LedgerAccount`
- `LedgerTransaction`
- `LedgerEntry`
- `ReconciliationRun`
- `ReconciliationException`

Money uses integer minor units and ISO currency. A database constraint/transactional posting procedure enforces balanced entries. Posted records are reversed, never edited.

### Live data

- `SourceDefinition`
- `SourceAdapterRun`
- `RawSourceObject`
- `CanonicalDataset`
- `CanonicalRecordVersion`
- `ProvenanceRecord`
- `DataQualityIssue`
- `EditorialReview`

Raw payloads are checksum-addressed and immutable. Canonical records point to exact source/version evidence.

## Event contracts

Initial event families:

- `identity.user_verified`
- `organisation.member_added`
- `entitlement.granted|revoked`
- `usage.reserved|recorded|failed`
- `payment.intent_created|authorised|failed`
- `provider.event_received|rejected|processed`
- `ledger.transaction_posted|reversed`
- `refund.requested|confirmed`
- `payout.scheduled|confirmed|failed`
- `source.fetch_succeeded|failed|schema_changed`
- `data.record_published|corrected|stale`
- `audit.sensitive_access`

Each carries schema version, tenant, actor, correlation, causation, idempotency and timestamps.

## Migration strategy

1. Add new Core tables alongside legacy models.
2. Backfill with checksums and reconciliation reports.
3. Dual-read only where necessary; avoid uncontrolled dual-write.
4. Move one vertical journey at a time.
5. Compare legacy/new outputs and audit.
6. Cut over behind a feature flag.
7. Retain rollback path.
8. Archive/retire legacy structures only after retention and legal review.

## API policy

- validate input and output schemas;
- authenticate and authorize at server boundary;
- tenant IDs derive from trusted session, never browser claim;
- idempotency required on financial/expensive writes;
- structured error codes and correlation IDs;
- no detailed internal errors to clients;
- version external contracts;
- deny by default for unlaunched modules.
