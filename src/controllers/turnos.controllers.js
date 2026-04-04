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
