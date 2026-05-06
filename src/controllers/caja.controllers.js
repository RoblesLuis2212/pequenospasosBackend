import { prisma } from "../server/prisma.js";

export const abrirCaja = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;

    //Primero se verifica que no exista una caja abierta
    const cajaAbierta = await prisma.caja.findFirst({
      where: { usuarioId: usuarioId, estado: "ABIERTA" },
    });
    //Si ya hay una abierta se lanza un error
    if (cajaAbierta) {
      return res.status(400).json({ mensaje: "Ya hay una caja abierta" });
    }

    const nuevaCaja = await prisma.caja.create({
      data: {
        usuarioId: usuarioId,
      },
    });

    res.status(201).json(nuevaCaja);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al abrir la caja" });
  }
};

export const regitrarPagoTurno = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;

    const cajaAbierta = await prisma.caja.findFirst({
      where: { usuarioId: usuarioId, estado: "ABIERTA" },
    });

    if (!cajaAbierta) {
      return res.status(400).json({ mensaje: "No hay una caja abierta" });
    }

    const turno = await prisma.turno.findUnique({
      where: { idTurno: Number(req.params.id) },
      include: {
        paciente: {
          select: {
            nombreCompleto: true,
            dni: true,
            obraSocial: true,
          },
        },
      },
    });

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    const precioConsulta = turno.paciente.obraSocial?.precioConsulta || 25000;

    const ventaExistente = await prisma.ventas.findFirst({
      where: { turnoId: Number(req.params.id) },
    });

    if (ventaExistente) {
      return res.status(400).json({ mensaje: "El turno ya fue pagado" });
    }

    const nuevaVenta = await prisma.ventas.create({
      data: {
        monto: precioConsulta,
        tipoVenta: "CONSULTA",
        estado: "APROBADO",
        usuarioId,
        turnoId: Number(req.params.id),
        cajaId: cajaAbierta.idCaja,
      },
    });

    const turnoActualizado = await prisma.turno.update({
      where: { idTurno: Number(req.params.id) },
      data: { estado: "FINALIZADO" },
    });

    res
      .status(200)
      .json({ mensaje: "Pago del turno registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al registrar la venta" });
  }
};

export const registrarPagoCompraUsuario = async (req, res) => {
  try {
    const idVenta = Number(req.params.id);
    const usuarioId = Number(req.usuario.idUsuario);

    const cajaAbierta = await prisma.caja.findFirst({
      where: { usuarioId, estado: "ABIERTA" },
    });

    if (!cajaAbierta) {
      return res.status(400).json({ mensaje: "No hay una caja abierta" });
    }

    const compraUsuario = await prisma.ventas.findUnique({
      where: { idVenta },
    });

    if (!compraUsuario) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    const montoCompra = compraUsuario.monto;

    const { descripcion, metodoPagoId, pagoCon } = req.body;

    const vuelto = Number(pagoCon) - Number(montoCompra);

    const ventaActualizada = await prisma.ventas.update({
      where: { idVenta },
      data: {
        estado: "RETIRADO",
        usuarioId,
        monto: montoCompra,
        descripcion: descripcion,
        metodoPagoId,
        cajaId: cajaAbierta.idCaja,
        pagoCon,
        vuelto,
        fechaRetiro: new Date(),
      },
    });

    res.status(200).json({ mensaje: "Pago registrado exitosamente" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al registrar la compra del usuario" });
  }
};

export const cerrarCaja = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;
    //Primero se verifica si hay una caja abierta
    const cajaAbierta = await prisma.caja.findFirst({
      where: { usuarioId, estado: "ABIERTA" },
      include: { ventas: true },
    });

    if (!cajaAbierta) {
      return res.status(400).json({ mensaje: "No hay caja abierta" });
    }

    const montoCierre = cajaAbierta.ventas
      .filter((v) => v.estado === "APROBADO" || v.estado === "RETIRADO")
      .reduce((acc, v) => acc + Number(v.monto), 0);

    const cajaCerrada = await prisma.caja.update({
      where: { idCaja: cajaAbierta.idCaja },
      data: {
        fechaCierre: new Date(),
        montoCierre,
        estado: "CERRADA",
      },
    });

    res
      .status(200)
      .json({ mensaje: "Caja cerrada correctamente. ", caja: cajaCerrada });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al cerrar la caja" });
  }
};

export const obtenerCajaActiva = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;

    const cajaActiva = await prisma.caja.findFirst({
      where: { usuarioId, estado: "ABIERTA" },
      include: {
        ventas: {
          orderBy: { fechaCompra: "desc" },
          include: {
            metodopago: true,
            usuario: {
              select: {
                nombreCompleto: true,
              },
            },
          },
        },
      },
    });

    if (!cajaActiva) {
      return res.status(404).json({ mensaje: "No hay caja abierta" });
    }

    // Total recaudado tanto de consultas pagadas como de productos retirados
    const totalRecaudado = cajaActiva.ventas
      .filter((v) => v.estado === "RETIRADO" || v.estado === "PAGADO")
      .map((v) => Number(v.monto.toString()))
      .reduce((acc, monto) => acc + monto, 0);

    //Cantidad de ventas
    const cantidadVentas = cajaActiva.ventas.filter(
      (v) => v.estado === "RETIRADO" || v.estado === "PAGADO",
    ).length;

    const cantidadVentasTransferencia = cajaActiva.ventas.filter(
      (v) => v.metodopago.nombre === "TRANSFERENCIA",
    ).length;

    const cantidadVentasEfectivo = cajaActiva.ventas.filter(
      (v) => v.metodopago.nombre === "EFECTIVO",
    ).length;

    const cantidadVentasCredito = cajaActiva.ventas.filter(
      (v) => v.metodopago.nombre === "CREDITO",
    ).length;

    const cantidadVentasDebito = cajaActiva.ventas.filter(
      (v) => v.metodopago.nombre === "DEBITO",
    ).length;
    //Por metodo de pago
    const porMetodoPago = cajaActiva.ventas
      .filter((v) => v.estado === "RETIRADO" || v.estado === "PAGADO")
      .reduce((acc, v) => {
        const metodo = v.metodopago?.nombre || "SIN_METODO";
        acc[metodo] = (acc[metodo] || 0) + Number(v.monto.toString());
        return acc;
      }, {});

    res.status(200).json({
      caja: cajaActiva,
      metricas: {
        totalRecaudado,
        cantidadVentas,
        cantidadVentasTransferencia,
        cantidadVentasEfectivo,
        cantidadVentasDebito,
        cantidadVentasCredito,
        porMetodoPago,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener los datos de la caja" });
  }
};
