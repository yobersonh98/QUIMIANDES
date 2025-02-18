-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "documento" TEXT NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "zonaBarrio" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("documento")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "documento" TEXT NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("documento")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "unidadMedida" TEXT NOT NULL,
    "pesoVolumen" DOUBLE PRECISION NOT NULL,
    "precioBase" DOUBLE PRECISION NOT NULL,
    "proveedorDocumento" TEXT NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventarioCliente" (
    "id" TEXT NOT NULL,
    "clienteDocumento" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "precioEspecial" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InventarioCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteDocumento" TEXT NOT NULL,
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
    "clienteDocumento" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "observaciones" TEXT,
    "fechaRequerimiento" TIMESTAMP(3) NOT NULL,
    "fechaEntrega" TIMESTAMP(3),
    "tiempoEntrega" INTEGER,
    "pesoDespachado" DOUBLE PRECISION,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallePedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "unidades" INTEGER NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetallePedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "vehiculoInterno" TEXT,
    "vehiculoExterno" TEXT,
    "entregadoPorA" TEXT NOT NULL,
    "lugarEntrega" TEXT NOT NULL,
    "tipoEntrega" TEXT NOT NULL,
    "remision" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "numeroOrden" TEXT NOT NULL,
    "fechaRequerimiento" TIMESTAMP(3) NOT NULL,
    "tiempoEntrega" INTEGER NOT NULL,
    "pesoDespachado" DOUBLE PRECISION NOT NULL,
    "remision" TEXT,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_proveedorDocumento_fkey" FOREIGN KEY ("proveedorDocumento") REFERENCES "Proveedor"("documento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioCliente" ADD CONSTRAINT "InventarioCliente_clienteDocumento_fkey" FOREIGN KEY ("clienteDocumento") REFERENCES "Cliente"("documento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioCliente" ADD CONSTRAINT "InventarioCliente_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_clienteDocumento_fkey" FOREIGN KEY ("clienteDocumento") REFERENCES "Cliente"("documento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCotizacion" ADD CONSTRAINT "DetalleCotizacion_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCotizacion" ADD CONSTRAINT "DetalleCotizacion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteDocumento_fkey" FOREIGN KEY ("clienteDocumento") REFERENCES "Cliente"("documento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
