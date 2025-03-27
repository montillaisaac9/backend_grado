/*
  Warnings:

  - Added the required column `dayOfWeek` to the `Stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDish` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "dishId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "dayOfWeek" TEXT NOT NULL,
ADD COLUMN     "totalDish" INTEGER NOT NULL;
