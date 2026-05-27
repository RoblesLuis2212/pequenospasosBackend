import { Router } from "express";
import {
  abrirCaja,
  cerrarCaja,
  obtenerCajaActiva,
  registrarPagoCompraUsuario,
  regitrarPagoTurno,
} from "../controllers/caja.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";
import { verificarRol } from "../middlewares/verificarRol.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, verificarRol, abrirCaja)
  .get(verificarToken, verificarRol, obtenerCajaActiva);
router
  .route("/:id/cierre")
  .patch(verificarToken, verificarRol, validacionID, cerrarCaja);
router
  .route("/:id/turno-pago")
  .put(verificarToken, validacionID, verificarRol, regitrarPagoTurno);
router
  .route("/:id/compra-pago")
  .put(verificarToken, verificarRol, registrarPagoCompraUsuario);

export default router;
