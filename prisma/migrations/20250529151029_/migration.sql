/*
  Warnings:

  - You are about to alter the column `price_per_hour` on the `fishing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - You are about to drop the column `duration_used` on the `ticket_usages` table. All the data in the column will be lost.
  - You are about to drop the column `spot_used_id` on the `ticket_usages` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_id` on the `ticket_usages` table. All the data in the column will be lost.
  - You are about to drop the column `used_at` on the `ticket_usages` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ticket_usages` table. All the data in the column will be lost.
  - Added the required column `durationUsed` to the `ticket_usages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fishingSpotId` to the `ticket_usages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketId` to the `ticket_usages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usedAt` to the `ticket_usages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ticket_usages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ticket_usages` DROP FOREIGN KEY `ticket_usages_spot_used_id_fkey`;

-- DropForeignKey
ALTER TABLE `ticket_usages` DROP FOREIGN KEY `ticket_usages_ticket_id_fkey`;

-- DropForeignKey
ALTER TABLE `ticket_usages` DROP FOREIGN KEY `ticket_usages_user_id_fkey`;

-- DropIndex
DROP INDEX `ticket_usages_spot_used_id_fkey` ON `ticket_usages`;

-- DropIndex
DROP INDEX `ticket_usages_ticket_id_fkey` ON `ticket_usages`;

-- DropIndex
DROP INDEX `ticket_usages_user_id_fkey` ON `ticket_usages`;

-- AlterTable
ALTER TABLE `fishing` MODIFY `price_per_hour` DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE `ticket_usages` DROP COLUMN `duration_used`,
    DROP COLUMN `spot_used_id`,
    DROP COLUMN `ticket_id`,
    DROP COLUMN `used_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `durationUsed` INTEGER NOT NULL,
    ADD COLUMN `fishingSpotId` INTEGER NOT NULL,
    ADD COLUMN `ticketId` INTEGER NOT NULL,
    ADD COLUMN `usedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ticket_usages` ADD CONSTRAINT `ticket_usages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_usages` ADD CONSTRAINT `ticket_usages_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_usages` ADD CONSTRAINT `ticket_usages_fishingSpotId_fkey` FOREIGN KEY (`fishingSpotId`) REFERENCES `fishing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
