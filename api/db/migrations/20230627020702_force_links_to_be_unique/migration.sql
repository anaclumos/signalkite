/*
  Warnings:

  - A unique constraint covering the columns `[linkUrl]` on the table `LinkSummary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LinkSummary_linkUrl_key" ON "LinkSummary"("linkUrl");
