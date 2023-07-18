/*
  Warnings:

  - You are about to drop the column `summaryLink` on the `NewsletterContent` table. All the data in the column will be lost.
  - Added the required column `summaryId` to the `NewsletterContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewsletterContent" DROP COLUMN "summaryLink",
ADD COLUMN     "summaryId" TEXT NOT NULL;
