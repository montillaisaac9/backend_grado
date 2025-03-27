/*
  Warnings:

  - You are about to drop the `_DishStats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dishId` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DishStats" DROP CONSTRAINT "_DishStats_A_fkey";

-- DropForeignKey
ALTER TABLE "_DishStats" DROP CONSTRAINT "_DishStats_B_fkey";

-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "dishId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_DishStats";

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
