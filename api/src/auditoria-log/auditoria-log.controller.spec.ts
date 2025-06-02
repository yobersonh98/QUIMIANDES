import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriaLogController } from './auditoria-log.controller';

describe('AuditoriaLogController', () => {
  let controller: AuditoriaLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriaLogController],
    }).compile();

    controller = module.get<AuditoriaLogController>(AuditoriaLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
