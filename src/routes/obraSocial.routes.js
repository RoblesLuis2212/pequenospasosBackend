import { Router } from "express";
import {
  agregarObraSocial,
  cambiarEstadoObraSocial,
  editarObraSocial,
  listarObrasSociales,
  obtenerObraSocialID,
} from "../controllers/obraSocial.controllers.js";
import validacionObraSocial from "../middlewares/validacionObraSocial.js";

const router = Router();
router
  .route("/")
  .post(validacionObraSocial, agregarObraSocial)
  .get(listarObrasSociales);
router
  .route("/:id")
  .put(validacionObraSocial, editarObraSocial)
  .patch(cambiarEstadoObraSocial)
  .get(obtenerObraSocialID);

export default router;
