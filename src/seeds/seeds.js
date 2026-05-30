import { prisma } from "../server/prisma.js";
import bcrypt from "bcrypt";

const Roles = [{ nombre: "ADMIN" }, { nombre: "PADRE" }];

const obrasSociales = [
  { nombre: "Subsidio", precioConsulta: 25000, duracionConsulta: "30 minutos" },
  { nombre: "Soremer", precioConsulta: 25000, duracionConsulta: "30 minutos" },
  {
    nombre: "San Nicolas",
    precioConsulta: 25000,
    duracionConsulta: "30 minutos",
  },
  {
    nombre: "Swiss Medical",
    precioConsulta: 25000,
    duracionConsulta: "30 minutos",
  },
  {
    nombre: "Ricardo Mora",
    precioConsulta: 25000,
    duracionConsulta: "30 minutos",
  },
];

const metodosPago = [
  { nombre: "EFECTIVO" },
  { nombre: "TRANSFERENCIA" },
  { nombre: "DEBITO" },
  { nombre: "CREDITO" },
];

const seedRoles = async () => {
  for (const rol of Roles) {
    const existe = await prisma.rolUsuario.findUnique({
      where: { nombre: rol.nombre },
    });
    if (!existe) {
      await prisma.rolUsuario.create({ data: rol });
    }
  }
};

const seedsObrasSociales = async () => {
  for (const obra of obrasSociales) {
    const existe = await prisma.obraSocial.findUnique({
      where: { nombre: obra.nombre },
    });
    if (!existe) {
      await prisma.obraSocial.create({ data: obra.nombre });
    }
  }
};

const seedsMetodosPago = async () => {
  for (const mp of metodosPago) {
    const existe = await prisma.metodoPago.findUnique({
      where: { nombre: mp.nombre },
    });
    if (!existe) {
      await prisma.metodoPago.create({ data: mp });
    }
  }
};

const seedsUsuarioAdministrador = async () => {
  const adminExistente = await prisma.usuario.findFirst({
    where: { rol: { nombre: "ADMIN" } },
  });

  if (adminExistente) {
    console.log("Usuario administador encontrado, iniciando sistema...");
    return;
  }

  console.log("Usuario administrador no encontrado, creando uno...");
  const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

  await prisma.usuario.create({
    email: process.env.ADMIN_EMAIL,
  });

  console.log("Usuario administrador creado exitosamente");
};

export const ejecutarSeeds = async () => {
  console.clear();
  console.log("Verificando datos iniciales...");
  await seedRoles();
  await seedsObrasSociales();
  await seedsMetodosPago();
  await seedsUsuarioAdministrador();
  console.log("Datos iniciales listos");
};
