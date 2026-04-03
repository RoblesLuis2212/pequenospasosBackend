import jwt from "jsonwebtoken";

const generarJWT = (idUsuario, email, rol) => {
  try {
    //construccion del payload con los datos del usuario
    const payload = { idUsuario, email, rol };
    const token = jwt.sign(payload, process.env.SECRETJWT, { expiresIn: "3h" });
    return token;
  } catch (err) {
    console.error(err);
    throw new Error("Error al generar el token");
  }
};

export default generarJWT;
