import { Test, TestingModule } from '@nestjs/testing';
import { InventarioClienteController } from './inventario-cliente.controller';
import { InventarioClienteService } from './inventario-cliente.service';

describe('InventarioClienteController', () => {
  let controller: InventarioClienteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioClienteController],
      providers: [InventarioClienteService],
    }).compile();

    controller = module.get<InventarioClienteController>(InventarioClienteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
