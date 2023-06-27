/*
  Warnings:

  - A unique constraint covering the columns `[publicNewsletterHandle]` on the table `CuratedNewsletter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicNewsletterHandle]` on the table `CustomNewsletter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CuratedNewsletter_publicNewsletterHandle_key" ON "CuratedNewsletter"("publicNewsletterHandle");

-- CreateIndex
CREATE UNIQUE INDEX "CustomNewsletter_publicNewsletterHandle_key" ON "CustomNewsletter"("publicNewsletterHandle");
