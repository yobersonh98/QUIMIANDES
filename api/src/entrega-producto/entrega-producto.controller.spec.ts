import { Test, TestingModule } from '@nestjs/testing';
import { EntregaProductoController } from './entrega-producto.controller';
import { EntregaProductoService } from './entrega-producto.service';

describe('EntregaProductoController', () => {
  let controller: EntregaProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntregaProductoController],
      providers: [EntregaProductoService],
    }).compile();

    controller = module.get<EntregaProductoController>(EntregaProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
