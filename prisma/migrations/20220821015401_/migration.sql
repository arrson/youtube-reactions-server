/*
  Warnings:

  - The primary key for the `Reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reaction_id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `video_id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reactionId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reactionId` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_reaction_id_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_video_id_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_creator_id_fkey";

-- DropIndex
DROP INDEX "Reaction_reaction_id_key";

-- AlterTable
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_pkey",
DROP COLUMN "reaction_id",
DROP COLUMN "video_id",
ADD COLUMN     "reactionId" TEXT NOT NULL,
ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "videoId" TEXT NOT NULL,
ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("reactionId");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "creator_id",
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_reactionId_key" ON "Reaction"("reactionId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
