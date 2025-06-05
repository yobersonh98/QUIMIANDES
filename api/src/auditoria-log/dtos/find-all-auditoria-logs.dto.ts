import { NivelAuditoria, TipoOperacion } from "@prisma/client";
import { PaginationDto } from "../../common/dtos/pagination.dto";

export class FindAllAuditoriaLogsDto extends PaginationDto {
  usuarioId?: string;
  usuarioEmail?: string;
  entidad?: string;
  tipoOperacion?: TipoOperacion;
  nivel?: NivelAuditoria;
  modulo?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}
