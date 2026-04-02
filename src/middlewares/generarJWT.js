import jwt from "jsonwebtoken";

const generarJWT = (email, rol) => {
  try {
    //construccion del payload con los datos del usuario
    const payload = { email, rol };
    const token = jwt.sign(payload, process.env.SECRETWJT);
    return token;
  } catch (err) {
    console.error(err);
    throw new Error("Error al generar el token");
  }
};

export default generarJWT;
