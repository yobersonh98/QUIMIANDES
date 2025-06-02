import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MunicipioService } from './municipio.service';
import { PublicEnpoint } from './../common/PublicEndpoint';

@Controller('municipio')
export class MunicipioController {
  constructor(private readonly municipioService: MunicipioService) {}

  @Get()
  @PublicEnpoint()
  findAll(
    @Query('search') search: string,
  ) {
    return this.municipioService.findAll(search);
  }
}
