import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiProperty({ example: '12345678', description: 'Número de documento del cliente', required: false })
  documento?: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente', required: false })
  nombre?: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección del cliente', required: false })
  direccion?: string;
}
