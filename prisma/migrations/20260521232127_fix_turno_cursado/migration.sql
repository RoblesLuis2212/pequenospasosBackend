/*
  Warnings:

  - A unique constraint covering the columns `[pacienteIdPaciente]` on the table `DatosEscolares` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DatosEscolares_pacienteIdPaciente_key" ON "DatosEscolares"("pacienteIdPaciente");
