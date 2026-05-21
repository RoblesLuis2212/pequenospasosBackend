import { Router } from "express";
import {
  agregarDatosEscolares,
  listarDatosEscolaresPaciente,
} from "../controllers/datosEscolares.controllers.js";

const router = Router();
router
  .route("/:id")
  .post(agregarDatosEscolares)
  .get(listarDatosEscolaresPaciente);

export default router;
