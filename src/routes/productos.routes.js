import { Router } from "express";
import { agregarProducto } from "../controllers/productos.controllers.js";

const router = Router();
router.route("/").post(agregarProducto);

export default router;
