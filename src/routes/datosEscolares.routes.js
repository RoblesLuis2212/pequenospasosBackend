import { Router } from "express";
import {
  agregarDatosEscolares,
  editarDatosEscolares,
  listarDatosEscolaresPaciente,
} from "../controllers/datosEscolares.controllers.js";

const router = Router();
router
  .route("/:id")
  .post(agregarDatosEscolares)
  .get(listarDatosEscolaresPaciente)
  .put(editarDatosEscolares);

export default router;
