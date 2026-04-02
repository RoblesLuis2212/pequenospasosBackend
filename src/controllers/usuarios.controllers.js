import { basename } from "node:path";
import { prisma } from "../server/prisma.js";
import bcrypt from "bcrypt";
import generarJWT from "../middlewares/generarJWT.js";

export const crearUsuario = async (req, res) => {
  try {
    const saltos = bcrypt.genSaltSync(10);
    const passwordEncriptado = bcrypt.hashSync(req.body.password, saltos);
    req.body.password = passwordEncriptado;
    const nuevoUsuario = await prisma.usuario.create({
      data: req.body,
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //verificar email
    const usuarioBuscado = await prisma.usuario.findUnique({
      where: { email },
    });

    //verificamos que el correo exista
    if (!usuarioBuscado) {
      return res.status(404).json({ mensaje: "Usuario no existe" });
    }

    //verificar si la contraseña es correcta
    const passwordValido = bcrypt.compareSync(
      password,
      usuarioBuscado.password,
    );
    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    //generacion del token
    const token = generarJWT(
      usuarioBuscado.idUsuario,
      usuarioBuscado.email,
      usuarioBuscado.rol,
    );
    res.status(200).json({
      mensaje: "Inicio de sesion exitoso",
      usuario: {
        id: usuarioBuscado.idUsuario,
        nombre: usuarioBuscado.nombreCompleto,
        rol: usuarioBuscado.rol,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al iniciar sesion" });
  }
};

export const obtenerUsuarioID = async (req, res) => {
  try {
    const usuarioBuscado = await prisma.usuario.findUnique({
      where: { idUsuario: Number(req.params.id) },
      //utilizo un select para evitar traer datos datos sensibles (por ejemplo la contraseña)
      select: {
        idUsuario: true,
        nombreCompleto: true,
        email: true,
        telefono: true,
      },
    });
    if (!usuarioBuscado) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuarioBuscado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al obtener el usuario" });
  }
};

export const cambiarContrasena = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword, confirmarPassword } = req.body;
    const idUsuario = req.usuario.idUsuario;

    //validamos que las dos contraseñas coincidan
    if (nuevaPassword !== confirmarPassword) {
      return res.status(404).json({ error: "Las contraseñas no coinciden" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario },
    });

    if (!usuario) {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    //verificamos que la contraseña actual sea correcta
    const passwordValida = bcrypt.compareSync(passwordActual, usuario.password);

    if (!passwordValida) {
      return res
        .status(400)
        .json({ error: "La contraseña actual es incorrecta" });
    }
    //verificamos que la nueva contraseña no sea igual a la anterior
    const mismoPassword = bcrypt.compareSync(nuevaPassword, usuario.password);
    if (mismoPassword) {
      return res.status(400).json({
        error: "La nueva contraseña no puede ser igual a la anterior",
      });
    }

    const passwordEncriptado = bcrypt.hashSync(nuevaPassword, 10);
    await prisma.usuario.update({
      where: { idUsuario },
      data: { password: passwordEncriptado },
    });
    res.status(200).json({
      mensaje: "Contraseña actualizada exitosamente",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al cambiar la contraseña" });
  }
};
