import { Router } from "express";
import { abrirCaja } from "../controllers/caja.controllers.js";
import verificarToken from "../middlewares/validarToken.js";

const router = Router();
router.route("/").post(verificarToken, abrirCaja);

export default router;
