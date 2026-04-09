import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import { prisma } from "../server/prisma.js";

const validacionObraSocial = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es un dato obligatorio")
    .isLength({ min: 5, max: 50 })
    .withMessage("El nombre debe contener entre 5 y 50 caracteres")
    .custom(async (valor) => {
      const obraSocialExistente = await prisma.obraSocial.findUnique({
        where: { nombre: valor },
      });
      if (obraSocialExistente) {
        throw new Error("La obra social ya esta disponible");
      }
      return true;
    }),
  body("precioConsulta")
    .notEmpty()
    .withMessage("El precio de la consulta es un dato obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser mayor a 0"),
  body("duracionConsulta")
    .notEmpty()
    .withMessage("La duracion de la consulta es un dato obligatorio")
    .isLength({ min: 1, max: 90 })
    .withMessage("La duracion debe ser entre 1 y 90"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionObraSocial;
