/*
  Warnings:

  - The primary key for the `Newsletter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `region` on the `Newsletter` table. All the data in the column will be lost.
  - The primary key for the `NewsletterContent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `curatedNewsletterId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `locale` on the `Subscription` table. All the data in the column will be lost.
  - The primary key for the `Summary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `webAuthnChallenge` on the `User` table. All the data in the column will be lost.
  - Added the required column `locale` to the `Newsletter` table without a default value. This is not possible if the table is not empty.
  - Made the column `newsletterId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserCredential" DROP CONSTRAINT "UserCredential_userId_fkey";

-- DropIndex
DROP INDEX "User_webAuthnChallenge_key";

-- AlterTable
ALTER TABLE "Newsletter" DROP CONSTRAINT "Newsletter_pkey",
DROP COLUMN "region",
ADD COLUMN     "locale" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Newsletter_id_seq";

-- AlterTable
ALTER TABLE "NewsletterContent" DROP CONSTRAINT "NewsletterContent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "newsletterId" SET DATA TYPE TEXT,
ALTER COLUMN "summaryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "NewsletterContent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "NewsletterContent_id_seq";

-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "curatedNewsletterId",
DROP COLUMN "locale",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "newsletterId" SET NOT NULL,
ALTER COLUMN "newsletterId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Subscription_id_seq";

-- AlterTable
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Summary_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Summary_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "webAuthnChallenge",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UserCredential" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UserCredential" ADD CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
