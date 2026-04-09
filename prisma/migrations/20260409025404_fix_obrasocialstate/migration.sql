-- CreateEnum
CREATE TYPE "estadoObraSocial" AS ENUM ('ACTIVA', 'INACTIVA');

-- AlterTable
ALTER TABLE "ObraSocial" ADD COLUMN     "estado" "estadoObraSocial" NOT NULL DEFAULT 'ACTIVA';
