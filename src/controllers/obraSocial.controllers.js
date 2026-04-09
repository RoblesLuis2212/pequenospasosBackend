import { response } from "express";
import { prisma } from "../server/prisma.js";

export const agregarObraSocial = async (req, res) => {
  try {
    const nuevaObraSocial = await prisma.obraSocial.create({
      data: req.body,
    });
    res.status(201).json({
      mensaje: "Obra social agregada correctamente",
      obraSocial: nuevaObraSocial,
    });
  } catch (err) {
    console.error(err);
    resizeBy
      .status(500)
      .json({ mensaje: "Ocurrio un error al agregar la obra social" });
  }
};

export const listarObrasSociales = async (req, res) => {
  try {
    const obrasSociales = await prisma.obraSocial.findMany();

    if (!obrasSociales) {
      return res
        .status(401)
        .json({ mensaje: "No hay obras sociales para mostrar" });
    }
    res.status(200).json(obrasSociales);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al obtener la lista de obras sociales",
    });
  }
};

export const editarObraSocial = async (req, res) => {
  try {
    const obraSocial = await prisma.obraSocial.update({
      where: { idObraSocial: Number(req.params.id) },
      data: req.body,
    });

    if (!obraSocial) {
      return res.status(401).json({ mensaje: "Obra social no encontrada" });
    }

    res.status(200).json(obraSocial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error editar la obra social" });
  }
};

export const cambiarEstadoObraSocial = async (req, res) => {
  try {
    const obraSocial = await prisma.obraSocial.findUnique({
      where: { idObraSocial: Number(req.params.id) },
    });

    if (!obraSocial) {
      return res.status(401).json({ mensaje: "Obra social no encontrada" });
    }

    const nuevoEstado = obraSocial.estado === "ACTIVA" ? "INACTIVA" : "ACTIVA";

    await prisma.obraSocial.update({
      where: { idObraSocial: Number(req.params.id) },
      data: { estado: nuevoEstado },
    });

    res
      .status(200)
      .json({ mensaje: "Estado de obra social actualizado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al cambiar el estado de la obra social",
    });
  }
};

export const obtenerObraSocialID = async (req, res) => {
  try {
    const obraSocial = await prisma.obraSocial.findUnique({
      where: { idObraSocial: Number(req.params.id) },
    });

    if (!obraSocial) {
      return res.status(401).json({ mensaje: "La obra social no existe" });
    }
    res.status(200).json(obraSocial);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al obtener la obra social" });
  }
};
