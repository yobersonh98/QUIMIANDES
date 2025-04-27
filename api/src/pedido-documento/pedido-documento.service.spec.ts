import { Test, TestingModule } from '@nestjs/testing';
import { PedidoDocumentoService } from './pedido-documento.service';

describe('PedidoDocumentoService', () => {
  let service: PedidoDocumentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoDocumentoService],
    }).compile();

    service = module.get<PedidoDocumentoService>(PedidoDocumentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
