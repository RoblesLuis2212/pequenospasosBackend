import { prismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const cadenaConexion = `${process.env.DATABASE_URL}`;

const adapter = new prismaPg({ cadenaConexion });
export const prisma = new PrismaClient({ adapter });
