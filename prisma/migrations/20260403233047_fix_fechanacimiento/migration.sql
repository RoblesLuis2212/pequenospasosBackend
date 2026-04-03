/*
  Warnings:

  - Added the required column `fechaNacimiento` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "fechaNacimiento" TIMESTAMP(3) NOT NULL;
