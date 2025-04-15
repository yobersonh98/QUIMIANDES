import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { ListarPedidoDto } from './dto/listar-pedido.dto';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll(@Query() searchParams: ListarPedidoDto) {
    return this.pedidoService.findAll(searchParams);
  }

  @Post(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.pedidoService.cancelarPedido(id);
  }

  @Post(':id/finalizar-entrega')
  finalizarEntrega(@Param('id') id: string) {
    return this.pedidoService.finalizarEntregaPedido(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(id);
  }

  
}
