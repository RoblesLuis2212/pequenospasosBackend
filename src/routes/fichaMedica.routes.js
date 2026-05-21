import { Router } from "express";
import {
  crearFichaPaciente,
  editarFichaMedicaPaciente,
  obtenerFichaPaciente,
} from "../controllers/fichaMedica.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router
  .route("/:id")
  .post(verificarToken, validacionID, crearFichaPaciente)
  .get(verificarToken, validacionID, obtenerFichaPaciente)
  .put(verificarToken, validacionID, editarFichaMedicaPaciente);
export default router;
