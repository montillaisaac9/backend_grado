/*
  Warnings:

  - You are about to drop the column `diaSemana` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `platoId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the `Asistencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comentario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmpleadoAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Estudiante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plato` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dishId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_estudianteId_fkey";

-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_estudianteId_fkey";

-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_platoId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_platoId_fkey";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "diaSemana",
DROP COLUMN "fecha",
DROP COLUMN "hora",
DROP COLUMN "platoId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dayOfWeek" TEXT NOT NULL,
ADD COLUMN     "dishId" INTEGER NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Asistencia";

-- DropTable
DROP TABLE "Comentario";

-- DropTable
DROP TABLE "EmpleadoAdmin";

-- DropTable
DROP TABLE "Estudiante";

-- DropTable
DROP TABLE "Plato";

-- CreateTable
CREATE TABLE "AdminEmployee" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "securityWord" VARCHAR(100) NOT NULL,
    "identification" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "AdminEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT,
    "securityWord" VARCHAR(100) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ratingPercentage" DOUBLE PRECISION,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "photo" TEXT,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmployee_email_key" ON "AdminEmployee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmployee_identification_key" ON "AdminEmployee"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_identification_key" ON "Student"("identification");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
