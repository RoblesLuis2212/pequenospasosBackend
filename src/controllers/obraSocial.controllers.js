import { prisma } from "../server/prisma.js";

export const agregarObraSocial = async (req, res) => {
  try {
    const nuevaObraSocial = await prisma.obraSocial.create({
      data: req.body,
    });
    res
      .status(201)
      .json({
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
