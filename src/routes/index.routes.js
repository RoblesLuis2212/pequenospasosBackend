import { Router } from "express";
import routerUsuarios from "./usuarios.routes.js";
import routerPacientes from "./pacientes.routes.js";
import routerTurnos from "./turnos.routes.js";
import routerObraSocial from "./obraSocial.routes.js";
import routerProductos from "./productos.routes.js";

const router = Router();
router.use("/usuarios", routerUsuarios);
router.use("/pacientes", routerPacientes);
router.use("/turnos", routerTurnos);
router.use("/obrasSociales", routerObraSocial);
router.use("/productos", routerProductos);

export default router;
