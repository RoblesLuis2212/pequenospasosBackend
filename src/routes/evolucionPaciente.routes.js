import { Router } from "express";
import {
  agregarEvolucion,
  listarEvolucionPaciente,
} from "../controllers/evolucionPaciente.controllers.js";

const router = Router();
router.route("/:id").post(agregarEvolucion).get(listarEvolucionPaciente);

export default router;
