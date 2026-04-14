import { Router } from "express";
import {
  actualizarDatosProducto,
  agregarProducto,
  listarProductos,
  obtenerProductoID,
} from "../controllers/productos.controllers.js";

const router = Router();
router.route("/").post(agregarProducto).get(listarProductos);
router.route("/:id").get(obtenerProductoID).put(actualizarDatosProducto);

export default router;
