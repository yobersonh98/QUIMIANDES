import { Test, TestingModule } from '@nestjs/testing';
import { PresentacionService } from './presentacion.service';

describe('PresentacionService', () => {
  let service: PresentacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentacionService],
    }).compile();

    service = module.get<PresentacionService>(PresentacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
