
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { FuncionalidadService } from "./funcionalidad.service";
import { CreateFuncionalidadDto } from "./dto/create-funcionalidad.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFuncionalidadDto } from "./dto/update-funcionalidad.dto";
import { PaginationDto } from "./../common/dtos/pagination.dto";

@ApiTags('Funcionalidad')
@Controller("funcionalidad")
export class FuncionalidadController {
  constructor(private readonly funcionalidadService: FuncionalidadService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Funcionalidad' })
  @ApiResponse({ status: 201, description: 'The Funcionalidad has been successfully created.' })
  create(@Body() createDto: CreateFuncionalidadDto) {
    return this.funcionalidadService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Funcionalidads' })
  @ApiResponse({ status: 200, description: 'List of all Funcionalidads.' })
  async findAll(@Query() paginationDto:PaginationDto) {
    const response = await this.funcionalidadService.findAll(paginationDto);
    return response 
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a Funcionalidad by ID' })
  @ApiResponse({ status: 200, description: 'The Funcionalidad with the given ID.' })
  @ApiResponse({ status: 404, description: 'Funcionalidad not found.' })
  findOne(@Param("id") id: string) {
    return this.funcionalidadService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a Funcionalidad by ID' })
  @ApiResponse({ status: 200, description: 'The Funcionalidad has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Funcionalidad not found.' })
  update(@Param("id") id: string, @Body() updateDto: UpdateFuncionalidadDto) {
    return this.funcionalidadService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a Funcionalidad by ID' })
  @ApiResponse({ status: 200, description: 'The Funcionalidad has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Funcionalidad not found.' })
  remove(@Param("id") id: string) {
    return this.funcionalidadService.delete(id);
  }
}
