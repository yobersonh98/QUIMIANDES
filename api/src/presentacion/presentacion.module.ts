import { Module } from '@nestjs/common';
import { PresentacionService } from './presentacion.service';
import { PresentacionController } from './presentacion.controller';

@Module({
  controllers: [PresentacionController],
  providers: [PresentacionService],
})
export class PresentacionModule {}
