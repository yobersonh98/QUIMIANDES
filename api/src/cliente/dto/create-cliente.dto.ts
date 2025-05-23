import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TipoDocumento } from '@prisma/client';

class CreateInventarioDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único del producto' })
  @IsUUID()
  @IsNotEmpty()
  productoId: string;

  @ApiProperty({ example: 100.50, description: 'Precio especial del producto' })
  @IsNumber()
  @IsNotEmpty()
  precioEspecial: number;
}

class CreatePedidoDto {
  @ApiProperty({ example: 'Pendiente', description: 'Estado del pedido' })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ example: 'Entrega urgente', description: 'Observaciones sobre el pedido', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({ example: '2024-03-10T10:00:00.000Z', description: 'Fecha de requerimiento del pedido' })
  @IsNotEmpty()
  fechaRequerimiento: Date;

  @ApiProperty({ example: '2024-03-15T15:00:00.000Z', description: 'Fecha de entrega del pedido', required: false })
  @IsOptional()
  fechaEntrega?: Date;

  @ApiProperty({ example: 25.4, description: 'Peso despachado en kg', required: false })
  @IsOptional()
  @IsNumber()
  pesoDespachado?: number;
}

class CreateCotizacionDto {
  @ApiProperty({ example: 1500, description: 'Total de la cotización' })
  @IsNumber()
  @IsNotEmpty()
  total: number;
}
export class CrearLugarEntregaDto {

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único del lugar' })
  @IsOptional()
  @IsString()
  id?:string;

  @ApiProperty({ example: 'nombre', description: 'Nombre del lugar de entrega' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único de la ciudad' })
  @IsString()
  @IsNotEmpty()
  idCiudad: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección del lugar de entrega' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre de contacto del lugar de entrega' })
  @IsString()
  @IsNotEmpty()
  contacto: string;

  @ApiProperty({ example: '1234567890', description: 'Teléfono de contacto del lugar de entrega' })
  @IsString()
  @IsNotEmpty()
  telefonoEntregas: string;

}

export class CreateClienteDto {
  @ApiProperty({ example: '12345678', description: 'Número de documento del cliente' })
  @IsString()
  @IsNotEmpty()
  documento: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único del municipio' })
  @IsString()
  @IsNotEmpty()
  idMunicipio: string;

  @ApiProperty({ example: 'CC', description: 'Tipo de documento (CC, TI, NIT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tipoDocumento: TipoDocumento;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del cliente' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección del cliente' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ example: 'mail@gmail.com', description: 'Correo electrónico del cliente', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Pedro Perez', description: 'Nombre de contacto', required: false })
  @IsOptional()
  @IsString()
  contactoPrincipal?: string;

  @ApiProperty({ example: '1234567890', description: 'Teléfono del cliente', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;
  
  @ApiProperty({ example: 'Pedro Perez', description: 'Nombre de contacto para pagos', required: false })
  @IsOptional()
  @IsString()
  contactoPagos?: string;

  @ApiProperty({ example: '1234567890', description: 'Teléfono de contacto para pagos', required: false })
  @IsOptional()
  @IsString()
  telefonoPagos?: string;

  @ApiProperty({ example: 'Zona Norte', description: 'Zona o barrio del cliente', required: false })
  @IsOptional()
  @IsString()
  zonaBarrio?: string;

  @ApiProperty({ type: [CrearLugarEntregaDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearLugarEntregaDto)
  lugaresEntrega?: CrearLugarEntregaDto[];
}


