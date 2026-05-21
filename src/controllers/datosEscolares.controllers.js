import { prisma } from "../server/prisma.js";

export const agregarDatosEscolares = async (req, res) => {
  try {
    const { escuela, turno } = req.body;
    const datosEscolares = await prisma.datosEscolares.create({
      data: {
        escuela,
        turno,
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
