import { Controller, Get, Post, Body, Patch, Param, Delete, Search, Query, UseInterceptors, Request } from '@nestjs/common';
import { EntregaService } from './entrega.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import {  RegistrarDespachoDetallePedidoDto } from './../entrega-producto/dto/registrar-despacho-detalle-pedido.dto';
import { CompletarEntregaDto } from './dto/finalizar-entrega.dto';
import { ListarEntregasDto } from './dto/listar-entregas.dto';

@Controller('entregas')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}


  @Patch('confirmar-entrega')
  confirmarEntrega(@Body() body: RegistrarDespachoDetallePedidoDto, @Request() req) {
    body.usuarioId = req.user.sub
    return this.entregaService.confirmarEntrega(body);
  }

  @Patch('completar-entrega')
  completarEntrega(@Body() body: CompletarEntregaDto, @Request() req) {
    body.usuarioId = req.user.sub
    return this.entregaService.completarEntrega(body);
  }

  @Patch('/:id/cancelar') 
  cancelarEntrega(@Param('id') entregaId: string, @Request() req) {
    return this.entregaService.cancelarEntrega(req.user.sub, entregaId)
  }


  @Post() 
  create(@Body() createEntregaDto: CreateEntregaDto, @Request() req) {
    createEntregaDto.usuarioId = req.user.sub;
    return this.entregaService.programarEntrega(createEntregaDto);
  }

  @Get()
  findAll(@Query() params: ListarEntregasDto) {
    return this.entregaService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntregaDto: UpdateEntregaDto) {
    return this.entregaService.update(id, updateEntregaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregaService.remove(id);
  }

}
