/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `funds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_id]` on the table `funds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `funds_user_id_key` ON `funds`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `funds_room_id_key` ON `funds`(`room_id`);
