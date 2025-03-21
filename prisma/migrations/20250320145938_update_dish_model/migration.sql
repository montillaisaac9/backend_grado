/*
  Warnings:

  - Added the required column `calories` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbohydrates` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fats` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proteins` to the `Dish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dish" ADD COLUMN     "calories" INTEGER NOT NULL,
ADD COLUMN     "carbohydrates" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fats" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "proteins" DOUBLE PRECISION NOT NULL;
