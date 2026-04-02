import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  try {
    const token = req.header("x-token");
    if (!token) {
      res.status(401).json({ mensaje: "No hay token en la peticion" });
    }
    const payload = jwt.verify(token, process.env.SECRETJWT);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ mensaje: "Token no valido" });
  }
};
