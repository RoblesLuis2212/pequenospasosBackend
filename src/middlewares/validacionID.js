import { param } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionID = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un numero entero positivo"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionID;
