-- CreateTable
CREATE TABLE "LinkSummaryTranslation" (
    "id" SERIAL NOT NULL,
    "linkSummaryId" INTEGER NOT NULL,
    "BCP47" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "linkSummary" TEXT NOT NULL,

    CONSTRAINT "LinkSummaryTranslation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LinkSummaryTranslation" ADD CONSTRAINT "LinkSummaryTranslation_linkSummaryId_fkey" FOREIGN KEY ("linkSummaryId") REFERENCES "LinkSummary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
