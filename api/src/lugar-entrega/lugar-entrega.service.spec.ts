import { Test, TestingModule } from '@nestjs/testing';
import { LugarEntregaService } from './lugar-entrega.service';

describe('LugarEntregaService', () => {
  let service: LugarEntregaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LugarEntregaService],
    }).compile();

    service = module.get<LugarEntregaService>(LugarEntregaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
