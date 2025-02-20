import { Test, TestingModule } from '@nestjs/testing';
import { OrdenCompraService } from './orden-compra.service';

describe('OrdenCompraService', () => {
  let service: OrdenCompraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenCompraService],
    }).compile();

    service = module.get<OrdenCompraService>(OrdenCompraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
