import { Router } from "express";
import {
  crearFichaPaciente,
  editarFichaMedicaPaciente,
  obtenerFichaPaciente,
} from "../controllers/fichaMedica.controllers.js";

const router = Router();
router
  .route("/:id")
  .post(crearFichaPaciente)
  .get(obtenerFichaPaciente)
  .put(editarFichaMedicaPaciente);
export default router;
