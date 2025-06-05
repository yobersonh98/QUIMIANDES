import { Global, Module } from '@nestjs/common';
import { AuditoriaLogService } from './auditoria-log.service';
import { AuditoriaLogController } from './auditoria-log.controller';
import { AuditoriaInterceptor } from './auditoria.interceptor';

@Module({
  providers: [AuditoriaLogService, AuditoriaInterceptor],
  controllers: [AuditoriaLogController],
  exports: [AuditoriaLogService, AuditoriaInterceptor]
})
@Global()
export class AuditoriaLogModule {}
