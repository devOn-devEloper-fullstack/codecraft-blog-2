/*
  Warnings:

  - You are about to drop the `ModerationEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCESSFUL', 'FAILED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'CLAIMED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "DecisionOutcome" AS ENUM ('APPROVE', 'REJECT', 'ESCALATE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PostStatus" ADD VALUE 'PENDING_AUTO';
ALTER TYPE "PostStatus" ADD VALUE 'PENDING_HUMAN';

-- DropForeignKey
ALTER TABLE "ModerationEvent" DROP CONSTRAINT "ModerationEvent_actorId_fkey";

-- DropForeignKey
ALTER TABLE "ModerationEvent" DROP CONSTRAINT "ModerationEvent_postId_fkey";

-- AlterTable
ALTER TABLE "Revision" ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "ModerationEvent";

-- DropEnum
DROP TYPE "ModerationAction";

-- CreateTable
CREATE TABLE "ModerationJob" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" UUID NOT NULL,
    "postVersion" INTEGER NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "providerModel" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "result" JSONB,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModerationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewTask" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" UUID NOT NULL,
    "postVersion" INTEGER NOT NULL,
    "assigneeId" TEXT,
    "reason" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" UUID NOT NULL,
    "postVersion" INTEGER NOT NULL,
    "decidedBy" TEXT NOT NULL,
    "outcome" "DecisionOutcome" NOT NULL,
    "rationale" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModerationJob_idempotencyKey_key" ON "ModerationJob"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ModerationJob_postId_postVersion_idx" ON "ModerationJob"("postId", "postVersion");

-- CreateIndex
CREATE UNIQUE INDEX "ModerationJob_postId_postVersion_key" ON "ModerationJob"("postId", "postVersion");

-- CreateIndex
CREATE INDEX "ReviewTask_status_createdAt_idx" ON "ReviewTask"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewTask_postId_postVersion_key" ON "ReviewTask"("postId", "postVersion");

-- CreateIndex
CREATE INDEX "Decision_postId_postVersion_idx" ON "Decision"("postId", "postVersion");

-- AddForeignKey
ALTER TABLE "ModerationJob" ADD CONSTRAINT "ModerationJob_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewTask" ADD CONSTRAINT "ReviewTask_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
