import { Controller, Get, Query } from '@nestjs/common';
import { FindAllAuditoriaLogsDto } from './dtos/find-all-auditoria-logs.dto';
import { AuditoriaLogService } from './auditoria-log.service';

@Controller('auditoria')
export class AuditoriaLogController {
  constructor(
    private auditService: AuditoriaLogService
  ){}
  @Get()
  findAllLogs(@Query() queries: FindAllAuditoriaLogsDto) {
    return this.auditService.getLogs(queries)
  }
}
