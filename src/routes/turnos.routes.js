import { Router } from "express";
import {
  crearTurno,
  obtenerInformacionTurno,
} from "../controllers/turnos.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionTurnos from "../middlewares/validacionTurnos.js";

const router = Router();
router.route("/").post(verificarToken, validacionTurnos, crearTurno);
router.route("/:id").get(obtenerInformacionTurno);

export default router;
