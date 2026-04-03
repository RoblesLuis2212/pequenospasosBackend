import { Router } from "express";
import routerUsuarios from "./usuarios.routes.js";
import routerPacientes from "./pacientes.routes.js";

const router = Router();
router.use("/usuarios", routerUsuarios);
router.use("/pacientes", routerPacientes);

export default router;
