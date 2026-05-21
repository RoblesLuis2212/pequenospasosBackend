import { prisma } from "../server/prisma.js";

export const agregarDatosEscolares = async (req, res) => {
  try {
    const { escuela, turno } = req.body;
    const { id } = req.params;

    const paciente = await prisma.paciente.findUnique({
      where: { idPaciente: Number(id) },
    });

    if (!paciente) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    const datosEscolares = await prisma.datosEscolares.create({
      data: {
        escuela,
        turno,
        pacienteIdPaciente: Number(id),
      },
    });
    res
      .status(201)
      .json({ mensaje: "Datos escolares agregados correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al agregar datos escolares del paciente",
    });
  }
};

export const listarDatosEscolaresPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const datosPaciente = await prisma.datosEscolares.findUnique({
      where: { pacienteIdPaciente: Number(id) },
    });

    if (!datosPaciente) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    res.status(200).json(datosPaciente);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al listar los datos escolares del paciente",
    });
  }
};
