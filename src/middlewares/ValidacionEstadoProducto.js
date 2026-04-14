import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionEstadoProducto = [
  body("estado")
    .notEmpty()
    .withMessage("El estado es un dato obligatorio")
    .isIn(["DISPONIBLE", "INACTIVO"])
    .withMessage("Estado de producto invalido"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionEstadoProducto;
