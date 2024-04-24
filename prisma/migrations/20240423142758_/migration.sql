/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `VulnSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VulnSetting_name_key" ON "VulnSetting"("name");
