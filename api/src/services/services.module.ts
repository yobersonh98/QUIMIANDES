import { Global, Module } from '@nestjs/common';
import { IdGeneratorService } from './IdGeneratorService';

@Global()
@Module({
  providers:[IdGeneratorService],
  exports: [IdGeneratorService]
})

export class ServicesModule {}
