import { Router } from "express";
import {
  crearTurno,
  listarTurnos,
  obtenerInformacionTurno,
} from "../controllers/turnos.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionTurnos from "../middlewares/validacionTurnos.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, validacionTurnos, crearTurno)
  .get(verificarToken, listarTurnos);
router.route("/:id").get(obtenerInformacionTurno);

export default router;
