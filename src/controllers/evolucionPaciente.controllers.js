import { prisma } from "../server/prisma.js";

export const agregarEvolucion = async (req, res) => {
  try {
    const { descripcion, fecha } = req.body;
    const { id } = req.params;

    const paciente = await prisma.paciente.findUnique({
      where: { idPaciente: Number(id) },
    });

    if (!paciente) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    const evolucion = await prisma.evolucionPaciente.create({
      data: {
        descripcion,
        fecha: new Date(),
        pacienteId: Number(id),
      },
    });

    res
      .status(201)
      .json({ mensaje: "Evolucion del paciente registrada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al agregar la evolucion del paciente",
    });
  }
};

export const listarEvolucionPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const evolucionPaciente = await prisma.evolucionPaciente.findMany({
      where: { pacienteId: Number(id) },
    });

    if (!evolucionPaciente) {
      return res
        .status(404)
        .json("No hay registros de la evolucion del paciente");
    }
    res.status(200).json(evolucionPaciente);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al listar la evolucion del paciente",
    });
  }
};

export const editarEvolucionPaciente = async (req, res) => {
  try {
    const { descripcion } = req.body;
    const { id } = req.params;

    const evolucionPaciente = await prisma.evolucionPaciente.findUnique({
      where: { idEvolucion: Number(id) },
    });

    if (!evolucionPaciente) {
      return res
        .status(404)
        .json({ mensaje: "La evolucion registrada del paciente no existe" });
    }

    const evolucionActualizada = await prisma.evolucionPaciente.update({
      where: { idEvolucion: Number(id) },
      data: {
        descripcion,
      },
    });

    res
      .status(200)
      .json({ mensaje: "Evolucion del paciente actualizada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al editar la evolucion del paciente",
    });
  }
};
