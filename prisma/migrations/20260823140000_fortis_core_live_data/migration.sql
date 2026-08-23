CREATE TYPE "FreshnessState" AS ENUM ('REAL_TIME', 'CURRENT', 'PERIODIC_OFFICIAL', 'VERIFIED_SNAPSHOT', 'STALE', 'UNAVAILABLE');

CREATE TABLE "SourceDefinition" (
    "id" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "licence" TEXT NOT NULL,
    "attribution" TEXT NOT NULL,
    "cadence" TEXT NOT NULL,
    "adapterVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SourceDefinition_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SourceDefinition_sourceKey_key" ON "SourceDefinition"("sourceKey");

CREATE TABLE "SourceAdapterRun" (
    "id" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "error" TEXT,
    "recordsIngested" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SourceAdapterRun_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "SourceAdapterRun" ADD CONSTRAINT "SourceAdapterRun_sourceKey_fkey" FOREIGN KEY ("sourceKey") REFERENCES "SourceDefinition"("sourceKey") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "RawSourceObject" (
    "id" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "sourceRecordId" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RawSourceObject_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RawSourceObject_checksum_key" ON "RawSourceObject"("checksum");

CREATE TABLE "CanonicalDataset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "CanonicalDataset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CanonicalDataset_key_key" ON "CanonicalDataset"("key");

CREATE TABLE "CanonicalRecordVersion" (
    "id" TEXT NOT NULL,
    "datasetKey" TEXT NOT NULL,
    "indicatorKey" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "freshness" "FreshnessState" NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "retrievedAt" TIMESTAMP(3) NOT NULL,
    "adapterVersion" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "sourceRecordId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "supersededById" TEXT,
    CONSTRAINT "CanonicalRecordVersion_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CanonicalRecordVersion_datasetKey_indicatorKey_idx" ON "CanonicalRecordVersion"("datasetKey", "indicatorKey");

CREATE TABLE "ProvenanceRecord" (
    "id" TEXT NOT NULL,
    "recordVersionId" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "licence" TEXT NOT NULL,
    "attribution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProvenanceRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DataQualityIssue" (
    "id" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DataQualityIssue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EditorialReview" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "reviewer" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "notes" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EditorialReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");
