import { Router } from "express";
import {
  agregarObraSocial,
  cambiarEstadoObraSocial,
  editarObraSocial,
  listarObrasSociales,
  obtenerObraSocialID,
} from "../controllers/obraSocial.controllers.js";

const router = Router();
router.route("/").post(agregarObraSocial).get(listarObrasSociales);
router
  .route("/:id")
  .put(editarObraSocial)
  .patch(cambiarEstadoObraSocial)
  .get(obtenerObraSocialID);

export default router;
