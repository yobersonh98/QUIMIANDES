import { Controller, Get, Post, Body, Patch, Param, Delete, Search, Query } from '@nestjs/common';
import { LugarEntregaService } from './lugar-entrega.service';
import { CreateLugarEntregaDto } from './dto/create-lugar-entrega.dto';
import { UpdateLugarEntregaDto } from './dto/update-lugar-entrega.dto';
import { SearchLugarEntregaDto } from './dto/search-lugar-entrega.dto';

@Controller('lugar-entrega')
export class LugarEntregaController {
  constructor(private readonly lugarEntregaService: LugarEntregaService) {}

  @Post()
  create(@Body() createLugarEntregaDto: CreateLugarEntregaDto) {
    return this.lugarEntregaService.create(createLugarEntregaDto);
  }

  @Get('search')
  findAll(@Query() params: SearchLugarEntregaDto) {
    return this.lugarEntregaService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lugarEntregaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLugarEntregaDto: UpdateLugarEntregaDto) {
    return this.lugarEntregaService.update(id, updateLugarEntregaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lugarEntregaService.remove(id);
  }
}
