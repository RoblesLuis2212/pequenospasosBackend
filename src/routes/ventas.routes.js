import { Router } from "express";
import {
  cancelarCompra,
  finalizarCompra,
  listarVentasPorUsuario,
} from "../controllers/ventas.controllers.js";
import verificarToken from "../middlewares/validarToken.js";

const router = Router();

router.route("/").get(verificarToken, listarVentasPorUsuario);
router
  .route("/:id")
  .post(verificarToken, finalizarCompra)
  .patch(cancelarCompra);

export default router;
