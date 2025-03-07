import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Search } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { UnidadMedida } from '@prisma/client';

@ApiTags('productos')
@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida exitosamente.' })
  @Get()
  async findAll(@Query() paginationDto) {
    const productos = await this.productoService.findAll(paginationDto);  
    return productos;
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
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(id, updateProductoDto);
  }

  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(id);
  }


}
