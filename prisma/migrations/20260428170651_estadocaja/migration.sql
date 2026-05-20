-- CreateEnum
CREATE TYPE "EstadoCaja" AS ENUM ('ABIERTA', 'CERRADA');

-- AlterTable
ALTER TABLE "Caja" ADD COLUMN     "estado" "EstadoCaja" NOT NULL DEFAULT 'ABIERTA';
