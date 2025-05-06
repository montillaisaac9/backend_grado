/*
  Warnings:

  - You are about to drop the column `fridayId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `mondayId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `thursdayId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `tuesdayId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `wednesdayId` on the `Menu` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_fridayId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_mondayId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_thursdayId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_tuesdayId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_wednesdayId_fkey";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "fridayId",
DROP COLUMN "mondayId",
DROP COLUMN "thursdayId",
DROP COLUMN "tuesdayId",
DROP COLUMN "wednesdayId";

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weekDay" "WeekDay" NOT NULL,
    "menuId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MenuItem_weekDay_idx" ON "MenuItem"("weekDay");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_menuId_date_key" ON "MenuItem"("menuId", "date");

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
