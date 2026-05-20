import { Router } from "express";
import {
  crearFichaPaciente,
  obtenerFichaPaciente,
} from "../controllers/fichaMedica.controllers.js";

const router = Router();
router.route("/:id").post(crearFichaPaciente).get(obtenerFichaPaciente);
export default router;
