-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "vendorId" DROP NOT NULL,
ALTER COLUMN "voucherId" DROP NOT NULL,
ALTER COLUMN "discountType" DROP NOT NULL,
ALTER COLUMN "discountValue" DROP NOT NULL;
