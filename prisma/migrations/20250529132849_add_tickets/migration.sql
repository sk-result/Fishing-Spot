/*
  Warnings:

  - You are about to alter the column `price_per_hour` on the `fishing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to drop the `fish_species` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `fishing` MODIFY `price_per_hour` DECIMAL NOT NULL;

-- DropTable
DROP TABLE `fish_species`;

-- CreateTable
CREATE TABLE `tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_code` VARCHAR(10) NOT NULL,
    `fishing_spot_id` INTEGER NOT NULL,
    `valid_date` DATETIME(3) NOT NULL,
    `status` ENUM('unused', 'used', 'expired') NOT NULL,
    `duration_minutes` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_fishing_spot_id_fkey` FOREIGN KEY (`fishing_spot_id`) REFERENCES `fishing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
