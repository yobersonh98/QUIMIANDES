import { PartialType } from '@nestjs/mapped-types';
import { CreateEntregaDto } from './create-entrega.dto';
import { EstadoEntrega } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UpdateEntregaDto extends PartialType(CreateEntregaDto) {
  @IsString()
  @IsEnum(EstadoEntrega)
  estado?: EstadoEntrega
}
