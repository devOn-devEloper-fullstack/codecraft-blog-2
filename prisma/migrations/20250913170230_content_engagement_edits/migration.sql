-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PUBLISHED', 'HIDDEN', 'DELETED');

-- CreateTable
CREATE TABLE "PostStats" (
    "postId" UUID NOT NULL,
    "viewCount" BIGINT NOT NULL DEFAULT 0,
    "likeCount" BIGINT NOT NULL DEFAULT 0,
    "commentCount" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "PostStats_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "id" TEXT NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostViewEvent" (
    "id" TEXT NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID,
    "anonHash" TEXT,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tVisibleMs" INTEGER,
    "scrollPercent" DOUBLE PRECISION,
    "uaHash" TEXT,
    "ipHash" TEXT,

    CONSTRAINT "PostViewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostViewAgg" (
    "id" TEXT NOT NULL,
    "postId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "bucket" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "uniques" INTEGER NOT NULL,

    CONSTRAINT "PostViewAgg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "postId" UUID NOT NULL,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "rootId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostLike_userId_createdAt_idx" ON "PostLike"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PostLike_postId_createdAt_idx" ON "PostLike"("postId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_postId_userId_key" ON "PostLike"("postId", "userId");

-- CreateIndex
CREATE INDEX "PostViewEvent_postId_ts_idx" ON "PostViewEvent"("postId", "ts");

-- CreateIndex
CREATE UNIQUE INDEX "PostViewAgg_postId_date_bucket_key" ON "PostViewAgg"("postId", "date", "bucket");

-- CreateIndex
CREATE INDEX "Comment_postId_createdAt_idx" ON "Comment"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_rootId_createdAt_idx" ON "Comment"("rootId", "createdAt");

-- AddForeignKey
ALTER TABLE "PostStats" ADD CONSTRAINT "PostStats_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostViewEvent" ADD CONSTRAINT "PostViewEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostViewAgg" ADD CONSTRAINT "PostViewAgg_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
