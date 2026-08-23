CREATE TABLE "GrowAssessment" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "engineVersion" TEXT NOT NULL,
    "inputHash" TEXT NOT NULL,
    "preview" JSONB NOT NULL,
    "fullReport" JSONB,
    "sourceChecksums" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GrowAssessment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "GrowAssessment_organisationId_createdAt_idx" ON "GrowAssessment"("organisationId", "createdAt");

CREATE TABLE "SignedCredential" (
    "id" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "programTitle" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signature" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokeReason" TEXT,
    CONSTRAINT "SignedCredential_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SignedCredential_serial_key" ON "SignedCredential"("serial");
CREATE INDEX "SignedCredential_learnerId_idx" ON "SignedCredential"("learnerId");

CREATE TABLE "DiscoverListing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "sourceNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    CONSTRAINT "DiscoverListing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GovernComplaint" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "organisationId" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "consent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GovernComplaint_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "GovernComplaint_reference_key" ON "GovernComplaint"("reference");
