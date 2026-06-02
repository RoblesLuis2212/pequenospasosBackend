import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionDatosEscolares = [
  body("escuela")
    .notEmpty()
    .withMessage(
      "La escuela a la que asiste el paciente es un dato obligatorio",
    )
    .isLength({ min: 5, max: 60 })
    .withMessage(
      "El nombre de la escuela debe contener entre 5 y 60 caracteres",
    ),
  body("turno")
    .notEmpty()
    .withMessage("El turno en que asiste el paciente es un dato obligatorio")
    .isIn(["MANANA", "TARDE", "NOCHE"])
    .withMessage("Turno no valido"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionDatosEscolares;
