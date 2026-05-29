import { prisma } from "../server/prisma.js";
import bcrypt from "bcrypt";

export const verificarAdmin = async () => {
  try {
    //Se verifica si existe un usuario con el rol de administrador
    const adminExistente = await prisma.usuario.findFirst({
      where: {
        rol: {
          nombre: "ADMIN",
        },
      },
    });
    //Si no existe se procede a crear uno
    if (!adminExistente) {
      const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

      await prisma.usuario.create({
        email: process.env.ADMIN_EMAIL,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
