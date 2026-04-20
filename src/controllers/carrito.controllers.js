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
    if (detalleExistente) {
      await prisma.detalleCarrito.update({
        where: { idDetalleCarrito: detalleExistente.idDetalleCarrito },
        data: { cantidad },
      });
    } else {
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

export const listarCarritoUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;

    const carrito = await prisma.carrito.findFirst({
      where: { usuarioId, estado: "ACTIVO" },
      include: {
        detalleCarritos: {
          orderBy: { idDetalleCarrito: "asc" },
          include: {
            producto: {
              select: {
                idProducto: true,
                nombre: true,
                precio: true,
                imagen: true,
              },
            },
          },
        },
      },
    });

    if (!carrito) {
      return res.status(200).json({
        carrito: {
          idCarrito: null,
          detalleCarritos: [],
        },
        total: 0,
      });
    }
    //calcular el total del carrito
    const total = carrito.detalleCarritos.reduce((acc, detalle) => {
      return acc + detalle.precio_unitario * detalle.cantidad;
    }, 0);
    res.status(200).json({ carrito, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al obtener el carrito" });
  }
};

export const eliminarProductoCarrito = async (req, res) => {
  try {
    const { id } = req.params;

    const detalleExistentes = await prisma.detalleCarrito.findUnique({
      where: { idDetalleCarrito: parseInt(id) },
    });

    if (!detalleExistentes) {
      return res
        .status(404)
        .json({ mensaje: "El producto no esta en el carrito" });
    }
    await prisma.detalleCarrito.delete({
      where: { idDetalleCarrito: parseInt(id) },
    });

    res.status(200).json({ mensaje: "Producto eliminado del carrito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al eliminar el producto del carrito",
    });
  }
};

//Este controlador finalizara la compra del usuario, con un estado pendiente, que sera aprobado por el administrador
export const finalizarCompra = async (req, res) => {
  try {
    //Se extrae el id del usuario del token para establecer la relacion
    const usuarioId = req.usuario.idUsuario;

    const carritoBuscado = await prisma.carrito.findUnique({
      where: { idCarrito: Number(req.params.id), usuarioId: usuarioId },
    });

    if (!carritoBuscado) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    const nuevoEstado =
      carritoBuscado.estado === "ACTIVO" ? "PENDIENTE" : carritoBuscado.estado;

    const carritoActualizado = await prisma.carrito.update({
      where: { idCarrito: Number(req.params.id) },
      data: { estado: nuevoEstado },
    });

    res.status(200).json({ mensaje: "Compra finalizada correctamente" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al finalizar la compra" });
  }
};

export const listarComprasUsuario = async () => {
  try {
    const usuarioId = req.usuario.idUsuario;

    const compras = await prisma.carrito.findMany({
      where: { usuarioId, estado: "PENDIENTE" },
      include: {
        detalleCarritos: {
          include: {
            producto: {
              select: {
                idProducto: true,
                nombre: true,
                precio: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json({ compras });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al obtener las compras del usuario" });
  }
};
