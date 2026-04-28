import { prisma } from "../server/prisma.js";

export const abrirCaja = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;

    //Primero se verifica que no exista una caja abierta
    const cajaAbierta = await prisma.caja.findFirst({
      where: { usuarioId: usuarioId, estado: "ABIERTA" },
    });
    //Si ya hay una abierta se lanza un error
    if (cajaAbierta) {
      return res.status(400).json({ mensaje: "Ya hay una caja abierta" });
    }

    const nuevaCaja = await prisma.caja.create({
      data: {
        usuarioId: usuarioId,
      },
    });

    res.status(201).json(nuevaCaja);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al abrir la caja" });
  }
};
