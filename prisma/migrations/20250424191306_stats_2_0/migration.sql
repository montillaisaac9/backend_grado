/*
  Warnings:

  - You are about to drop the column `budgetUsed` on the `Stats` table. All the data in the column will be lost.
  - You are about to drop the column `wastagePercent` on the `Stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "budgetUsed",
DROP COLUMN "wastagePercent";
