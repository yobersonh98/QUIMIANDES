import { EstadoPedido } from "@prisma/client";
import { PaginationDto } from "../../common/dtos/pagination.dto";
import { IsOptional, IsString } from "class-validator";

export class ListarPedidoDto extends PaginationDto {
  @IsString()
  @IsOptional()
  estado?: string
}