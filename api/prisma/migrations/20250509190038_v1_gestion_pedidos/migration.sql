-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERUSER');

-- CreateEnum
CREATE TYPE "EstadoCliente" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('NIT', 'CC', 'CE', 'TI', 'PASAPORTE');

-- CreateEnum
CREATE TYPE "TipoEntregaProducto" AS ENUM ('RECOGE_EN_PLANTA', 'ENTREGA_AL_CLIENTE');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "UnidadMedida" AS ENUM ('UND', 'KG', 'L', 'M3', 'M2');

-- CreateEnum
CREATE TYPE "EstadoDetallePedido" AS ENUM ('PENDIENTE', 'EN_TRANSITO', 'PARCIAL', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PENDIENTE', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL DEFAULT 'NIT',
    "nombre" TEXT NOT NULL,
    "idMunicipio" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "zonaBarrio" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "estado" "EstadoCliente" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL DEFAULT 'NIT',
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT NOT NULL DEFAULT '',
    "facturaIva" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presentacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Presentacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "idPresentacion" TEXT NOT NULL,
    "idProveedor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "pesoVolumen" DOUBLE PRECISION NOT NULL,
    "precioBase" DOUBLE PRECISION NOT NULL,
    "unidadMedida" "UnidadMedida" NOT NULL DEFAULT 'UND',

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventarioCliente" (
    "id" TEXT NOT NULL,
    "idCliente" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "precioEspecial" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InventarioCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idCliente" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleCotizacion" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleCotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "fechaRecibido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idCliente" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "codigo" BIGSERIAL NOT NULL,
    "observaciones" TEXT,
    "fechaEntrega" TIMESTAMP(3),
    "tiempoEntrega" INTEGER,
    "pesoDespachado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ordenCompra" TEXT,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoDocumento" (
    "id" TEXT NOT NULL,
    "documentoId" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,

    CONSTRAINT "PedidoDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallePedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "lugarEntregaId" TEXT,
    "codigo" BIGSERIAL NOT NULL,
    "productoId" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" TIMESTAMP(3),
    "remision" TEXT,
    "unidades" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" "EstadoDetallePedido" NOT NULL DEFAULT 'PENDIENTE',
    "tipoEntrega" "TipoEntregaProducto" NOT NULL DEFAULT 'ENTREGA_AL_CLIENTE',
    "precioUnitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidadDespachada" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidadEntregada" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidadProgramada" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "DetallePedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" TEXT NOT NULL,
    "codigo" BIGSERIAL NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "vehiculoInterno" TEXT,
    "vehiculoExterno" TEXT,
    "entregadoPorA" TEXT,
    "tipoEntrega" TEXT,
    "fechaEntrega" TIMESTAMP(3),
    "remision" TEXT,
    "observaciones" TEXT,
    "estado" "EstadoEntrega" NOT NULL DEFAULT 'PENDIENTE',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntregaProducto" (
    "id" TEXT NOT NULL,
    "entregaId" TEXT NOT NULL,
    "detallePedidoId" TEXT NOT NULL,
    "cantidadDespachada" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidadDespachar" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidadEntregada" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fechaEntrega" TIMESTAMP(3),
    "observaciones" TEXT,

    CONSTRAINT "EntregaProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LugarEntrega" (
    "id" TEXT NOT NULL,
    "idCliente" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "idCiudad" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LugarEntrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "idDepartamento" TEXT NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "idPais" TEXT NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pais" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_documento_key" ON "Cliente"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_documento_key" ON "Proveedor"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_codigo_key" ON "Pedido"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "DetallePedido_codigo_key" ON "DetallePedido"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_codigo_key" ON "Entrega"("codigo");

-- CreateIndex
CREATE INDEX "LugarEntrega_nombre_idx" ON "LugarEntrega"("nombre");

-- CreateIndex
CREATE INDEX "Municipio_nombre_idx" ON "Municipio"("nombre");

-- CreateIndex
CREATE INDEX "Departamento_nombre_idx" ON "Departamento"("nombre");

-- CreateIndex
CREATE INDEX "Pais_nombre_idx" ON "Pais"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Document_path_key" ON "Document"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Document_url_key" ON "Document"("url");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_idMunicipio_fkey" FOREIGN KEY ("idMunicipio") REFERENCES "Municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_idPresentacion_fkey" FOREIGN KEY ("idPresentacion") REFERENCES "Presentacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_idProveedor_fkey" FOREIGN KEY ("idProveedor") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioCliente" ADD CONSTRAINT "InventarioCliente_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioCliente" ADD CONSTRAINT "InventarioCliente_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCotizacion" ADD CONSTRAINT "DetalleCotizacion_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCotizacion" ADD CONSTRAINT "DetalleCotizacion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoDocumento" ADD CONSTRAINT "PedidoDocumento_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoDocumento" ADD CONSTRAINT "PedidoDocumento_documentoId_fkey" FOREIGN KEY ("documentoId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_lugarEntregaId_fkey" FOREIGN KEY ("lugarEntregaId") REFERENCES "LugarEntrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaProducto" ADD CONSTRAINT "EntregaProducto_detallePedidoId_fkey" FOREIGN KEY ("detallePedidoId") REFERENCES "DetallePedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregaProducto" ADD CONSTRAINT "EntregaProducto_entregaId_fkey" FOREIGN KEY ("entregaId") REFERENCES "Entrega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LugarEntrega" ADD CONSTRAINT "LugarEntrega_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LugarEntrega" ADD CONSTRAINT "LugarEntrega_idCiudad_fkey" FOREIGN KEY ("idCiudad") REFERENCES "Municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipio" ADD CONSTRAINT "Municipio_idDepartamento_fkey" FOREIGN KEY ("idDepartamento") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departamento" ADD CONSTRAINT "Departamento_idPais_fkey" FOREIGN KEY ("idPais") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
