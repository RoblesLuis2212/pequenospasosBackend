/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Turno` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Turno" DROP CONSTRAINT "Turno_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Turno" DROP COLUMN "usuarioId",
ADD COLUMN     "usuarioIdUsuario" INTEGER;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_usuarioIdUsuario_fkey" FOREIGN KEY ("usuarioIdUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;
