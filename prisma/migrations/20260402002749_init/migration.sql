-- CreateEnum
CREATE TYPE "EstadoProducto" AS ENUM ('DISPONIBLE', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "NombreMetodoPago" AS ENUM ('TRANSFERENCIA', 'DEBITO', 'CREDITO', 'EFECTIVO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'PADRE', 'EMPLEADO');

-- CreateEnum
CREATE TYPE "TipoToken" AS ENUM ('RECUPERACION_CONTRASENA', 'VALIDACION_CORREO');

-- CreateEnum
CREATE TYPE "TurnoCursado" AS ENUM ('MANANA', 'TARDE', 'NOCHE');

-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('PENDIENTE', 'APROBADO', 'CANCELADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoSaldo" AS ENUM ('INGRESO', 'CONSUMO', 'AJUSTE');

-- CreateEnum
CREATE TYPE "EstadoCarrito" AS ENUM ('ACTIVO', 'COMPRADO');

-- CreateTable
CREATE TABLE "Producto" (
    "idProducto" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imagen" TEXT NOT NULL,
    "fechaUltimaActualizacion" TIMESTAMP(3) NOT NULL,
    "codigoBarras" TEXT NOT NULL,
    "estado" "EstadoProducto" NOT NULL DEFAULT 'DISPONIBLE',
    "categoriaId" INTEGER,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("idProducto")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "idCategoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateTable
CREATE TABLE "Ventas" (
    "idVenta" SERIAL NOT NULL,
    "fechaCompra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(65,30) NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoVenta" NOT NULL DEFAULT 'PENDIENTE',
    "metodoPagoId" INTEGER NOT NULL,
    "cajaId" INTEGER NOT NULL,

    CONSTRAINT "Ventas_pkey" PRIMARY KEY ("idVenta")
);

-- CreateTable
CREATE TABLE "DetalleVenta" (
    "idDetalleVenta" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(65,30) NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("idDetalleVenta")
);

-- CreateTable
CREATE TABLE "MetodoPago" (
    "idMetodoPago" SERIAL NOT NULL,
    "nombre" "NombreMetodoPago" NOT NULL,

    CONSTRAINT "MetodoPago_pkey" PRIMARY KEY ("idMetodoPago")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "RolUsuario" (
    "idRol" SERIAL NOT NULL,
    "nombre" "Rol" NOT NULL,

    CONSTRAINT "RolUsuario_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "TokenUsuario" (
    "idToken" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoToken" NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "TokenUsuario_pkey" PRIMARY KEY ("idToken")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "idPaciente" SERIAL NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "domicilo" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("idPaciente")
);

-- CreateTable
CREATE TABLE "FichaMedica" (
    "idFicha" SERIAL NOT NULL,
    "edad_camino" TEXT,
    "socializacion" TEXT,
    "derivacion" TEXT,
    "horarios_sueño" TEXT,
    "contacto_visual" TEXT,
    "actividades" TEXT,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "FichaMedica_pkey" PRIMARY KEY ("idFicha")
);

-- CreateTable
CREATE TABLE "DatosEscolares" (
    "idDatosEscolares" SERIAL NOT NULL,
    "escuela" TEXT NOT NULL,
    "turno" "TurnoCursado" NOT NULL,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "DatosEscolares_pkey" PRIMARY KEY ("idDatosEscolares")
);

-- CreateTable
CREATE TABLE "ObraSocial" (
    "idObraSocial" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precioConsulta" DECIMAL(65,30) NOT NULL,
    "duracionConsulta" TEXT NOT NULL,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "ObraSocial_pkey" PRIMARY KEY ("idObraSocial")
);

-- CreateTable
CREATE TABLE "EvolucionPaciente" (
    "idEvolucion" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "EvolucionPaciente_pkey" PRIMARY KEY ("idEvolucion")
);

-- CreateTable
CREATE TABLE "Turno" (
    "idTurno" SERIAL NOT NULL,
    "estado" "EstadoTurno" NOT NULL DEFAULT 'PENDIENTE',
    "fecha" TIMESTAMP(3) NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("idTurno")
);

-- CreateTable
CREATE TABLE "SaldoPaciente" (
    "idSaldo" SERIAL NOT NULL,
    "cantidad" DECIMAL(65,30) NOT NULL,
    "tipo" "TipoMovimientoSaldo" NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "SaldoPaciente_pkey" PRIMARY KEY ("idSaldo")
);

-- CreateTable
CREATE TABLE "Carrito" (
    "idCarrito" SERIAL NOT NULL,
    "estado" "EstadoCarrito" NOT NULL DEFAULT 'ACTIVO',
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("idCarrito")
);

-- CreateTable
CREATE TABLE "DetalleCarrito" (
    "idDetalleCarrito" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(65,30) NOT NULL,
    "carritoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "DetalleCarrito_pkey" PRIMARY KEY ("idDetalleCarrito")
);

-- CreateTable
CREATE TABLE "Caja" (
    "idCaja" SERIAL NOT NULL,
    "fechaApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierre" TIMESTAMP(3),
    "montoCierre" DECIMAL(65,30),
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Caja_pkey" PRIMARY KEY ("idCaja")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoBarras_key" ON "Producto"("codigoBarras");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "MetodoPago_nombre_key" ON "MetodoPago"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RolUsuario_nombre_key" ON "RolUsuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "TokenUsuario_token_key" ON "TokenUsuario"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_dni_key" ON "Paciente"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "ObraSocial_nombre_key" ON "ObraSocial"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Turno_fecha_key" ON "Turno"("fecha");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("idCategoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "MetodoPago"("idMetodoPago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "Caja"("idCaja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Ventas"("idVenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "RolUsuario"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenUsuario" ADD CONSTRAINT "TokenUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaMedica" ADD CONSTRAINT "FichaMedica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("idPaciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatosEscolares" ADD CONSTRAINT "DatosEscolares_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("idPaciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObraSocial" ADD CONSTRAINT "ObraSocial_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("idPaciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvolucionPaciente" ADD CONSTRAINT "EvolucionPaciente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("idPaciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("idPaciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaldoPaciente" ADD CONSTRAINT "SaldoPaciente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("idPaciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCarrito" ADD CONSTRAINT "DetalleCarrito_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "Carrito"("idCarrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCarrito" ADD CONSTRAINT "DetalleCarrito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
