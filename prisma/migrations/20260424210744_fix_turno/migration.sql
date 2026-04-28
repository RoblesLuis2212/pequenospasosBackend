-- DropForeignKey
ALTER TABLE "Turno" DROP CONSTRAINT "Turno_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Turno" ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;
