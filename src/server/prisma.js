import { prismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

//Guardo la cadena de conexion con mi motor de PostgreSQL
const cadenaConexion = `${process.env.DATABASE_URL}`;

const adapter = new prismaPg({ cadenaConexion });
//Creo un cliente prisma para poder interactuar con la base de datos
export const prisma = new PrismaClient({ adapter });
