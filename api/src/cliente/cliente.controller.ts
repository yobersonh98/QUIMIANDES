import { Controller, Get, Post, Body, Param, Query, Put, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteListarDto } from './dto/cliente-listar.dto';
import { Auditable, AuditoriaInterceptor } from './../auditoria-log/auditoria.interceptor';
import { TipoOperacion } from '@prisma/client';

@ApiTags('Clientes')
@Controller('cliente')
@UseInterceptors(AuditoriaInterceptor)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}
  
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida con éxito' })
  @Get()
  async getClientes(@Query() listarDto: ClienteListarDto) {
    return this.clienteService.findAll(listarDto);
  }

  @ApiOperation({ summary: 'Obtener un por busqueda' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Get('search')
  async searchClients(@Query('search') search: string) {
    return this.clienteService.search(search);
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
  @Auditable({
    entidad: 'Cliente',
    descripcion: 'Se  creó un nuevo cliente',
    modulo: 'Clientes',
    operacion: TipoOperacion.CREAR
  })
  async createCliente(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado con éxito' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Put(':id')
  @Auditable({
    entidad: 'Cliente',
    operacion: TipoOperacion.ACTUALIZAR,
    descripcion: 'Se actualizó la información del cliente',
    modulo: 'Clientes'
  })
  async updateCliente(@Param('id') id: string, @Body() updateCliente: UpdateClienteDto) {
    return this.clienteService.update(id, updateCliente);
  }
}
