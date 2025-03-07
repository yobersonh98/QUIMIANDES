import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresentacionService } from './presentacion.service';
import { CreatePresentacionDto } from './dto/create-presentacion.dto';
import { UpdatePresentacionDto } from './dto/update-presentacion.dto';

@Controller('presentacion')
export class PresentacionController {
  constructor(private readonly presentacionService: PresentacionService) {}

  @Post()
  create(@Body() createPresentacionDto: CreatePresentacionDto) {
    return this.presentacionService.create(createPresentacionDto);
  }

  @Get()
  findAll() {
    return this.presentacionService.findAll();
  }

  @Get('search')
  search(@Param('search') search: string) {
    return this.presentacionService.search(search);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presentacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresentacionDto: UpdatePresentacionDto) {
    return this.presentacionService.update(id, updatePresentacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presentacionService.remove(id);
  }
}
