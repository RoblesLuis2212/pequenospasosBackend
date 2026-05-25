/*
  Warnings:

  - A unique constraint covering the columns `[pacienteId]` on the table `EvolucionPaciente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EvolucionPaciente_pacienteId_key" ON "EvolucionPaciente"("pacienteId");
