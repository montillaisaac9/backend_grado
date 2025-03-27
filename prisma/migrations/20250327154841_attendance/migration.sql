/*
  Warnings:

  - A unique constraint covering the columns `[userId,menuId,dishId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Attendance_userId_menuId_key";

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "dishId" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_menuId_dishId_key" ON "Attendance"("userId", "menuId", "dishId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
