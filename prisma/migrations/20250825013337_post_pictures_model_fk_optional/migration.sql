-- DropForeignKey
ALTER TABLE "PostPictures" DROP CONSTRAINT "PostPictures_postId_fkey";

-- AlterTable
ALTER TABLE "PostPictures" ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PostPictures" ADD CONSTRAINT "PostPictures_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
