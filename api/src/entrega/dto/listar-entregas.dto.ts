import { EstadoEntrega } from "@prisma/client";
import { PaginationDto } from "../../common/dtos/pagination.dto";
import { IsOptional, IsString } from "class-validator";

export class ListarEntregasDto extends PaginationDto {
  @IsString()
  @IsOptional()
  estado?: EstadoEntrega

  @IsOptional()
  @IsString()
  pedidoId:string
}