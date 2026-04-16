import { Router } from "express";
import {
  agregarAlCarrito,
  eliminarProductoCarrito,
  finalizarCompra,
  listarCarritoUsuario,
  listarComprasUsuario,
} from "../controllers/carrito.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, agregarAlCarrito)
  .get(verificarToken, listarCarritoUsuario);
router.route("/compras").get(verificarToken, listarComprasUsuario);
router
  .route("/:id")
  .delete(verificarToken, validacionID, eliminarProductoCarrito)
  .patch(verificarToken, validacionID, finalizarCompra);

export default router;
