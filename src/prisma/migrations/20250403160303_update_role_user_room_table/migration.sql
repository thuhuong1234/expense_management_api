/*
  Warnings:

  - The values [Subleader] on the enum `user_rooms_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user_rooms` MODIFY `role` ENUM('Leader', 'Member') NOT NULL DEFAULT 'Member';
