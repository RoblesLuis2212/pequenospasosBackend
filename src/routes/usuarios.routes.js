import { Router } from "express";
import {
  cambiarContrasena,
  cambiarEstadoUsuario,
  correoOlvidoPassword,
  crearUsuario,
  editarUsuario,
  listarUsuarios,
  login,
  obtenerUsuarioID,
  resetPassword,
} from "../controllers/usuarios.controllers.js";
import verificarToken from "../middlewares/validarToken.js";
import validacionesUsuarios from "../middlewares/validacionUsuarios.js";
import validacionLogin from "../middlewares/validacionLogin.js";
import validacionEstadoUsuarios from "../middlewares/validacionEstadoUsuarios.js";

const router = Router();
router
  .route("/")
  .post(validacionesUsuarios, crearUsuario)
  .get(verificarToken, listarUsuarios);
router.route("/login").post(validacionLogin, login);
router.route("/cambiar-Password").put(verificarToken, cambiarContrasena);
router.route("/forgot-password").post(verificarToken, correoOlvidoPassword);
router.route("/reset-password").post(verificarToken, resetPassword);
router
  .route("/:id")
  .patch(verificarToken, validacionEstadoUsuarios, cambiarEstadoUsuario)
  .get(obtenerUsuarioID)
  .put(verificarToken, editarUsuario);

export default router;
