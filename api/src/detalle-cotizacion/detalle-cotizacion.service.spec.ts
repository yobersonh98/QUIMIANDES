import { Test, TestingModule } from '@nestjs/testing';
import { DetalleCotizacionService } from './detalle-cotizacion.service';

describe('DetalleCotizacionService', () => {
  let service: DetalleCotizacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleCotizacionService],
    }).compile();

    service = module.get<DetalleCotizacionService>(DetalleCotizacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
