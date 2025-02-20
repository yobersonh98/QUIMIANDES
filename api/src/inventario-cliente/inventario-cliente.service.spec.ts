import { Test, TestingModule } from '@nestjs/testing';
import { InventarioClienteService } from './inventario-cliente.service';

describe('InventarioClienteService', () => {
  let service: InventarioClienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventarioClienteService],
    }).compile();

    service = module.get<InventarioClienteService>(InventarioClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
