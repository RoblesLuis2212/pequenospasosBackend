/*
  Warnings:

  - A unique constraint covering the columns `[pacienteId]` on the table `FichaMedica` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FichaMedica_pacienteId_key" ON "FichaMedica"("pacienteId");
