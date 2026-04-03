import { Router } from "express";
import {
  actualizarDatos,
  agregarPaciente,
  listarPacientes,
  obtenerPacienteID,
} from "../controllers/pacientes.controllers.js";

const router = Router();
router.route("/").post(agregarPaciente).get(listarPacientes);
router.route("/:id").put(actualizarDatos).get(obtenerPacienteID);
export default router;
