-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "estado" "EstadoUsuario" NOT NULL DEFAULT 'ACTIVO';
