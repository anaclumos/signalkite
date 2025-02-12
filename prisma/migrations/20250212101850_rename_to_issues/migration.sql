/*
  Warnings:

  - You are about to drop the column `newsId` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the `News` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `issueId` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_runId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_newsId_fkey";

-- DropIndex
DROP INDEX "Story_newsId_createdAt_idx";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "newsId",
ADD COLUMN     "issueId" TEXT NOT NULL;

-- DropTable
DROP TABLE "News";

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "runId" TEXT,
    "successful" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Issue_reporterId_idx" ON "Issue"("reporterId");

-- CreateIndex
CREATE INDEX "Story_issueId_createdAt_idx" ON "Story"("issueId", "createdAt");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Reporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE SET NULL ON UPDATE CASCADE;
