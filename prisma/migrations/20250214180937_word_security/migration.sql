/*
  Warnings:

  - Added the required column `palabra_seguridad` to the `EmpleadoAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `palabra_seguridad` to the `Estudiante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmpleadoAdmin" ADD COLUMN     "palabra_seguridad" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "Estudiante" ADD COLUMN     "palabra_seguridad" VARCHAR(100) NOT NULL;
