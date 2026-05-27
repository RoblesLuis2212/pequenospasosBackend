import { Router } from "express";
import {
  agregarDatosEscolares,
  editarDatosEscolares,
  listarDatosEscolaresPaciente,
} from "../controllers/datosEscolares.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";
import validacionDatosEscolares from "../middlewares/validacionDatosEscolares.js";
import { verificarRol } from "../middlewares/verificarRol.js";

const router = Router();
router
  .route("/:id")
  .post(
    verificarToken,
    verificarRol,
    validacionID,
    validacionDatosEscolares,
    agregarDatosEscolares,
  )
  .get(verificarToken, validacionID, listarDatosEscolaresPaciente)
  .put(
    verificarToken,
    verificarRol,
    validacionID,
    validacionDatosEscolares,
    editarDatosEscolares,
  );

export default router;
