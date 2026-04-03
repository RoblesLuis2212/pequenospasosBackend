import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import { prisma } from "../server/prisma.js";

const validacionEdicionUsuario = [
  body("nombreCompleto")
    .notEmpty()
    .withMessage("El nombre es un dato obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe contener entre 3 y 100 caracteres"),
  body("telefono")
    .notEmpty()
    .withMessage("El telefono es un dato obligatorio")
    .isLength({ min: 8, max: 15 })
    .withMessage("El telefono debe contener entre 8 y 15 caracteres"),
  body("email")
    .notEmpty()
    .withMessage("El email es un dato obligatorio")
    .isEmail()
    .withMessage("El email ingresado no es valido")
    .normalizeEmail()
    .custom(async (valor, { req }) => {
      const edicion = false;
      const correoExistente = await prisma.usuario.findUnique({
        where: { email: valor },
      });
      console.log(correoExistente);
      if (!correoExistente) {
        return true;
      }

      if (
        req.params?.id &&
        correoExistente.idUsuario === Number(req.params.id)
      ) {
        return true;
      }
      throw new Error("El correo ingresado ya existe");
    }),
  body("estado")
    .optional()
    .isIn(["ACTIVO", "INACTIVO"])
    .withMessage("El estado no es valido"),
  body("rolId")
    .exists()
    .withMessage("El ID del rol es un dato obligatorio")
    .isInt()
    .withMessage("El ID del rol debe ser un numero entero")
    .custom((valor) => {
      if (valor <= 0) {
        throw new Error("ID no valido");
      }
      return true;
    }),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionEdicionUsuario;
