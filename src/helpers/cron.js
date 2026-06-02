import cron from "node-cron";
import { prisma } from "../server/prisma.js";

// Ejecuta al iniciar el servidor por si hubo turnos vencidos mientras estuvo apagado
const cancelarTurnosVencidos = async () => {
  const ahora = new Date();
  await prisma.turno.updateMany({
    where: {
      fecha: { lt: ahora },
      estado: { in: ["PENDIENTE", "APROBADO"] },
    },
    data: { estado: "CANCELADO" },
  });
};

cancelarTurnosVencidos();

export default cancelarTurnosVencidos();
