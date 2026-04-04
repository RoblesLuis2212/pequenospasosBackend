import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionTurnos = [
  body("estado")
    .optional()
    .isIn(["PENDIENTE", "APROBADO", "CANCELADO", "FINALIZADO"])
    .withMessage("Estado no valido"),
  body("fecha")
    .notEmpty()
    .withMessage("La fecha del turno es un dato obligatorio")
    .isISO8601({ strict: false })
    .withMessage("Formato de fecha invalido")
    .custom((valor) => {
      const fecha = new Date(valor);
      if (isNaN(fecha.getTime())) {
        throw new Error("Formato de fecha inválido");
      }
      if (fecha <= new Date()) {
        throw new Error("La fecha debe ser posterior a la fecha actual");
      }
      return true;
    }),
  body("pacienteId")
    .notEmpty()
    .withMessage("El paciente es un dato obligatorio")
    .isInt()
    .withMessage("El ID del paciente debe ser un numero entero"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionTurnos;
