/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserInfo` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `UserInfo` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "createdAt",
DROP COLUMN "lastLogin",
DROP COLUMN "updatedAt";
