import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { AuditoriaInterceptor } from './../auditoria-log/auditoria.interceptor';
import { Auditable } from './../auditoria-log/auditoria.interceptor';
import { NivelAuditoria, TipoOperacion } from '@prisma/client';

@Controller('proveedores')
@UseInterceptors(AuditoriaInterceptor)
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) { }

  @Post()
  @Auditable({
    descripcion: (r) => `Se creó un nuevo proveedor ${r.nombre} `,
    entidad: 'Proveedor',
    modulo: 'Proveedores',
    nivel: NivelAuditoria.INFO,
    operacion: TipoOperacion.CREAR
  })
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedorService.create(createProveedorDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
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
  @Auditable({
    descripcion: (r) => `Se actualizó el proveedor ${r.nombre} `,
    entidad: 'Proveedor',
    modulo: 'Proveedores',
    nivel: NivelAuditoria.INFO,
    operacion: TipoOperacion.ACTUALIZAR
  })
  update(@Param('id') id: string, @Body() updateProveedorDto: UpdateProveedorDto) {
    return this.proveedorService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  @Auditable({
    descripcion: (r) => `Se eliminó el proveedor ${r.nombre} `,
    entidad: 'Proveedor',
    modulo: 'Proveedores',
    nivel: NivelAuditoria.INFO,
    operacion: TipoOperacion.ELIMINAR
  })
  remove(@Param('id') id: string) {
    return this.proveedorService.remove(id);
  }
}
