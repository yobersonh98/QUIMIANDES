import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, Request } from '@nestjs/common';
import { DetallePedidoService } from './detalle-pedido.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';

@Controller('detalle-pedido')
export class DetallePedidoController {
  constructor(private readonly detallePedidoService: DetallePedidoService) {}

  @Post()
  create(@Body() createDetallePedidoDto: CreateDetallePedidoDto) {
    return this.detallePedidoService.create(createDetallePedidoDto);
  }

  @Get()
  findAll(@Query('pedidoId') pedidoId: string) {
    return this.detallePedidoService.findAll(pedidoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallePedidoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallePedidoDto: UpdateDetallePedidoDto, @Request() req) {
    updateDetallePedidoDto.usuarioId = req?.user?.sub
    return this.detallePedidoService.actualizarConValidacion(id, updateDetallePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallePedidoService.remove(id);
  }
}
