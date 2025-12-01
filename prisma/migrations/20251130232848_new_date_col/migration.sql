/*
  Warnings:

  - Added the required column `dateCreated` to the `usertasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."usertasks" ADD COLUMN "dateCreated" DATE;

UPDATE "public"."usertasks" SET "dateCreated" = DATE("startTime")
