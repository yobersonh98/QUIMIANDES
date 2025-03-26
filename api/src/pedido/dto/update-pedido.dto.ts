import { EstadoPedido } from '@prisma/client';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDetallePedidoDto } from '../../detalle-pedido/dto/update-detalle-pedido.dto';
import { CreateDetallePedidoDto } from '../../detalle-pedido/dto/create-detalle-pedido.dto';

export class UpdatePedidoDto  {

    @IsOptional() // ✅ Hace que estado sea opcional
    estado?: EstadoPedido

    @IsOptional()
    @IsNumber()
    pesoDespachado?: number
    @IsOptional()
    fechaEntrega?: string 

    @IsString()
    @IsOptional()
    observaciones?:string 

    @IsString()
    @IsOptional()
    ordenCompra?:string

    @IsOptional() // ✅ Hace que detallesPedido sea opcional
    @IsArray() // ✅ Asegura que sea un array
    @ValidateNested({ each: true }) // ✅ Valida cada elemento dentro del array
    @Type(() => UpdateDetallePedidoDto)
    detallesPedido?: UpdateDetallePedidoDto[]; // ✅ Transforma los datos al tipo esperado

}
