// audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { TipoOperacion, NivelAuditoria } from '@prisma/client';
import { AuditoriaLogService } from './auditoria-log.service';
import { Request } from 'express';
import { getClientInfo } from './../common/utils/request';

// Decorator para marcar métodos que deben ser auditados
export const Auditable = (options: {
  entidad: string;
  operacion: TipoOperacion;
  descripcion: ((result: any) => string) | string;
  nivel?: NivelAuditoria;
  modulo?: string;
}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('audit', options, descriptor.value);
    return descriptor;
  };
};

@Injectable()
export class AuditoriaInterceptor implements NestInterceptor {
  private logger = new Logger(AuditoriaInterceptor.name)
  constructor(
    private readonly auditService: AuditoriaLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const auditMetadata = this.reflector.get<any>('audit', handler) as any

    if (!auditMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const { ip, userId, userAgent } = getClientInfo(request)

    return next.handle().pipe(
      tap(async (result) => {
        try {
          await this.auditService.log({
            usuarioId: userId,
            tipoOperacion: auditMetadata.operacion,
            entidad: auditMetadata.entidad,
            entidadId: result?.id || request.params?.id,
            nivel: auditMetadata.nivel || NivelAuditoria.INFO,
            descripcion: typeof auditMetadata.descripcion == 'string' ? auditMetadata.descripcion : auditMetadata.descripcion(result),
            modulo: auditMetadata.modulo,
            valoresNuevos: result,
            ipAddress: ip,
            userAgent,
          });
        } catch (error) {
          this.logger.error('Error en auditoría:', error);
        }
      }),
    );
  }
}
