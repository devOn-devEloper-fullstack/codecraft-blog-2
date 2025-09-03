/*
  Warnings:

  - The values [SUBMIT,PUBLISH] on the enum `ModerationAction` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `actorId` on the `ModerationEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'CLOSED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "FlagSource" AS ENUM ('MODEL', 'HUMAN', 'REPORT');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FlagSignal" AS ENUM ('TOXICITY', 'SLUR', 'PII', 'NSFW_IMAGE', 'LINK_POLICY', 'MALWARE_LINK', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "ModerationAction_new" AS ENUM ('APPROVE', 'REJECT', 'REDACT', 'ESCALATE', 'QUARANTINE', 'UNQUARANTINE');
ALTER TABLE "ModerationEvent" ALTER COLUMN "action" TYPE "ModerationAction_new" USING ("action"::text::"ModerationAction_new");
ALTER TYPE "ModerationAction" RENAME TO "ModerationAction_old";
ALTER TYPE "ModerationAction_new" RENAME TO "ModerationAction";
DROP TYPE "ModerationAction_old";
COMMIT;

-- AlterTable
ALTER TABLE "ModerationEvent" ADD COLUMN     "diffPatch" JSONB,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "ruleVersion" INTEGER,
DROP COLUMN "actorId",
ADD COLUMN     "actorId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "editorId" UUID;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'User';

-- CreateTable
CREATE TABLE "Revision" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" UUID NOT NULL,
    "content" JSONB NOT NULL,
    "summary" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentRevisionPostId" UUID,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentFlag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" UUID NOT NULL,
    "revisionId" UUID,
    "signal" "FlagSignal" NOT NULL,
    "score" DOUBLE PRECISION,
    "severity" "Severity" NOT NULL,
    "source" "FlagSource" NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "ContentFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" UUID NOT NULL,
    "reporterId" TEXT,
    "reason" TEXT NOT NULL,
    "evidence" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "handledBy" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorTrustMetric" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "rejectedCount" INTEGER NOT NULL DEFAULT 0,
    "reportedCount" INTEGER NOT NULL DEFAULT 0,
    "humanFlagCount" INTEGER NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAdminTrusted" BOOLEAN NOT NULL DEFAULT false,
    "lastEvaluatedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorTrustMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbuseCounter" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbuseCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Revision_currentRevisionPostId_key" ON "Revision"("currentRevisionPostId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorTrustMetric_userId_key" ON "AuthorTrustMetric"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AbuseCounter_bucket_key" ON "AbuseCounter"("bucket");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_currentRevisionPostId_fkey" FOREIGN KEY ("currentRevisionPostId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFlag" ADD CONSTRAINT "ContentFlag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFlag" ADD CONSTRAINT "ContentFlag_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationEvent" ADD CONSTRAINT "ModerationEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorTrustMetric" ADD CONSTRAINT "AuthorTrustMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
