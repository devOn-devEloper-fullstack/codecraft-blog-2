-- CreateTable
CREATE TABLE "PostPictures" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bucket" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "region" TEXT,
    "etag" TEXT,
    "checksum" TEXT,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "placeholder" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "indexInHtml" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostPictures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostPictures_postId_idx" ON "PostPictures"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostPictures_postId_placeholder_key" ON "PostPictures"("postId", "placeholder");

-- AddForeignKey
ALTER TABLE "PostPictures" ADD CONSTRAINT "PostPictures_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPictures" ADD CONSTRAINT "PostPictures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
