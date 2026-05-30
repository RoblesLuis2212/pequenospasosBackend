/*
  Warnings:

  - You are about to drop the `SaldoPaciente` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SaldoPaciente" DROP CONSTRAINT "SaldoPaciente_pacienteId_fkey";

-- DropTable
DROP TABLE "SaldoPaciente";

-- DropEnum
DROP TYPE "TipoMovimientoSaldo";
