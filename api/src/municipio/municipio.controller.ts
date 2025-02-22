import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MunicipioService } from './municipio.service';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';

@Controller('municipio')
export class MunicipioController {
  constructor(private readonly municipioService: MunicipioService) {}

  @Get()
  findAll(
    @Query('search') search: string,
  ) {
    return this.municipioService.findAll(search);
  }
}
