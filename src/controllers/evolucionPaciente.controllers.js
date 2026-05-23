import { prisma } from "../server/prisma.js";

export const agregarEvolucion = async (req, res) => {
  try {
    const { descripcion, fecha } = req.body;
    const { id } = req.params;

    const paciente = await prisma.paciente.findUnique({
      // where: {pacienteId: }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al agregar la evolucion del paciente",
    });
  }
};
