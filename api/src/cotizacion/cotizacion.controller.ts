import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { CotizacionService } from './cotizacion.service';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';

@Controller('contizacion')
export class CotizacionController {
  constructor(private readonly contizacionService: CotizacionService) {}

  @Post()
  create(@Body() createCotizacionDto: CreateCotizacionDto) {
    return this.contizacionService.create(createCotizacionDto);
  }

  @Get()
  findAll() {
    return this.contizacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contizacionService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCotizacionDto: UpdateCotizacionDto) {
  //   return this.contizacionService.update(id, updateCotizacionDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contizacionService.remove(id);
  }
}
