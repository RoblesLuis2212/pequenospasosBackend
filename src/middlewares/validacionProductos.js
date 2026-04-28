import { body } from "express-validator";
import resultadoValidacion from "../middlewares/resultadoValidacion.js";
import { prisma } from "../server/prisma.js";

const validacionProductos = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto es un dato obligatorio")
    .isLength({ min: 5, max: 100 })
    .withMessage(
      "El nombre del producto debe contener entre 5 y 100 caracteres",
    )
    .custom(async (valor, { req }) => {
      const productoExistente = await prisma.producto.findFirst({
        where: { nombre: valor },
      });
      //verificacion si se esta creando o editando el producto
      if (
        productoExistente &&
        productoExistente.idProducto !== Number(req.params.id)
      ) {
        throw new Error("El producto ya existe");
      }
      return true;
    }),
  body("precio")
    .notEmpty()
    .withMessage("El precio es un dato obligatorio")
    .isFloat({ min: 100, max: 1000000 })
    .withMessage("El precio debe estar entre 100 y 1.000.000"),
  body("stock")
    .notEmpty()
    .withMessage("El stock es un dato obligatorio")
    .isInt({ min: 0 })
    .withMessage("El stock del producto debe ser mayor a 0"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion es un dato obligatorio")
    .isLength({ min: 10, max: 300 })
    .withMessage("La descripcion debe contener entre 10 y 300 caracteres"),
  body("codigoBarras")
    .optional()
    .notEmpty()
    .withMessage("El codigo de barras es un dato obligatorio")
    .custom(async (valor, { req }) => {
      if (!valor) return true;

      const productoExistente = await prisma.producto.findUnique({
        where: { codigoBarras: valor },
      });

      const idActual = Number(req.params.id);

      if (productoExistente && productoExistente.idProducto !== idActual) {
        throw new Error("El codigo de barra ya se encuentra en uso");
      }
      return true;
    }),
  body("categoriaId")
    .notEmpty()
    .withMessage("La categoria es un dato obligatorio")
    .isInt()
    .withMessage("La categoria debe ser un numero entero"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionProductos;
