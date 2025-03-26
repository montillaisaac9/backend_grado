/*
  Warnings:

  - You are about to drop the column `date` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fridayId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mondayId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thursdayId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tuesdayId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wednesdayId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekEnd` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekStart` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_dishId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_menuId_fkey";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "date",
ADD COLUMN     "fridayId" INTEGER NOT NULL,
ADD COLUMN     "mondayId" INTEGER NOT NULL,
ADD COLUMN     "thursdayId" INTEGER NOT NULL,
ADD COLUMN     "tuesdayId" INTEGER NOT NULL,
ADD COLUMN     "wednesdayId" INTEGER NOT NULL,
ADD COLUMN     "weekEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weekStart" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "MenuItem";

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_mondayId_fkey" FOREIGN KEY ("mondayId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_tuesdayId_fkey" FOREIGN KEY ("tuesdayId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_wednesdayId_fkey" FOREIGN KEY ("wednesdayId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_thursdayId_fkey" FOREIGN KEY ("thursdayId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_fridayId_fkey" FOREIGN KEY ("fridayId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
