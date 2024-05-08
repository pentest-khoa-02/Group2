/*
  Warnings:

  - A unique constraint covering the columns `[status]` on the table `VulnSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VulnSetting" ALTER COLUMN "status" SET DEFAULT 'No',
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VulnSetting_status_key" ON "VulnSetting"("status");
