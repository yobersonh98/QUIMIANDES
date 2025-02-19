
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DetalleCotizacionService } from './detalle-cotizacion.service';
import { CreateDetalleCotizacionDto } from './dto/create-detalle-cotizacion.dto';
import { UpdateDetalleCotizacionDto } from './dto/update-detalle-cotizacion.dto';

@ApiTags('Detalle Cotización')
@Controller('detalle-cotizacion')
export class DetalleCotizacionController {
  constructor(private readonly detalleCotizacionService: DetalleCotizacionService) {}

  @ApiOperation({ summary: 'Crear un nuevo detalle de cotización' })
  @ApiResponse({ status: 201, description: 'Detalle de cotización creado con éxito' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  create(@Body() createDetalleCotizacionDto: CreateDetalleCotizacionDto) {
    return this.detalleCotizacionService.create(createDetalleCotizacionDto);
  }

  @ApiOperation({ summary: 'Obtener todos los detalles de cotización' })
  @ApiResponse({ status: 200, description: 'Lista de detalles obtenida con éxito' })
  @Get()
  findAll() {
    return this.detalleCotizacionService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un detalle de cotización por ID' })
  @ApiResponse({ status: 200, description: 'Detalle encontrado' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleCotizacionService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un detalle de cotización por ID' })
  @ApiResponse({ status: 200, description: 'Detalle actualizado con éxito' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleCotizacionDto: UpdateDetalleCotizacionDto) {
    return this.detalleCotizacionService.update(id, updateDetalleCotizacionDto);
  }

  @ApiOperation({ summary: 'Eliminar un detalle de cotización por ID' })
  @ApiResponse({ status: 200, description: 'Detalle eliminado con éxito' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleCotizacionService.remove(id);
  }
}
