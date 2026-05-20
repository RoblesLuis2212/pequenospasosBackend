import { Router } from "express";
import {
  agregarMetodosPago,
  aprobarCompra,
  cancelarCompra,
  cancelarCompraAdmin,
  finalizarCompra,
  historialVentasTotales,
  listarVentas,
  listarVentasPorUsuario,
} from "../controllers/ventas.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();

router.route("/").get(verificarToken, listarVentasPorUsuario);
router.route("/ventas-admin").get(verificarToken, listarVentas);
router.route("/metodos-pago").post(agregarMetodosPago);
router.route("/historial-venta").get(historialVentasTotales);
router.route("/:id/aprobar").put(verificarToken, validacionID, aprobarCompra);
router
  .route("/:id/cancelar-admin")
  .patch(verificarToken, validacionID, cancelarCompraAdmin);
router
  .route("/:id")
  .post(verificarToken, validacionID, finalizarCompra)
  .patch(verificarToken, validacionID, cancelarCompra);

export default router;
