/*
  Warnings:

  - You are about to drop the column `balance` on the `rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `rooms` DROP COLUMN `balance`;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `fund_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `funds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `user_id` INTEGER NULL,
    `room_id` INTEGER NULL,
    `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_fund_id_fkey` FOREIGN KEY (`fund_id`) REFERENCES `funds`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `funds` ADD CONSTRAINT `funds_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `funds` ADD CONSTRAINT `funds_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
