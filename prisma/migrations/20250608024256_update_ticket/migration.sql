/*
  Warnings:

  - You are about to alter the column `price_per_hour` on the `fishing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - A unique constraint covering the columns `[ticket_code]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `fishing` MODIFY `price_per_hour` DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE `tickets` MODIFY `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tickets_ticket_code_key` ON `tickets`(`ticket_code`);
