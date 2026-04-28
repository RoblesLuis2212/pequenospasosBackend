import { Router } from "express";
import {
  abrirCaja,
  cerrarCaja,
  registrarPagoCompraUsuario,
  regitrarPagoTurno,
} from "../controllers/caja.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router.route("/").post(verificarToken, abrirCaja);
router.route("/:id/cierre").patch(verificarToken, validacionID, cerrarCaja);
router
  .route("/:id/turno-pago")
  .put(verificarToken, validacionID, regitrarPagoTurno);
router
  .route("/:id/compra-pago")
  .put(verificarToken, registrarPagoCompraUsuario);

export default router;
