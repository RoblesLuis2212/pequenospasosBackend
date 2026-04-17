import { prisma } from "../server/prisma.js";

export const finalizarCompra = async (req, res) => {
  try {
    const { id } = req.params;

    const carrito = await prisma.carrito.findUnique({
      where: { idCarrito: Number(id) },
      include: {
        detalleCarritos: true,
        usuario: {
          select: {
            nombreCompleto: true,
            telefono: true,
            email: true,
          },
        },
      },
    });

    if (!carrito) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    //calcular total
    const total = carrito.detalleCarritos.reduce((acc, item) => {
      return acc + Number(item.precio_unitario) * item.cantidad;
    }, 0);

    const nuevaVenta = await prisma.ventas.create({
      data: {
        monto: total,
        tipoVenta: "PRODUCTO",
        usuarioId: carrito.usuarioId,
        estado: "PENDIENTE",

        detalles: {
          create: carrito.detalleCarritos.map((item) => ({
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            productoId: item.productoId,
          })),
        },
      },
    });

    await prisma.carrito.update({
      where: { idCarrito: Number(id) },
      data: { estado: "PENDIENTE" },
    });

    res.status(201).json(nuevaVenta);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al finalizar la compra" });
  }
};

export const listarVentasPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;

    const ventaUsuario = await prisma.ventas.findMany({
      where: { usuarioId },
      include: {
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });

    res.status(200).json(ventaUsuario);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al listar las compras del usuario" });
  }
};
