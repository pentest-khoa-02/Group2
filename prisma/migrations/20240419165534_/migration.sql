/*
  Warnings:

  - You are about to drop the column `activated` on the `VulnSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VulnSetting" DROP COLUMN "activated",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;
