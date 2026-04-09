import { prisma } from "../server/prisma.js";

export const agregarPaciente = async (req, res) => {
  try {
    const { nombreCompleto, dni, domicilio, fechaNacimiento, usuarioId } =
      req.body;
    const nuevoPaciente = await prisma.paciente.create({
      data: {
        nombreCompleto,
        dni,
        domicilio,
        fechaNacimiento: new Date(fechaNacimiento),
        usuarioId,
      },
    });
    res.status(201).json({
      mensaje: "Paciente agregado exitosamente",
      paciente: nuevoPaciente,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al agregar el paciente" });
  }
};

export const listarPacientes = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany();

    res.status(200).json(pacientes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al listar los pacientes" });
  }
};

export const actualizarDatos = async (req, res) => {
  try {
    const idPaciente = Number(req.params.id);

    const paciente = await prisma.paciente.findUnique({
      where: { idPaciente },
    });

    if (!paciente) {
      return res.status(404).json({ mensaje: "El paciente no existe" });
    }

    const pacienteActualizado = await prisma.paciente.update({
      where: { idPaciente },
      data: req.body,
    });

    res.status(200).json({
      mensaje: "Datos actualizados exitosamente",
      paciente: pacienteActualizado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al actualizar los datos del paciente",
    });
  }
};

export const obtenerPacienteID = async (req, res) => {
  try {
    const datosPaciente = await prisma.paciente.findUnique({
      where: { idPaciente: Number(req.params.id) },
      //Hacemos la consulta y utilizamos include que funciona como un JOIN
      include: {
        //Especificamos la otra tabla con la que se relaciona en este caso "usuarios"
        usuario: {
          //Select para solo traer datos concretos
          select: {
            nombreCompleto: true,
            telefono: true,
            email: true,
          },
        },
        obraSocial: {
          select: {
            nombre: true,
            precioConsulta: true,
            duracionConsulta: true,
          },
        },
      },
    });
    if (!datosPaciente) {
      return res
        .status(404)
        .json({ mensaje: "No hay datos del paciente para mostrar" });
    }
    res.status(200).json(datosPaciente);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al obtener los datos del paciente" });
  }
};
