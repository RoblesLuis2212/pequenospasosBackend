/*
  Warnings:

  - You are about to drop the column `domicilo` on the `Paciente` table. All the data in the column will be lost.
  - Added the required column `domicilio` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "domicilo",
ADD COLUMN     "domicilio" TEXT NOT NULL;
