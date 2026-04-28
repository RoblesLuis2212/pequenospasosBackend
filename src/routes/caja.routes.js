import { Router } from "express";
import {
  abrirCaja,
  listarVentas,
  regitrarPagoTurno,
} from "../controllers/caja.controllers.js";
import verificarToken from "../middlewares/validarToken.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, abrirCaja)
  .get(verificarToken, listarVentas);
router.route("/:id/turno-pago").put(verificarToken, regitrarPagoTurno);

export default router;
