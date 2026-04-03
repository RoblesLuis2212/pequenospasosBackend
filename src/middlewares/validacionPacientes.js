import { body } from "express-validator";
import resultadoValidacion from "../middlewares/resultadoValidacion.js";
import { prisma } from "../server/prisma.js";

const validacionPacientes = [
  body("nombreCompleto")
    .notEmpty()
    .withMessage("El nombre es un dato obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe contener entre 3 y 100 caracteres"),
  body("dni")
    .notEmpty()
    .withMessage("El DNI es un dato obligatorio")
    .isLength({ min: 8, max: 8 })
    .withMessage("El DNI debe contener 8 caracteres")
    .custom(async (valor, { req }) => {
      const dniExistente = await prisma.paciente.findUnique({
        where: { dni: valor },
      });
      //verificacion si el dni ya existe
      if (!dniExistente) {
        return true;
      }
      //verificacion de si el paciente esta creando o editando
      if (req.params?.id && dniExistente.idPaciente === Number(req.params.id)) {
        return true;
      }
      throw new Error("El DNI ingresado ya existe");
    }),
  body("domicilio")
    .notEmpty()
    .withMessage("El domicilio es un dato obligatorio")
    .isLength({ min: 5, max: 70 })
    .withMessage("El domicilio debe contener entre 5 y 70 caracteres"),
  body("fechaNacimiento")
    .notEmpty()
    .withMessage("La fecha de nacimiento es un dato obligatorio")
    .isISO8601()
    .withMessage("El formato de fecha no es valido")
    .toDate()
    .custom((valor) => {
      if (new Date(valor) > new Date()) {
        throw new Error(
          "La fecha de nacimiento no puede ser mayor a la actual",
        );
      }
      return true;
    }),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionPacientes;
