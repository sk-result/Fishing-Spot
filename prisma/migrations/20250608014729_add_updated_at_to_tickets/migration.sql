/*
  Warnings:

  - You are about to alter the column `price_per_hour` on the `fishing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - Added the required column `updated_at` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fishing` MODIFY `price_per_hour` DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
