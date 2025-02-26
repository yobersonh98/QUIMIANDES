import { PartialType } from '@nestjs/swagger';
import { CreateLugarEntregaDto } from './create-lugar-entrega.dto';

export class UpdateLugarEntregaDto extends PartialType(CreateLugarEntregaDto) {}
