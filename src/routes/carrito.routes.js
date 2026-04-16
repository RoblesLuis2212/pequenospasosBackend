import { Router } from "express";
import {
  agregarAlCarrito,
  eliminarProductoCarrito,
  listarCarritoUsuario,
} from "../controllers/carrito.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, agregarAlCarrito)
  .get(verificarToken, listarCarritoUsuario);
router
  .route("/:id")
  .delete(verificarToken, validacionID, eliminarProductoCarrito);

export default router;
