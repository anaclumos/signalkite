/*
  Warnings:

  - You are about to drop the column `customNewsletterId` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `customNewsletterId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CuratedNewsletter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomNewsletter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_curatedNewsletterId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_customNewsletterId_fkey";

-- DropForeignKey
ALTER TABLE "ContentLinkSummary" DROP CONSTRAINT "ContentLinkSummary_contentId_fkey";

-- DropForeignKey
ALTER TABLE "ContentLinkSummary" DROP CONSTRAINT "ContentLinkSummary_linkSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "CuratedNewsletter" DROP CONSTRAINT "CuratedNewsletter_userId_fkey";

-- DropForeignKey
ALTER TABLE "CustomNewsletter" DROP CONSTRAINT "CustomNewsletter_userId_fkey";

-- DropForeignKey
ALTER TABLE "LinkSummaryTranslation" DROP CONSTRAINT "LinkSummaryTranslation_linkSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "Outbox" DROP CONSTRAINT "Outbox_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Outbox" DROP CONSTRAINT "Outbox_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_curatedNewsletterId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_customNewsletterId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "customNewsletterId",
ADD COLUMN     "newsletterId" INTEGER;

-- AlterTable
ALTER TABLE "LinkSummary" ADD COLUMN     "downloadMethod" TEXT,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "customNewsletterId",
ADD COLUMN     "newsletterId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "password",
ADD COLUMN     "loginToken" TEXT,
ADD COLUMN     "loginTokenExpiresAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "CuratedNewsletter";

-- DropTable
DROP TABLE "CustomNewsletter";

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" SERIAL NOT NULL,
    "publicNewsletterHandle" TEXT NOT NULL,
    "newsletterName" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "targetRegion" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_publicNewsletterHandle_key" ON "Newsletter"("publicNewsletterHandle");
