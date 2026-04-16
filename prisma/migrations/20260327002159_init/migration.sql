-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PUBLIC',
    "orgId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "digitalMaturity" INTEGER NOT NULL,
    "score" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Case_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "funder" TEXT NOT NULL,
    "deadline" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "eligibilityScore" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "mouDate" DATETIME,
    "status" TEXT NOT NULL,
    "pageSlug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EnergyUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serial" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "agentId" TEXT,
    "lastCharge" DATETIME,
    "location" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "progress" REAL NOT NULL,
    "managerId" TEXT,
    CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "ownerId" TEXT,
    CONSTRAINT "Idea_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "caption" TEXT,
    "projectId" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessLevel" TEXT NOT NULL,
    CONSTRAINT "MediaItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_pageSlug_key" ON "Partner"("pageSlug");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyUnit_serial_key" ON "EnergyUnit"("serial");
