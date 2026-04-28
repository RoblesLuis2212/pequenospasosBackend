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
      orderBy: {
        fechaCompra: "asc",
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

export const cancelarCompra = async (req, res) => {
  try {
    const compra = await prisma.ventas.findUnique({
      where: { idVenta: Number(req.params.id) },
    });

    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    const nuevoEstado =
      compra.estado === "PENDIENTE" ? "CANCELADO" : compra.estado;

    const compraActualizada = await prisma.ventas.update({
      where: { idVenta: Number(req.params.id) },
      data: { estado: nuevoEstado },
    });

    res.status(200).json({
      mensaje: "Compra cancelada exitosamente",
      compra: compraActualizada,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al cancelar la compra" });
  }
};

export const listarVentas = async (req, res) => {
  try {
    const ventas = await prisma.ventas.findMany({
      include: {
        usuario: {
          select: {
            nombreCompleto: true,
          },
        },
        detalles: {
          include: {
            producto: {
              select: {
                nombre: true,
                precio: true,
              },
            },
          },
        },
      },
      orderBy: {
        fechaCompra: "desc",
      },
    });

    if (!ventas) {
      return res.status(404).json({ mensaje: "No hay ventas para listar" });
    }

    res.status(200).json(ventas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al listar las ventas" });
  }
};

export const aprobarCompra = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const venta = await tx.ventas.findUnique({
        where: { idVenta: Number(id) },
        include: { detalles: true },
      });

      if (!venta) throw new Error("Venta no encontrada");
      if (venta.estado !== "PENDIENTE")
        throw new Error("La venta no tiene estado pendiente");

      for (const detalle of venta.detalles) {
        const producto = await tx.producto.findUnique({
          where: { idProducto: detalle.productoId },
        });

        if (producto.stock < detalle.cantidad) {
          throw new Error(
            `Stock insuficiente para el producto ${producto.nombre}`,
          );
        }

        await tx.producto.update({
          where: { idProducto: detalle.productoId },
          data: { stock: { decrement: detalle.cantidad } },
        });
      }

      await tx.ventas.update({
        where: { idVenta: Number(id) },
        data: { estado: "APROBADO" },
      });
    });

    res.status(200).json({ mensaje: "Compra aprobada y stock actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: err.message || "Ocurrio un error al aprobar la compra",
    });
  }
};

export const cancelarCompraAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const venta = await tx.ventas.findUnique({
        where: { idVenta: Number(id) },
        include: { detalles: true },
      });

      if (!venta) throw new Error("Venta no encontrada");
      if (venta.estado === "CANCELADO")
        throw new Error("La venta ya está cancelada");
      if (venta.estado === "RETIRADO")
        throw new Error("No se puede cancelar una venta ya retirada");

      // Reponer stock solo si estaba aprobada
      if (venta.estado === "APROBADO") {
        await Promise.all(
          venta.detalles.map((detalle) =>
            tx.producto.update({
              where: { idProducto: detalle.productoId },
              data: { stock: { increment: detalle.cantidad } },
            }),
          ),
        );
      }

      await tx.ventas.update({
        where: { idVenta: Number(id) },
        data: { estado: "CANCELADO" },
      });
    });

    res.status(200).json({ mensaje: "Compra cancelada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al cancelar la compra" });
  }
};

export const agregarMetodosPago = async (req, res) => {
  try {
    const nuevoMetodoPago = await prisma.metodoPago.create({
      data: req.body,
    });

    res.status(201).json({ mensaje: "Metodo de pago agregado exitosamente" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al agregar el metodo de pago" });
  }
};
