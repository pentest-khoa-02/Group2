/*
  Warnings:

  - Added the required column `lockUntil` to the `FailLogin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FailLogin" ADD COLUMN     "lockUntil" TIMESTAMP(3) NOT NULL;