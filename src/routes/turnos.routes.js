import { Router } from "express";
import {
  cambiarEstadoTurno,
  crearTurno,
  listarTurnos,
  listarTurnosporUsuario,
  obtenerInformacionTurno,
} from "../controllers/turnos.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionTurnos from "../middlewares/validacionTurnos.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, validacionTurnos, crearTurno)
  .get(verificarToken, listarTurnos);
router
  .route("/turnos-usuario/:id")
  .get(verificarToken, validacionID, listarTurnosporUsuario);
router
  .route("/:id")
  .get(validacionID, obtenerInformacionTurno)
  .patch(validacionID, cambiarEstadoTurno);

export default router;
