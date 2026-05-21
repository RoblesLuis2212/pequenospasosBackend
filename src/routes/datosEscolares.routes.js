import { Router } from "express";
import {
  agregarDatosEscolares,
  editarDatosEscolares,
  listarDatosEscolaresPaciente,
} from "../controllers/datosEscolares.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router
  .route("/:id")
  .post(verificarToken, validacionID, agregarDatosEscolares)
  .get(verificarToken, validacionID, listarDatosEscolaresPaciente)
  .put(verificarToken, validacionID, editarDatosEscolares);

export default router;
