import { Router } from "express";
import { agregarDatosEscolares } from "../controllers/datosEscolares.controllers.js";

const router = Router();
router.route("/:id").post(agregarDatosEscolares);

export default router;
