import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenCompraService } from './orden-compra.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';

@Controller('orden-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  @Post()
  create(@Body() createOrdenCompraDto: CreateOrdenCompraDto) {
    return this.ordenCompraService.create(createOrdenCompraDto);
  }

  @Get()
  findAll() {
    return this.ordenCompraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenCompraService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenCompraDto: UpdateOrdenCompraDto) {
    return this.ordenCompraService.update(id, updateOrdenCompraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenCompraService.remove(id);
  }
}
