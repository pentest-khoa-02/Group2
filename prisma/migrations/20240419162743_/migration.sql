/*
  Warnings:

  - You are about to drop the column `hasher` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `passwordSalt` on the `Credential` table. All the data in the column will be lost.
  - Added the required column `email` to the `Credential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "hasher",
DROP COLUMN "passwordHash",
DROP COLUMN "passwordSalt",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
