/*
  Warnings:

  - You are about to drop the column `statsId` on the `DishRating` table. All the data in the column will be lost.
  - You are about to drop the column `avgDishRating` on the `Stats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,dishId]` on the table `DishRating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dayOfWeek` to the `Stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDish` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DishRating" DROP CONSTRAINT "DishRating_statsId_fkey";

-- DropIndex
DROP INDEX "DishRating_userId_dishId_statsId_key";

-- AlterTable
ALTER TABLE "DishRating" DROP COLUMN "statsId";

-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "avgDishRating",
ADD COLUMN     "dayOfWeek" TEXT NOT NULL,
ADD COLUMN     "totalDish" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DishRating_userId_dishId_key" ON "DishRating"("userId", "dishId");
