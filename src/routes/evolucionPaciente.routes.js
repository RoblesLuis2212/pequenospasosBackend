import { Router } from "express";
import {
  agregarEvolucion,
  editarEvolucionPaciente,
  listarEvolucionPaciente,
} from "../controllers/evolucionPaciente.controllers.js";
import { editarDatosEscolares } from "../controllers/datosEscolares.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";
import { verificarRol } from "../middlewares/verificarRol.js";

const router = Router();
router
  .route("/:id")
  .post(verificarToken, verificarRol, validacionID, agregarEvolucion)
  .get(verificarToken, verificarRol, validacionID, listarEvolucionPaciente)
  .put(verificarToken, verificarRol, validacionID, editarEvolucionPaciente);

export default router;
