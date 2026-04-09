import { Router } from "express";
import { agregarObraSocial } from "../controllers/obraSocial.controllers.js";

const router = Router();
router.route("/").post(agregarObraSocial);

export default router;
