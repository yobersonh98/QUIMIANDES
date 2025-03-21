import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EntregaProductoService } from './entrega-producto.service';
import { CreateEntregaProductoDto } from './dto/create-entrega-producto.dto';
import { UpdateEntregaProductoDto } from './dto/update-entrega-producto.dto';

@Controller('entrega-producto')
export class EntregaProductoController {
  constructor(private readonly entregaProductoService: EntregaProductoService) {}

  @Post()
  create(@Body() createEntregaProductoDto: CreateEntregaProductoDto) {
    return this.entregaProductoService.create(createEntregaProductoDto);
  }

  @Get(':id/all')
  findAll(@Query('id') idDetalleProducto: string) {
    return this.entregaProductoService.findAll(idDetalleProducto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregaProductoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntregaProductoDto: UpdateEntregaProductoDto) {
    return this.entregaProductoService.update(id, updateEntregaProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregaProductoService.remove(id);
  }
}
