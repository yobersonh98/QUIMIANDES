import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';

@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Post()
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedorService.create(createProveedorDto);
  }

  @Get()
  async  findAll(@Query() paginationDto: PaginationDto) {
    return this.proveedorService.findAll(paginationDto);
  }

  @Get('search')
  async search(@Query('search') search: string) {
    return this.proveedorService.search(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedorDto: UpdateProveedorDto) {
    return this.proveedorService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedorService.remove(id);
  }
}
