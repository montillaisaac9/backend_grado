/*
  Warnings:

  - You are about to drop the column `career` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "career";

-- CreateTable
CREATE TABLE "Career" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCareer" (
    "studentId" INTEGER NOT NULL,
    "careerId" INTEGER NOT NULL,

    CONSTRAINT "StudentCareer_pkey" PRIMARY KEY ("studentId","careerId")
);

-- CreateTable
CREATE TABLE "AdminEmployeeCareer" (
    "adminEmployeeId" INTEGER NOT NULL,
    "careerId" INTEGER NOT NULL,

    CONSTRAINT "AdminEmployeeCareer_pkey" PRIMARY KEY ("adminEmployeeId","careerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Career_name_key" ON "Career"("name");

-- AddForeignKey
ALTER TABLE "StudentCareer" ADD CONSTRAINT "StudentCareer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCareer" ADD CONSTRAINT "StudentCareer_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminEmployeeCareer" ADD CONSTRAINT "AdminEmployeeCareer_adminEmployeeId_fkey" FOREIGN KEY ("adminEmployeeId") REFERENCES "AdminEmployee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminEmployeeCareer" ADD CONSTRAINT "AdminEmployeeCareer_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;
