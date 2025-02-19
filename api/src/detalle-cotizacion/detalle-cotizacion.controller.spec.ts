import { Test, TestingModule } from '@nestjs/testing';
import { DetalleCotizacionController } from './detalle-cotizacion.controller';
import { DetalleCotizacionService } from './detalle-cotizacion.service';

describe('DetalleCotizacionController', () => {
  let controller: DetalleCotizacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleCotizacionController],
      providers: [DetalleCotizacionService],
    }).compile();

    controller = module.get<DetalleCotizacionController>(DetalleCotizacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
