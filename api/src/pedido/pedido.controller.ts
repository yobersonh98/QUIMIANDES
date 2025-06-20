import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, Request } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { ListarPedidoDto } from './dto/listar-pedido.dto';
import { AuditoriaInterceptor } from './../auditoria-log/auditoria.interceptor';
import { Auditable } from './../auditoria-log/auditoria.interceptor';
import { NivelAuditoria, TipoOperacion } from '@prisma/client';

@Controller('pedidos')
@UseInterceptors(AuditoriaInterceptor)
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto, @Request() req) {
    createPedidoDto.usuarioId = req.user.sub
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll(@Query() searchParams: ListarPedidoDto) {
    return this.pedidoService.findAll(searchParams);
  }

  @Post(':id/cancelar')
  @Auditable({
    operacion: 'CANCELAR',
    descripcion: (r) => `Se canceló el pedido ${r.codigo}`,
    modulo: 'Pedidos',
    entidad: 'pedido',
    nivel: NivelAuditoria.INFO
  })
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
  @Auditable({
    operacion: TipoOperacion.ACTUALIZAR,
    descripcion: (r)=> `Se acutalizó el pedido ${r?.codigo}`,
    modulo: 'Pedidos',
    entidad: 'pedido'
  })
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  @Auditable({
    operacion: TipoOperacion.ELIMINAR,
    descripcion: (r) => 'Se ha eliminado un pedido ' + r.codigo,
    modulo: 'Pedidos',
    entidad: 'pedido'
  })
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(id);
  }

  
}
