import { basename } from "node:path";
import { prisma } from "../server/prisma.js";
import bcrypt from "bcrypt";
import generarJWT from "../middlewares/generarJWT.js";
import { token } from "morgan";
import { Resend } from "resend";
import { json } from "node:stream/consumers";
import crypto from "crypto";

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
      include: { rol: true },
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
      usuarioBuscado.rol.nombre,
    );
    res.status(200).json({
      mensaje: "Inicio de sesion exitoso",
      usuario: {
        id: usuarioBuscado.idUsuario,
        nombre: usuarioBuscado.nombreCompleto,
        rol: usuarioBuscado.rol.nombre,
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

        pacientes: {
          select: {
            idPaciente: true,
            nombreCompleto: true,
            dni: true,
            fechaNacimiento: true,
            domicilio: true,
          },
        },
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

export const editarUsuario = async (req, res) => {
  try {
    const idUsuario = Number(req.params.id);

    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario },
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const { nombreCompleto, telefono, email, rolId } = req.body;
    const usuarioActualizado = await prisma.usuario.update({
      where: { idUsuario },
      data: {
        nombreCompleto,
        telefono,
        email,
        rol: {
          connect: { idRol: rolId },
        },
      },
    });

    res.status(200).json({
      mensaje: "Datos actualizados exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al editar los datos del usuario" });
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const correoOlvidoPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res
        .status(200)
        .json({ mensaje: "Si el email existe, se envio un enlace al correo" });
    }
    //invalidar tokens anteriores
    await prisma.tokenUsuario.updateMany({
      where: {
        usuarioId: usuario.idUsuario,
        tipo: "RECUPERACION_CONTRASENA",
        usado: false,
      },
      data: { usado: true },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const fechaExpiracion = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    //se genera un nuevo token
    await prisma.tokenUsuario.create({
      data: {
        token,
        fechaExpiracion,
        tipo: "RECUPERACION_CONTRASENA",
        usado: false,
        usuarioId: usuario.idUsuario,
      },
    });

    const linkOlvidoPassword = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Recuperar contraseña",
      html: `
        <p>Hola ${usuario.nombreCompleto},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>
          <a href="${linkOlvidoPassword}">Hacer clic aquí para restablecer tu contraseña</a>
        </p>
        <p>Este enlace expira en 1 hora. Si no solicitaste esto, ignorá este email.</p>
      `,
    });
    res.status(200).json({ mensaje: "Si el email existe recibiras un enlace" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error interno en el servidor" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, nuevaPassword } = req.body;
  try {
    const tokenRecord = await prisma.tokenUsuario.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return res.status(400).json({ mensaje: "Token invalido" });
    }

    if (tokenRecord.usado) {
      return res.status(400).json({ mensaje: "El token ya fue utilizado" });
    }

    if (tokenRecord.fechaExpiracion < new Date()) {
      return res.status(400).json({ mensaje: "El token expiro" });
    }

    if (tokenRecord.tipo !== "RECUPERACION_CONTRASENA") {
      return res.status(400).json({ mensaje: "Token invalido" });
    }

    const passwordHash = bcrypt.hashSync(nuevaPassword, 10);
    await prisma.$transaction([
      prisma.usuario.update({
        where: { idUsuario: tokenRecord.usuarioId },
        data: { password: passwordHash },
      }),
    ]);

    prisma.tokenUsuario.update({
      where: { idToken: tokenRecord.idToken },
      data: { usado: true },
    });

    res.status(200).json({ mensaje: "Contraseña actualizada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const listarUsuariosPadres = async (req, res) => {
  try {
    const padres = await prisma.usuario.findMany({
      where: {
        rol: {
          nombre: "PADRE",
        },
      },
    });
    res.status(200).json(padres);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      mensaje: "Ocurrio un error al listar los usuarios con rol de padres",
    });
  }
};
