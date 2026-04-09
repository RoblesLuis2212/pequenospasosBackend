import { Router } from "express";
import {
  agregarObraSocial,
  cambiarEstadoObraSocial,
  editarObraSocial,
  listarObrasSociales,
  obtenerObraSocialID,
} from "../controllers/obraSocial.controllers.js";
import validacionObraSocial from "../middlewares/validacionObraSocial.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, validacionObraSocial, agregarObraSocial)
  .get(verificarToken, listarObrasSociales);
router
  .route("/:id")
  .put(verificarToken, validacionID, validacionObraSocial, editarObraSocial)
  .patch(verificarToken, validacionID, cambiarEstadoObraSocial)
  .get(verificarToken, validacionID, obtenerObraSocialID);

export default router;
