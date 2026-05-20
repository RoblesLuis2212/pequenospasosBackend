import { prisma } from "../server/prisma.js";

export const crearFichaPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const {
      edadCamino,
      socializacion,
      derivacion,
      horarios_sueño,
      contacto_visual,
      actividades,
    } = req.body;

    const nuevaFicha = await prisma.fichaMedica.create({
      data: {
        edad_camino,
        socializacion,
        derivacion,
        horarios_sueño,
        contacto_visual,
        actividades,
        pacienteId: Number(pacienteId),
      },
    });

    res
      .status(201)
      .json({ mensaje: "Ficha medica del paciente creada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al crear la ficha medica del paciente",
    });
  }
};
