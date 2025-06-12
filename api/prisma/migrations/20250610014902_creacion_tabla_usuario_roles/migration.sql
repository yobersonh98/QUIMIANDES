/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "Rol" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funcionalidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "ruta" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "icon" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Funcionalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "funcionalidadId" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "userId" TEXT NOT NULL,
    "rolId" TEXT NOT NULL,
    "asignadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asignadoPor" TEXT,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("userId","rolId")
);

-- CreateTable
CREATE TABLE "RolFuncionalidad" (
    "rolId" TEXT NOT NULL,
    "funcionalidadId" TEXT NOT NULL,
    "asignadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolFuncionalidad_pkey" PRIMARY KEY ("rolId","funcionalidadId")
);

-- CreateTable
CREATE TABLE "RolAccion" (
    "rolId" TEXT NOT NULL,
    "funcionalidadId" TEXT NOT NULL,
    "accionId" TEXT NOT NULL,
    "permitido" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolAccion_pkey" PRIMARY KEY ("rolId","funcionalidadId","accionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionalidad_nombre_key" ON "Funcionalidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Accion_nombre_funcionalidadId_key" ON "Accion"("nombre", "funcionalidadId");

-- AddForeignKey
ALTER TABLE "Accion" ADD CONSTRAINT "Accion_funcionalidadId_fkey" FOREIGN KEY ("funcionalidadId") REFERENCES "Funcionalidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolFuncionalidad" ADD CONSTRAINT "RolFuncionalidad_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolFuncionalidad" ADD CONSTRAINT "RolFuncionalidad_funcionalidadId_fkey" FOREIGN KEY ("funcionalidadId") REFERENCES "Funcionalidad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolAccion" ADD CONSTRAINT "RolAccion_rolId_funcionalidadId_fkey" FOREIGN KEY ("rolId", "funcionalidadId") REFERENCES "RolFuncionalidad"("rolId", "funcionalidadId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolAccion" ADD CONSTRAINT "RolAccion_accionId_fkey" FOREIGN KEY ("accionId") REFERENCES "Accion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
