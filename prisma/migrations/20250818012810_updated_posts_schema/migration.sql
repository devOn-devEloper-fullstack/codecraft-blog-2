/*
  Warnings:

  - You are about to drop the column `activeStatus` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `postBody` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `contentHtml` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedAt` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "activeStatus",
DROP COLUMN "postBody",
ADD COLUMN     "contentHtml" TEXT NOT NULL,
ADD COLUMN     "contentJson" JSONB,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
