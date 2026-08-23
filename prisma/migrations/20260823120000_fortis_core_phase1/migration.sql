-- FORTIS CORE Phase 1 tables (alongside legacy models)

CREATE TYPE "MembershipStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'REVOKED');
CREATE TYPE "CatalogueStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'RETIRED');
CREATE TYPE "PriceStatus" AS ENUM ('ACTIVE', 'SUPERSEDED', 'RETIRED');
CREATE TYPE "SubscriptionStatus" AS ENUM ('INCOMPLETE', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');
CREATE TYPE "EntitlementState" AS ENUM ('PENDING', 'ACTIVE', 'REVOKED', 'EXPIRED');
CREATE TYPE "UsageReservationState" AS ENUM ('OPEN', 'COMMITTED', 'RELEASED', 'EXPIRED');
CREATE TYPE "PaymentIntentStatus" AS ENUM ('CREATED', 'REQUIRES_ACTION', 'AUTHORISED', 'CAPTURED', 'FAILED', 'CANCELLED');
CREATE TYPE "ProviderEventStatus" AS ENUM ('RECEIVED', 'REJECTED', 'PROCESSED');
CREATE TYPE "LedgerEntrySide" AS ENUM ('DEBIT', 'CREDIT');

CREATE TABLE "RoleDefinition" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoleDefinition_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RoleDefinition_key_key" ON "RoleDefinition"("key");

CREATE TABLE "PermissionGrant" (
    "id" TEXT NOT NULL,
    "roleKey" TEXT NOT NULL,
    "applet" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL DEFAULT '*',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PermissionGrant_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PermissionGrant_roleKey_applet_action_resource_key" ON "PermissionGrant"("roleKey", "applet", "action", "resource");

CREATE TABLE "OrganisationMembership" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleKey" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'INVITED',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    CONSTRAINT "OrganisationMembership_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OrganisationMembership_organisationId_userId_key" ON "OrganisationMembership"("organisationId", "userId");
CREATE INDEX "OrganisationMembership_userId_status_idx" ON "OrganisationMembership"("userId", "status");

CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SessionRevocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SessionRevocation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SessionRevocation_jti_key" ON "SessionRevocation"("jti");
CREATE INDEX "SessionRevocation_userId_idx" ON "SessionRevocation"("userId");

CREATE TABLE "Applet" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "CatalogueStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Applet_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Applet_key_key" ON "Applet"("key");

CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "appletId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "CatalogueStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Product_appletId_key_version_key" ON "Product"("appletId", "key", "version");

CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CatalogueStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Plan_productId_key_version_key" ON "Plan"("productId", "key", "version");

CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "interval" TEXT NOT NULL,
    "status" "PriceStatus" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Price_planId_currency_interval_version_key" ON "Price"("planId", "currency", "interval", "version");
ALTER TABLE "Price" ADD CONSTRAINT "Price_amountMinor_nonneg" CHECK ("amountMinor" >= 0);

CREATE TABLE "PlanEntitlement" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "limitAmount" INTEGER,
    "unit" TEXT,
    CONSTRAINT "PlanEntitlement_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PlanEntitlement_planId_featureKey_key" ON "PlanEntitlement"("planId", "featureKey");

CREATE TABLE "CoreSubscription" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),
    CONSTRAINT "CoreSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SubscriptionItem" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "SubscriptionItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SeatAssignment" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SeatAssignment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SeatAssignment_subscriptionId_userId_key" ON "SeatAssignment"("subscriptionId", "userId");

CREATE TABLE "OneOffPurchase" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OneOffPurchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EntitlementGrant" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "featureKey" TEXT NOT NULL,
    "state" "EntitlementState" NOT NULL DEFAULT 'PENDING',
    "source" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    CONSTRAINT "EntitlementGrant_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EntitlementGrant_organisationId_featureKey_state_idx" ON "EntitlementGrant"("organisationId", "featureKey", "state");

CREATE TABLE "UsageLimit" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "hardLimit" INTEGER NOT NULL,
    "periodKey" TEXT NOT NULL,
    "alertThreshold" INTEGER,
    CONSTRAINT "UsageLimit_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UsageLimit_organisationId_featureKey_periodKey_key" ON "UsageLimit"("organisationId", "featureKey", "periodKey");

CREATE TABLE "UsageReservation" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "state" "UsageReservationState" NOT NULL DEFAULT 'OPEN',
    "idempotencyKey" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsageReservation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UsageReservation_idempotencyKey_key" ON "UsageReservation"("idempotencyKey");
CREATE INDEX "UsageReservation_organisationId_featureKey_state_idx" ON "UsageReservation"("organisationId", "featureKey", "state");
ALTER TABLE "UsageReservation" ADD CONSTRAINT "UsageReservation_units_pos" CHECK ("units" > 0);

CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "reservationId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UsageEvent_idempotencyKey_key" ON "UsageEvent"("idempotencyKey");
CREATE INDEX "UsageEvent_organisationId_featureKey_createdAt_idx" ON "UsageEvent"("organisationId", "featureKey", "createdAt");

CREATE TABLE "UsageAggregate" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "consumed" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UsageAggregate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UsageAggregate_organisationId_featureKey_periodKey_key" ON "UsageAggregate"("organisationId", "featureKey", "periodKey");

CREATE TABLE "InvoiceUsageLine" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    CONSTRAINT "InvoiceUsageLine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentCustomer" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentCustomer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PaymentCustomer_provider_externalId_key" ON "PaymentCustomer"("provider", "externalId");

CREATE TABLE "ProviderAccount" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProviderAccount_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProviderAccount_provider_externalId_key" ON "ProviderAccount"("provider", "externalId");

CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'CREATED',
    "idempotencyKey" TEXT NOT NULL,
    "providerRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PaymentIntent_idempotencyKey_key" ON "PaymentIntent"("idempotencyKey");

CREATE TABLE "PaymentAttempt" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "providerRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProviderEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "signatureOk" BOOLEAN NOT NULL,
    "status" "ProviderEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "payloadHash" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    CONSTRAINT "ProviderEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProviderEvent_provider_externalId_key" ON "ProviderEvent"("provider", "externalId");

CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "LedgerAccount_organisationId_code_currency_key" ON "LedgerAccount"("organisationId", "code", "currency");

CREATE TABLE "LedgerTransaction" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reversedById" TEXT,
    "reversesId" TEXT,
    CONSTRAINT "LedgerTransaction_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "LedgerTransaction_idempotencyKey_key" ON "LedgerTransaction"("idempotencyKey");

CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "side" "LedgerEntrySide" NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LedgerEntry_transactionId_idx" ON "LedgerEntry"("transactionId");
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_amount_pos" CHECK ("amountMinor" > 0);

CREATE TABLE "ReconciliationRun" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReconciliationRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReconciliationException" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "ReconciliationException_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "organisationId" TEXT,
    "actorId" TEXT,
    "correlationId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuditEvent_type_createdAt_idx" ON "AuditEvent"("type", "createdAt");

ALTER TABLE "PermissionGrant" ADD CONSTRAINT "PermissionGrant_roleKey_fkey" FOREIGN KEY ("roleKey") REFERENCES "RoleDefinition"("key") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganisationMembership" ADD CONSTRAINT "OrganisationMembership_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganisationMembership" ADD CONSTRAINT "OrganisationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SessionRevocation" ADD CONSTRAINT "SessionRevocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_appletId_fkey" FOREIGN KEY ("appletId") REFERENCES "Applet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Price" ADD CONSTRAINT "Price_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlanEntitlement" ADD CONSTRAINT "PlanEntitlement_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoreSubscription" ADD CONSTRAINT "CoreSubscription_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubscriptionItem" ADD CONSTRAINT "SubscriptionItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "CoreSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubscriptionItem" ADD CONSTRAINT "SubscriptionItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SubscriptionItem" ADD CONSTRAINT "SubscriptionItem_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OneOffPurchase" ADD CONSTRAINT "OneOffPurchase_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OneOffPurchase" ADD CONSTRAINT "OneOffPurchase_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EntitlementGrant" ADD CONSTRAINT "EntitlementGrant_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EntitlementGrant" ADD CONSTRAINT "EntitlementGrant_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "CoreSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UsageReservation" ADD CONSTRAINT "UsageReservation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentCustomer" ADD CONSTRAINT "PaymentCustomer_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "PaymentIntent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "LedgerTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ReconciliationException" ADD CONSTRAINT "ReconciliationException_runId_fkey" FOREIGN KEY ("runId") REFERENCES "ReconciliationRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
