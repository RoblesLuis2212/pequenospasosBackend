import { response } from "express";
import { prisma } from "../server/prisma.js";

export const crearFichaPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      edad_camino,
      socializacion,
      derivacion,
      horarios_sueno,
      contacto_visual,
      actividades,
    } = req.body;

    const nuevaFicha = await prisma.fichaMedica.create({
      data: {
        edad_camino,
        socializacion,
        derivacion,
        horarios_sueno,
        contacto_visual,
        actividades,
        pacienteId: Number(id),
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

export const obtenerFichaPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const fichaPaciente = await prisma.fichaMedica.findUnique({
      where: { pacienteId: Number(id) },
    });

    if (!fichaPaciente) {
      return res
        .status(404)
        .json({ mensaje: "El paciente no posee ficha medica" });
    }

    res.status(200).json(fichaPaciente);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al obtener la ficha medica del paciente",
    });
  }
};

export const editarFichaMedicaPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const fichaPaciente = await prisma.fichaMedica.findUnique({
      where: { pacienteId: Number(id) },
    });

    if (!fichaPaciente) {
      return res
        .status(404)
        .json({ mensaje: "El paciente no posee una ficha medica" });
    }

    const {
      edad_camino,
      socializacion,
      derivacion,
      horarios_sueno,
      contacto_visual,
      actividades,
    } = req.body;

    const fichaActualizada = await prisma.fichaMedica.update({
      where: { pacienteId: Number(id) },
      data: {
        edad_camino,
        socializacion,
        derivacion,
        horarios_sueno,
        contacto_visual,
        actividades,
      },
    });

    res
      .status(200)
      .json({ mensaje: "Ficha medica del paciente actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al editar la ficha medica del paciente",
    });
  }
};
