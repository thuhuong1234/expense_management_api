/*
  Warnings:

  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `todos` DROP FOREIGN KEY `todos_user_fkey`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `todos` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user`,
    ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
