import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Post()
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedorService.create(createProveedorDto);
  }

  @Get()
  findAll() {
    return this.proveedorService.findAll();
  }

  @Get(':documento')
  findOne(@Param('documento') documento: string) {
    return this.proveedorService.findOne(documento);
  }

  @Patch(':documento')
  update(@Param('documento') documento: string, @Body() updateProveedorDto: UpdateProveedorDto) {
    return this.proveedorService.update(documento, updateProveedorDto);
  }

  @Delete(':documento')
  remove(@Param('documento') documento: string) {
    return this.proveedorService.remove(documento);
  }
}
