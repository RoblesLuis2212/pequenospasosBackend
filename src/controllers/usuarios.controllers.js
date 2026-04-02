import { prisma } from "../server/prisma.js";

export const crearUsuario = async (req, res) => {
  try {
    const { nombreCompleto, telefono, email, password, rolId } = req.body;

    console.log(req.body);
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombreCompleto,
        telefono,
        email,
        password,
        rol: {
          connect: {
            idRol: rolId,
          },
        },
      },
    });

    res
      .status(201)
      .json({ mensaje: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al crear el usuario" });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const alumnos = await prisma.usuario.findMany();

    res.status(200).json(alumnos);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al listar los usuarios" });
  }
};

export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: Number(id) },
    });
    //Verificamos que el usuario exista en la base de datos
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const nuevoEstado = usuario.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    const usuarioActualizado = await prisma.usuario.update({
      where: { idUsuario: Number(id) },
      data: { estado: nuevoEstado },
    });

    res
      .status(200)
      .json({ mensaje: "Estado del usuario actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al cambiar el estado del usuario" });
  }
};
