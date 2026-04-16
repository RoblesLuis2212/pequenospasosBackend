import { Router } from "express";
import {
  agregarAlCarrito,
  listarCarritoUsuario,
} from "../controllers/carrito.controllers.js";
import verificarToken from "../middlewares/validarToken.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, agregarAlCarrito)
  .get(verificarToken, listarCarritoUsuario);

export default router;
