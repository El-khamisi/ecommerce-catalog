/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "attributes" JSONB,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
