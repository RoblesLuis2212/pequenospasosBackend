import { prisma } from "../server/prisma.js";

export const agregarProducto = async (req, res) => {
  try {
    const nuevoProducto = await prisma.producto.create({
      data: req.body,
    });
    res
      .status(201)
      .json({
        mensaje: "Producto agregado exitosamente",
        producto: nuevoProducto,
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al agregar el producto" });
  }
};
