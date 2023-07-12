/*
  Warnings:

  - You are about to drop the column `commentSummary` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `originSummary` on the `Summary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[originLink,summaryLocale]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originLink` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "commentSummary",
DROP COLUMN "origin",
DROP COLUMN "originSummary",
ADD COLUMN     "originLink" TEXT NOT NULL,
ADD COLUMN     "summaryComment" TEXT,
ADD COLUMN     "summaryLocale" TEXT,
ADD COLUMN     "summaryOrigin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Summary_originLink_summaryLocale_key" ON "Summary"("originLink", "summaryLocale");
