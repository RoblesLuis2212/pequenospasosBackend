/*
  Warnings:

  - You are about to drop the column `pacienteId` on the `DatosEscolares` table. All the data in the column will be lost.
  - You are about to drop the column `pacienteId` on the `ObraSocial` table. All the data in the column will be lost.
  - Added the required column `pacienteIdPaciente` to the `DatosEscolares` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DatosEscolares" DROP CONSTRAINT "DatosEscolares_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "ObraSocial" DROP CONSTRAINT "ObraSocial_pacienteId_fkey";

-- AlterTable
ALTER TABLE "DatosEscolares" DROP COLUMN "pacienteId",
ADD COLUMN     "pacienteIdPaciente" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ObraSocial" DROP COLUMN "pacienteId";

-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "obraSocialId" INTEGER;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_obraSocialId_fkey" FOREIGN KEY ("obraSocialId") REFERENCES "ObraSocial"("idObraSocial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatosEscolares" ADD CONSTRAINT "DatosEscolares_pacienteIdPaciente_fkey" FOREIGN KEY ("pacienteIdPaciente") REFERENCES "Paciente"("idPaciente") ON DELETE RESTRICT ON UPDATE CASCADE;
