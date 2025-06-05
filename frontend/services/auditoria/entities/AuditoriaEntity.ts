/* eslint-disable @typescript-eslint/no-explicit-any */
export type TipoOperacion = "CREAR" | "ACTUALIZAR" | "ELIMINAR" | "INICIAR_SESION" | "CERRAR_SESION" | "VER" | "EXPORTAR" | "IMPORTAR" | "APROBAR" | "RECHAZAR" | "CANCELAR" | "ACTIVAR" | "DESACTIVAR"

export type NivelAuditoria = "INFO" | "ADVERTENCIA" | "ERROR" | "CRITICO"
export interface AuditoriaLogEntity {
  id:string;
  usuarioId?: string;
  usuario?: {
    email?:string
    name?:string
  }
  fechaHora: Date
  tipoOperacion: TipoOperacion;
  entidad: string;
  entidadId?: string;
  nivel?: NivelAuditoria;
  descripcion: string;
  modulo?: string;
  accion?: string;
  valoresAnteriores?: any;
  valoresNuevos?: any;
  ipAddress?: string;
  userAgent?: string;
  observaciones?: string;
  metadata?: any;
}