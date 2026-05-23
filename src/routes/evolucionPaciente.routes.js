import { Router } from "express";
import {
  agregarEvolucion,
  editarEvolucionPaciente,
  listarEvolucionPaciente,
} from "../controllers/evolucionPaciente.controllers.js";
import { editarDatosEscolares } from "../controllers/datosEscolares.controllers.js";

const router = Router();
router
  .route("/:id")
  .post(agregarEvolucion)
  .get(listarEvolucionPaciente)
  .put(editarEvolucionPaciente);

export default router;
