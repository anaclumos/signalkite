/*
  Warnings:

  - Added the required column `timezone` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "timezone" VARCHAR(100) NOT NULL;
