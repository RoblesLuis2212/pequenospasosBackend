import { Router } from "express";
import {
  cambiarEstadoUsuario,
  crearUsuario,
  listarUsuarios,
} from "../controllers/usuarios.controllers.js";

const router = Router();
router.route("/").post(crearUsuario).get(listarUsuarios);
router.route("/:id").patch(cambiarEstadoUsuario);

export default router;
