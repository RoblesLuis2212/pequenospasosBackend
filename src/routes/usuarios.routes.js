import { Router } from "express";
import {
  cambiarContrasena,
  cambiarEstadoUsuario,
  crearUsuario,
  listarUsuarios,
  login,
  obtenerUsuarioID,
} from "../controllers/usuarios.controllers.js";
import verificarToken from "../middlewares/validarToken.js";

const router = Router();
router.route("/").post(crearUsuario).get(listarUsuarios);
router.route("/:id").patch(cambiarEstadoUsuario).get(obtenerUsuarioID);
router.route("/login").post(login);
router.route("/cambiar-Password").put(verificarToken, cambiarContrasena);

export default router;
