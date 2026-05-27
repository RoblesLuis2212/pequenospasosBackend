import { Router } from "express";
import {
  agregarEvolucion,
  editarEvolucionPaciente,
  listarEvolucionPaciente,
} from "../controllers/evolucionPaciente.controllers.js";
import { editarDatosEscolares } from "../controllers/datosEscolares.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router
  .route("/:id")
  .post(verificarToken, validacionID, agregarEvolucion)
  .get(verificarToken, validacionID, listarEvolucionPaciente)
  .put(verificarToken, validacionID, editarEvolucionPaciente);

export default router;
