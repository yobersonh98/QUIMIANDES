import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventarioClienteService } from './inventario-cliente.service';
import { CreateInventarioClienteDto } from './dto/create-inventario-cliente.dto';
import { UpdateInventarioClienteDto } from './dto/update-inventario-cliente.dto';

@Controller('inventario-cliente')
export class InventarioClienteController {
  constructor(private readonly inventarioClienteService: InventarioClienteService) {}

  @Post()
  create(@Body() createInventarioClienteDto: CreateInventarioClienteDto) {
    return this.inventarioClienteService.create(createInventarioClienteDto);
  }

  @Get()
  findAll() {
    return this.inventarioClienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioClienteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventarioClienteDto: UpdateInventarioClienteDto) {
    return this.inventarioClienteService.update(id, updateInventarioClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventarioClienteService.remove(id);
  }
}
