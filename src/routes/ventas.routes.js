import { Router } from "express";
import {
  cancelarCompra,
  finalizarCompra,
  listarVentasPorUsuario,
} from "../controllers/ventas.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();

router.route("/").get(verificarToken, listarVentasPorUsuario);
router
  .route("/:id")
  .post(verificarToken, validacionID, finalizarCompra)
  .patch(verificarToken, validacionID, cancelarCompra);

export default router;
