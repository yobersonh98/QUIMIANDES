import { Test, TestingModule } from '@nestjs/testing';
import { PresentacionController } from './presentacion.controller';
import { PresentacionService } from './presentacion.service';

describe('PresentacionController', () => {
  let controller: PresentacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentacionController],
      providers: [PresentacionService],
    }).compile();

    controller = module.get<PresentacionController>(PresentacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
