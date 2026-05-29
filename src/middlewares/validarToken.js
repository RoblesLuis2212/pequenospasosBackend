import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  try {
    const token = req.header("x-token");
    if (!token) {
      return res.status(401).json({ mensaje: "No hay token en la peticion" });
    }
    const payload = jwt.verify(token, process.env.SECRETJWT);
    req.usuario = payload;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ mensaje: "Token no valido" });
  }
};

export default verificarToken;
