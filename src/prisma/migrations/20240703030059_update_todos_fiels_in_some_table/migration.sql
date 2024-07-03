/*
  Warnings:

  - You are about to drop the column `category` on the `todos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `todos` DROP FOREIGN KEY `todos_category_fkey`;

-- AlterTable
ALTER TABLE `todos` DROP COLUMN `category`,
    ADD COLUMN `category_id` INTEGER NULL,
    ADD COLUMN `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `todos` ADD CONSTRAINT `todos_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todos` ADD CONSTRAINT `todos_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
