/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `Stats` table. All the data in the column will be lost.
  - You are about to drop the column `totalDish` on the `Stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "dayOfWeek",
DROP COLUMN "totalDish";
