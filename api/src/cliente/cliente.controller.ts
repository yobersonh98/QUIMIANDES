import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  async getClientes(@Query('search') search?: string) {
    return this.clienteService.findAll(search);
  }

  @Get(':documento')
  async getClienteByDocumento(@Param('documento') documento: string) {
    return this.clienteService.findOneByDocumento(documento);
  }

  @Post()
  async createCliente(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }
}
