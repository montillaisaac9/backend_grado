/*
  Warnings:

  - You are about to drop the `Survey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_userId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyAnswer" DROP CONSTRAINT "SurveyAnswer_dishId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyAnswer" DROP CONSTRAINT "SurveyAnswer_surveyId_fkey";

-- DropTable
DROP TABLE "Survey";

-- DropTable
DROP TABLE "SurveyAnswer";
