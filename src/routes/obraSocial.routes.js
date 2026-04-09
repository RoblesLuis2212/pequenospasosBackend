import { Router } from "express";
import {
  agregarObraSocial,
  cambiarEstadoObraSocial,
  editarObraSocial,
  listarObrasSociales,
} from "../controllers/obraSocial.controllers.js";

const router = Router();
router.route("/").post(agregarObraSocial).get(listarObrasSociales);
router.route("/:id").put(editarObraSocial).patch(cambiarEstadoObraSocial);

export default router;
