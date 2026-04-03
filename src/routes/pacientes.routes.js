import { Router } from "express";
import { agregarPaciente } from "../controllers/pacientes.controllers.js";

const router = Router();
router.route("/").post(agregarPaciente);
export default router;
