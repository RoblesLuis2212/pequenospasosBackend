import { prisma } from "../server/prisma.js";

export const agregarAlCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;
    const { productoId, cantidad } = req.body;

    //se verifica si hay un carrito activo
    let carrito = await prisma.carrito.findFirst({
      where: { usuarioId, estado: "ACTIVO" },
    });

    //Si el usuario no tiene uno activo se crea
    if (!carrito) {
      carrito = await prisma.carrito.create({
        data: { usuarioId },
      });
    }

    //se verifica si el producto que se agrega ya esta en el carrito
    const detalleExistente = await prisma.detalleCarrito.findFirst({
      where: { carritoId: carrito.idCarrito, productoId },
    });

    //Si no esta en el carrito lo agregamos
    if (!detalleExistente) {
      //Primero se obtienen los datos del producto para poder formar el detalle
      const producto = await prisma.producto.findUnique({
        where: { idProducto: productoId },
      });
      //se crea el detalle del carrito con los datos del producto
      await prisma.detalleCarrito.create({
        data: {
          carritoId: carrito.idCarrito,
          productoId,
          cantidad,
          precio_unitario: producto.precio,
        },
      });
    }
    res.status(201).json({ mensaje: "Producto agregado al carrito" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al agregar el producto al carrito" });
  }
};
