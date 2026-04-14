import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionEstadoTurnos = [
  body("estado")
    .notEmpty()
    .withMessage("El estado es un dato obligatorio")
    .isIn(["PENDIENTE", "APROBADO", "CANCELADO", "FINALIZADO"])
    .withMessage("Estado de turno invalido"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionEstadoTurnos;
