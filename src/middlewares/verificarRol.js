export const verificarRol = (req, res, next) => {
  try {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ mensaje: "No autenticado" });
    }

    if (usuario.rol !== "ADMIN") {
      return res
        .status(403)
        .json({ mensaje: "No posee permisos de administrador" });
    }
    next();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error en la verificacion de roles" });
  }
};
