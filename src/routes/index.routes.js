import { Router } from "express";
import routerUsuarios from "./usuarios.routes.js";

const router = Router();
router.use("/usuarios", routerUsuarios);

export default router;
