import { Router } from "express";
import {
  actualizarDatosProducto,
  agregarCategoriaProducto,
  agregarProducto,
  cambiarEstadoProducto,
  listarProductos,
  obtenerProductoID,
} from "../controllers/productos.controllers.js";
import validacionProductos from "../middlewares/validacionProductos.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionEstadoProducto from "../middlewares/ValidacionEstadoProducto.js";
import errorMulter from "../middlewares/ErrorMulter.js";
import upload from "../helpers/upload.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();
router
  .route("/")
  .post(
    verificarToken,
    upload.single("imagen"),
    errorMulter,
    validacionProductos,
    agregarProducto,
  )
  .get(listarProductos);
router
  .route("/:id")
  .get(obtenerProductoID)
  .put(
    verificarToken,
    validacionID,
    upload.single("imagen"),
    errorMulter,
    validacionProductos,
    actualizarDatosProducto,
  )
  .patch(verificarToken, validacionEstadoProducto, cambiarEstadoProducto);
router.route("/categorias").post(agregarCategoriaProducto);

export default router;
