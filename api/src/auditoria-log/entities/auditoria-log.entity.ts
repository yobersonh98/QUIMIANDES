import { NivelAuditoria, TipoOperacion } from "@prisma/client";

export interface AuditoriaLogEntity {
  id:string;
  usuarioId?: string;
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