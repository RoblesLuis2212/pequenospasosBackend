/*
  Warnings:

  - You are about to drop the column `horarios_sueño` on the `FichaMedica` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FichaMedica" DROP COLUMN "horarios_sueño",
ADD COLUMN     "horarios_sueno" TEXT;
