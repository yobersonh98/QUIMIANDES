-- CreateEnum
CREATE TYPE "TipoOperacion" AS ENUM ('CREAR', 'ACTUALIZAR', 'ELIMINAR', 'INICIAR_SESION', 'CERRAR_SESION', 'VER', 'EXPORTAR', 'IMPORTAR', 'APROBAR', 'RECHAZAR', 'CANCELAR', 'ACTIVAR', 'DESACTIVAR');

-- CreateEnum
CREATE TYPE "NivelAuditoria" AS ENUM ('INFO', 'ADVERTENCIA', 'ERROR', 'CRITICO');

-- CreateTable
CREATE TABLE "AuditoriaLog" (
    "id" TEXT NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT,
    "tipoOperacion" "TipoOperacion" NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "nivel" "NivelAuditoria" NOT NULL DEFAULT 'INFO',
    "descripcion" TEXT NOT NULL,
    "modulo" TEXT,
    "accion" TEXT,
    "valoresAnteriores" JSONB,
    "valoresNuevos" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "observaciones" TEXT,
    "metadata" JSONB,

    CONSTRAINT "AuditoriaLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditoriaLog_entidad_entidadId_idx" ON "AuditoriaLog"("entidad", "entidadId");

-- CreateIndex
CREATE INDEX "AuditoriaLog_fechaHora_tipoOperacion_idx" ON "AuditoriaLog"("fechaHora", "tipoOperacion");

-- CreateIndex
CREATE INDEX "AuditoriaLog_usuarioId_fechaHora_idx" ON "AuditoriaLog"("usuarioId", "fechaHora");

-- AddForeignKey
ALTER TABLE "AuditoriaLog" ADD CONSTRAINT "AuditoriaLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
