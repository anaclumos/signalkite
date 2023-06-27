-- AlterTable
CREATE SEQUENCE linksummary_id_seq;
ALTER TABLE "LinkSummary" ALTER COLUMN "id" SET DEFAULT nextval('linksummary_id_seq');
ALTER SEQUENCE linksummary_id_seq OWNED BY "LinkSummary"."id";
