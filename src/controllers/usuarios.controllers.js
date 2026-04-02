import { prisma } from "../server/prisma.js";

export const crearUsuario = (req, res) => {
  res.send("Desde el controlador crear usuario");
};
