CREATE TABLE "TransferInstructionRecord" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "organisationHint" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TransferInstructionRecord_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TransferInstructionRecord_reference_key" ON "TransferInstructionRecord"("reference");

CREATE TABLE "RideOwnerRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RideOwnerRecord_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RideOwnerRecord_userId_key" ON "RideOwnerRecord"("userId");

CREATE TABLE "RideVehicleRecord" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "dailyRateMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "withDriver" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "RideVehicleRecord_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RideVehicleRecord_licensePlate_key" ON "RideVehicleRecord"("licensePlate");

CREATE TABLE "RideBookingRecord" (
    "id" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "transferReference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pickup" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RideBookingRecord_pkey" PRIMARY KEY ("id")
);
