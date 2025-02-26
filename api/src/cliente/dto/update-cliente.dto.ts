import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoCliente } from '@prisma/client';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiProperty({ example: '12345678', description: 'Número de documento del cliente', required: false })
  documento?: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente', required: false })
  nombre?: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección del cliente', required: false })
  direccion?: string;


  @ApiProperty({ example: `EstadoCliente.ACTIVO`, description: 'Estado del cliente', required: false })
  estado?: EstadoCliente

  @ApiProperty({ example: 'email@email.com', description: 'Correo electrónico del cliente', required: false })
  email?: string;

  @ApiProperty({ example: '1234567890', description: 'Teléfono del cliente', required: false })
  telefono?: string;

  @ApiProperty({ example: 'CC', description: 'Tipo de documento (CC, TI, NIT, etc.)', required: false })
  tipoDocumento?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único del municipio', required: false })
  idMunicipio?: string;


  @ApiProperty({ example: ['550e8400-e29b-41d4-a716-446655440000'], description: 'Lista de IDs de lugares de entrega a agregar', required: false })
  idLugaresEntregaEliminar?: string[];
}
