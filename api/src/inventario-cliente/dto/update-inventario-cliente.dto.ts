import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioClienteDto } from './create-inventario-cliente.dto';

export class UpdateInventarioClienteDto extends PartialType(CreateInventarioClienteDto) {}
