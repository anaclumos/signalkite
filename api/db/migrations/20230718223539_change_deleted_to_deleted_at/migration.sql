/*
  Warnings:

  - You are about to drop the column `deleted` on the `Newsletter` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `NewsletterContent` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `UserCredential` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Newsletter" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "NewsletterContent" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserCredential" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
