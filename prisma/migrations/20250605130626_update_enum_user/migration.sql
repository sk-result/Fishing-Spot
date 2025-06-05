/*
  Warnings:

  - You are about to alter the column `price_per_hour` on the `fishing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.
  - The values [SuperAdmin] on the enum `Users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `fishing` MODIFY `price_per_hour` DECIMAL NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user';
