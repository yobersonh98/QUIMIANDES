import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleCotizacionService } from './detalle-cotizacion.service';
import { CreateDetalleCotizacionDto } from './dto/create-detalle-cotizacion.dto';
import { UpdateDetalleCotizacionDto } from './dto/update-detalle-cotizacion.dto';

@Controller('detalle-cotizacion')
export class DetalleCotizacionController {
  constructor(private readonly detalleCotizacionService: DetalleCotizacionService) {}

  @Post()
  create(@Body() createDetalleCotizacionDto: CreateDetalleCotizacionDto) {
    return this.detalleCotizacionService.create(createDetalleCotizacionDto);
  }

  @Get()
  findAll() {
    return this.detalleCotizacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleCotizacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleCotizacionDto: UpdateDetalleCotizacionDto) {
    return this.detalleCotizacionService.update(id, updateDetalleCotizacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleCotizacionService.remove(id);
  }
}
