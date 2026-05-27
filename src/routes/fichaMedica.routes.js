import { Router } from "express";
import {
  crearFichaPaciente,
  editarFichaMedicaPaciente,
  obtenerFichaPaciente,
} from "../controllers/fichaMedica.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";
import { verificarRol } from "../middlewares/verificarRol.js";

const router = Router();
router
  .route("/:id")
  .post(verificarToken, verificarRol, validacionID, crearFichaPaciente)
  .get(verificarToken, verificarRol, validacionID, obtenerFichaPaciente)
  .put(verificarToken, verificarRol, validacionID, editarFichaMedicaPaciente);
export default router;
