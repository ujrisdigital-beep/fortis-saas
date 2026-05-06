-- CreateTable
CREATE TABLE "OmbudsmanCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseNumber" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "complainantName" TEXT,
    "complainantPhone" TEXT,
    "complainantEmail" TEXT,
    "mdaId" TEXT NOT NULL,
    "mdaName" TEXT NOT NULL,
    "complaintText" TEXT NOT NULL,
    "complaintLanguage" TEXT NOT NULL DEFAULT 'en',
    "evidenceUrls" TEXT NOT NULL,
    "ujrisIntegrityScore" INTEGER,
    "ujrisRedFlags" TEXT,
    "ujrisAnalysis" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "assignedTo" TEXT,
    "assignedAt" DATETIME,
    "recommendationIssued" BOOLEAN NOT NULL DEFAULT false,
    "recommendationText" TEXT,
    "recommendationDate" DATETIME,
    "mdaResponseReceived" BOOLEAN NOT NULL DEFAULT false,
    "mdaResponseText" TEXT,
    "mdaResponseDate" DATETIME,
    "mdaCompliant" BOOLEAN,
    "resolutionSummary" TEXT,
    "resolvedAt" DATETIME,
    "citizenSatisfaction" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "auditLog" TEXT
);

-- CreateTable
CREATE TABLE "OmbudsmanRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "mdaId" TEXT NOT NULL,
    "mdaName" TEXT NOT NULL,
    "recommendationText" TEXT NOT NULL,
    "deadlineDays" INTEGER NOT NULL DEFAULT 30,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mdaResponded" BOOLEAN NOT NULL DEFAULT false,
    "mdaResponseText" TEXT,
    "mdaResponseAt" DATETIME,
    "isCompliant" BOOLEAN,
    "escalatedToMinister" BOOLEAN NOT NULL DEFAULT false,
    "escalatedToAssembly" BOOLEAN NOT NULL DEFAULT false,
    "escalatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "OmbudsmanAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "details" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "OmbudsmanCase_caseNumber_key" ON "OmbudsmanCase"("caseNumber");

-- CreateIndex
CREATE INDEX "OmbudsmanCase_caseNumber_idx" ON "OmbudsmanCase"("caseNumber");

-- CreateIndex
CREATE INDEX "OmbudsmanCase_status_idx" ON "OmbudsmanCase"("status");

-- CreateIndex
CREATE INDEX "OmbudsmanCase_mdaId_idx" ON "OmbudsmanCase"("mdaId");

-- CreateIndex
CREATE INDEX "OmbudsmanCase_createdAt_idx" ON "OmbudsmanCase"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OmbudsmanRecommendation_caseId_key" ON "OmbudsmanRecommendation"("caseId");

-- CreateIndex
CREATE INDEX "OmbudsmanRecommendation_caseId_idx" ON "OmbudsmanRecommendation"("caseId");

-- CreateIndex
CREATE INDEX "OmbudsmanRecommendation_mdaId_idx" ON "OmbudsmanRecommendation"("mdaId");

-- CreateIndex
CREATE INDEX "OmbudsmanRecommendation_isCompliant_idx" ON "OmbudsmanRecommendation"("isCompliant");

-- CreateIndex
CREATE INDEX "OmbudsmanAuditLog_caseId_idx" ON "OmbudsmanAuditLog"("caseId");

-- CreateIndex
CREATE INDEX "OmbudsmanAuditLog_timestamp_idx" ON "OmbudsmanAuditLog"("timestamp");
