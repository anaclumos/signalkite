/*
  Warnings:

  - You are about to drop the column `summaryId` on the `NewsletterContent` table. All the data in the column will be lost.
  - Added the required column `region` to the `Newsletter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summaryLink` to the `NewsletterContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Newsletter" ADD COLUMN     "region" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NewsletterContent" DROP COLUMN "summaryId",
ADD COLUMN     "summaryLink" TEXT NOT NULL;
