/*
  Warnings:

  - Added the required column `tipoVenta` to the `Ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Ventas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoVenta" AS ENUM ('PRODUCTO', 'CONSULTA');

-- AlterTable
ALTER TABLE "Ventas" ADD COLUMN     "tipoVenta" "TipoVenta" NOT NULL,
ADD COLUMN     "turnoId" INTEGER,
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("idTurno") ON DELETE SET NULL ON UPDATE CASCADE;
