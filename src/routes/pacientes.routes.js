import { Router } from "express";
import {
  actualizarDatos,
  agregarPaciente,
  asignarTutor,
  listarPacientes,
  obtenerPacienteID,
} from "../controllers/pacientes.controllers.js";
import validacionPacientes from "../middlewares/validacionPacientes.js";
import validacionID from "../middlewares/validacionID.js";
import verificarToken from "../middlewares/validarToken.js";

const router = Router();
router
  .route("/")
  .post(validacionPacientes, agregarPaciente)
  .get(verificarToken, listarPacientes);
router.route("/:id/asignar-tutor").patch(verificarToken, asignarTutor);
router
  .route("/:id")
  .put(verificarToken, validacionPacientes, actualizarDatos)
  .get(verificarToken, validacionID, obtenerPacienteID);

export default router;
