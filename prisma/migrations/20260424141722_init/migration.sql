/*
  Warnings:

  - The values [PAGADO] on the enum `EstadoVenta` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoVenta_new" AS ENUM ('PENDIENTE', 'APROBADO', 'RETIRADO', 'CANCELADO');
ALTER TABLE "public"."Ventas" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Ventas" ALTER COLUMN "estado" TYPE "EstadoVenta_new" USING ("estado"::text::"EstadoVenta_new");
ALTER TYPE "EstadoVenta" RENAME TO "EstadoVenta_old";
ALTER TYPE "EstadoVenta_new" RENAME TO "EstadoVenta";
DROP TYPE "public"."EstadoVenta_old";
ALTER TABLE "Ventas" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Paciente" ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Ventas" ADD COLUMN     "carritoId" INTEGER;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "Carrito"("idCarrito") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;
