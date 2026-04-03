import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionEstadoUsuarios = [
  body("estado")
    .notEmpty()
    .withMessage("El estado es un dato obligatorio")
    .isIn(["ACTIVO", "INACTIVO"])
    .withMessage("Estado de usuario no valido"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionEstadoUsuarios;
