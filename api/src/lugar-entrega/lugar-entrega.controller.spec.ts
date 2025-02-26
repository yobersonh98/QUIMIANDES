import { Test, TestingModule } from '@nestjs/testing';
import { LugarEntregaController } from './lugar-entrega.controller';
import { LugarEntregaService } from './lugar-entrega.service';

describe('LugarEntregaController', () => {
  let controller: LugarEntregaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LugarEntregaController],
      providers: [LugarEntregaService],
    }).compile();

    controller = module.get<LugarEntregaController>(LugarEntregaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
