import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

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

  @ApiOperation({ summary: 'Obtener un cliente por documento' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Get(':documento')
  async getClienteByDocumento(@Param('documento') documento: string) {
    return this.clienteService.findOneByDocumento(documento);
  }

  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado con éxito' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  async createCliente(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }
}
