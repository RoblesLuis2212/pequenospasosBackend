import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

//Guardo la cadena de conexion con mi motor de PostgreSQL
const cadenaConexion = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ cadenaConexion });
//Creo un cliente prisma para poder interactuar con la base de datos
export const prisma = new PrismaClient({ adapter });
