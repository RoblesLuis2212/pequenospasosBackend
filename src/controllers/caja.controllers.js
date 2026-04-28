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

export const listarVentas = async (req, res) => {
  try {
    const ventas = await prisma.ventas.findMany();

    if (!ventas) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron ventas para listar" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al listar las ventas" });
  }
};
