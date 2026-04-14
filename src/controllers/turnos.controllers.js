import { prisma } from "../server/prisma.js";

export const crearTurno = async (req, res) => {
  try {
    const { fecha, pacienteId } = req.body;
    const usuarioId = req.usuario.idUsuario;

    const nuevoTurno = await prisma.turno.create({
      data: {
        fecha: new Date(fecha),
        pacienteId,
        usuarioId,
      },
    });
    res
      .status(201)
      .json({ mensaje: "Turno creado correctamente", turno: nuevoTurno });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al crear el turno" });
  }
};

export const obtenerInformacionTurno = async (req, res) => {
  try {
    const turno = await prisma.turno.findUnique({
      where: { idTurno: Number(req.params.id) },
      include: {
        paciente: {
          select: {
            nombreCompleto: true,
            dni: true,
            domicilio: true,
            fechaNacimiento: true,
          },
        },
        usuario: {
          select: {
            nombreCompleto: true,
            telefono: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(turno);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al obtener informacion de los turnos",
    });
  }
};

export const listarTurnos = async (req, res) => {
  try {
    const turnos = await prisma.turno.findMany();

    if (!turnos) {
      return res.status(404).json({ mensaje: "No hay turnos para listar" });
    }
    res.status(200).json(turnos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al listar los turnos" });
  }
};

export const listarTurnosporUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.idUsuario;
    const turnos = await prisma.turno.findMany({
      where: {
        paciente: {
          usuarioId: usuarioId,
        },
      },
      include: {
        usuario: {
          select: {
            nombreCompleto: true,
          },
        },
        paciente: {
          include: {
            obraSocial: {
              select: {
                nombre: true,
                duracionConsulta: true,
              },
            },
            usuario: {
              select: {
                nombreCompleto: true,
              },
            },
          },
        },
      },
      orderBy: { fecha: "asc" },
    });
    res.status(200).json(turnos);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al listar los turnos del usuario" });
  }
};

export const cambiarEstadoTurno = async (req, res) => {
  try {
    const { estado } = req.body;
    const turnoActualizado = await prisma.turno.updateMany({
      where: { idTurno: Number(req.params.id) },
      data: { estado: estado },
    });

    res
      .status(200)
      .json({
        mensaje: "Turno actualizado correctamente",
        turno: turnoActualizado,
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al cambiar el estado del turno" });
  }
};
