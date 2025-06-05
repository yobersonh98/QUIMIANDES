import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Search, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { NivelAuditoria, TipoOperacion, UnidadMedida } from '@prisma/client';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { Auditable, AuditoriaInterceptor } from './../auditoria-log/auditoria.interceptor';

@ApiTags('productos')
@Controller('productos')
@UseInterceptors(AuditoriaInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) { }

  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post()
  @Auditable({
    descripcion: (r) => `Se creó un nuevo producto ${r.nombre} `,
    entidad: 'Producto',
    modulo: 'Productos',
    nivel: NivelAuditoria.INFO,
    operacion: TipoOperacion.CREAR
  })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida exitosamente.' })
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const productos = await this.productoService.findAll(paginationDto);
    return productos;
  }
  @ApiOperation({ summary: 'Obtener un producto por busqueda' })
  @ApiResponse({ status: 200, description: 'Producto encontrado.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @Get('search')
  async searchProducts(@Query('search') search: string) {
    return this.productoService.search(search);
  }

  @ApiOperation({ summary: 'Obtener todas las unidades de medida' })
  @ApiResponse({ status: 200, description: 'Lista de unidades de medida obtenida exitosamente.' })
  @Get('unidades-medida')
  getUnidadesMedida(@Query('search') search?: string): string[] {
    if (search) {
      return Object.values(UnidadMedida).filter((unidad) => unidad.toLowerCase().includes(search.toLowerCase
        ()));
    }
    return Object.values(UnidadMedida);
  }

  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @Patch(':id')
  @Auditable({
    descripcion: (r) => `Se actualizó el producto ${r.nombre} `,
    entidad: 'Producto',
    modulo: 'Productos',
    nivel: 'INFO',
    operacion: TipoOperacion.ACTUALIZAR
  })
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(id, updateProductoDto);
  }

  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @Delete(':id')
  @Auditable({
    descripcion: (r) => `Se elimino el producto ${r.nombre} `,
    entidad: 'Producto',
    modulo: 'Productos',
    nivel: 'INFO',
    operacion: TipoOperacion.ELIMINAR
  })
  remove(@Param('id') id: string) {
    return this.productoService.remove(id);
  }


}
