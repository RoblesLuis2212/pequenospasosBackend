-- AlterEnum
ALTER TYPE "EstadoCarrito" ADD VALUE 'PENDIENTE';

-- DropForeignKey
ALTER TABLE "Ventas" DROP CONSTRAINT "Ventas_cajaId_fkey";

-- DropForeignKey
ALTER TABLE "Ventas" DROP CONSTRAINT "Ventas_metodoPagoId_fkey";

-- AlterTable
ALTER TABLE "Ventas" ALTER COLUMN "metodoPagoId" DROP NOT NULL,
ALTER COLUMN "cajaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "MetodoPago"("idMetodoPago") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "Caja"("idCaja") ON DELETE SET NULL ON UPDATE CASCADE;
