import { Router } from "express";
import {
  agregarEvolucion,
  editarEvolucionPaciente,
  listarEvolucionPaciente,
} from "../controllers/evolucionPaciente.controllers.js";
import { editarDatosEscolares } from "../controllers/datosEscolares.controllers.js";
import verificarToken from "../middlewares/validarToken.js";

const router = Router();
router
  .route("/:id")
  .post(verificarToken, agregarEvolucion)
  .get(verificarToken, listarEvolucionPaciente)
  .put(verificarToken, editarEvolucionPaciente);

export default router;
