import { Router } from "express";
import {
  actualizarDatosProducto,
  agregarProducto,
  cambiarEstadoProducto,
  listarProductos,
  obtenerProductoID,
} from "../controllers/productos.controllers.js";
import validacionProductos from "../middlewares/validacionProductos.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionEstadoProducto from "../middlewares/ValidacionEstadoProducto.js";

const router = Router();
router
  .route("/")
  .post(verificarToken, validacionProductos, agregarProducto)
  .get(listarProductos);
router
  .route("/:id")
  .get(obtenerProductoID)
  .put(verificarToken, validacionProductos, actualizarDatosProducto)
  .patch(verificarToken, validacionEstadoProducto, cambiarEstadoProducto);

export default router;
