-- AlterTable
ALTER TABLE `categories` ADD COLUMN `category_type` ENUM('Expense', 'Income') NOT NULL DEFAULT 'Expense';
