import { Router } from "express";
import {
  agregarObraSocial,
  editarObraSocial,
  listarObrasSociales,
} from "../controllers/obraSocial.controllers.js";

const router = Router();
router.route("/").post(agregarObraSocial).get(listarObrasSociales);
router.route("/:id").put(editarObraSocial);

export default router;
