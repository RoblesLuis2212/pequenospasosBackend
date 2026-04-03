import { prisma } from "../server/prisma.js";

export const agregarPaciente = async (req, res) => {
  try {
    const nuevoPaciente = await prisma.paciente.create({
      data: req.body,
    });
    res
      .status(201)
      .json({
        mensaje: "Paciente agregado exitosamente",
        paciente: nuevoPaciente,
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al agregar el paciente" });
  }
};
