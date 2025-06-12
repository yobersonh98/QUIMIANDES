-- CreateEnum
CREATE TYPE "MetodoHTTP" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH');

-- CreateTable
CREATE TABLE "Endpoint" (
    "id" TEXT NOT NULL,
    "ruta" TEXT NOT NULL,
    "metodo" "MetodoHTTP" NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndpointAccion" (
    "accionId" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EndpointAccion_pkey" PRIMARY KEY ("accionId","endpointId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Endpoint_ruta_metodo_key" ON "Endpoint"("ruta", "metodo");

-- AddForeignKey
ALTER TABLE "EndpointAccion" ADD CONSTRAINT "EndpointAccion_accionId_fkey" FOREIGN KEY ("accionId") REFERENCES "Accion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndpointAccion" ADD CONSTRAINT "EndpointAccion_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "Endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
