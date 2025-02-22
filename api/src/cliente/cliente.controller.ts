import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@ApiTags('Clientes')
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida con éxito' })
  @Get()
  async getClientes(@Query('search') search?: string) {
    return this.clienteService.findAll(search);
  }

  @ApiOperation({ summary: 'Obtener un cliente por id' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Get(':id')
  async getClienteByDocumento(@Param('id') id: string) {
    return this.clienteService.findOneById(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado con éxito' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  async createCliente(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado con éxito' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Post(':id')
  async updateCliente(@Param('id') id: string, @Body() updateCliente: UpdateClienteDto) {
    return this.clienteService.update(id, updateCliente);
  }
}
