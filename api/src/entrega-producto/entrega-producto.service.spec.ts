import { Test, TestingModule } from '@nestjs/testing';
import { EntregaProductoService } from './entrega-producto.service';

describe('EntregaProductoService', () => {
  let service: EntregaProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntregaProductoService],
    }).compile();

    service = module.get<EntregaProductoService>(EntregaProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
