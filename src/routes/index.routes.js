import { Router } from "express";
import routerUsuarios from "./usuarios.routes.js";
import routerPacientes from "./pacientes.routes.js";
import routerTurnos from "./turnos.routes.js";
import routerObraSocial from "./obraSocial.routes.js";
import routerProductos from "./productos.routes.js";
import routerCarrito from "./carrito.routes.js";
import routerVentas from "./ventas.routes.js";
import routerCaja from "./caja.routes.js";
import routerFichaMedica from "./fichaMedica.routes.js";
import routerDatosEscolares from "./datosEscolares.routes.js";
import routerEvolucionPaciente from "./evolucionPaciente.routes.js";

const router = Router();
router.use("/usuarios", routerUsuarios);
router.use("/pacientes", routerPacientes);
router.use("/turnos", routerTurnos);
router.use("/obrasSociales", routerObraSocial);
router.use("/productos", routerProductos);
router.use("/carrito", routerCarrito);
router.use("/ventas", routerVentas);
router.use("/caja", routerCaja);
router.use("/fichaMedica", routerFichaMedica);
router.use("/datosEscolares", routerDatosEscolares);
router.use("/evolucionPaciente", routerEvolucionPaciente);

export default router;
