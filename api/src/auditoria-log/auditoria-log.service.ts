// audit.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipoOperacion, NivelAuditoria, Prisma, User } from '@prisma/client';
import { Request } from 'express';
import { getClientInfo } from './../common/utils/request';

export interface AuditLogData {
  usuarioId?: string;
  tipoOperacion: TipoOperacion;
  entidad: string;
  entidadId?: string;
  nivel?: NivelAuditoria;
  descripcion: string;
  modulo?: string;
  accion?: string;
  valoresAnteriores?: any;
  valoresNuevos?: any;
  ipAddress?: string;
  userAgent?: string;
  observaciones?: string;
  metadata?: any;
}

export interface AuditQueryParams {
  page?: number;
  limit?: number;
  usuarioId?: string;
  usuarioEmail?: string;
  entidad?: string;
  tipoOperacion?: TipoOperacion;
  nivel?: NivelAuditoria;
  modulo?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  busqueda?: string;
}

@Injectable()
export class AuditoriaLogService {
  private readonly logger = new Logger(AuditoriaLogService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Registra una entrada de auditoría
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditoriaLog.create({
        data: {
          usuarioId: data.usuarioId,
          tipoOperacion: data.tipoOperacion,
          entidad: data.entidad,
          entidadId: data.entidadId,
          nivel: data.nivel || NivelAuditoria.INFO,
          descripcion: data.descripcion,
          modulo: data.modulo,
          accion: data.accion,
          valoresAnteriores: data.valoresAnteriores || null,
          valoresNuevos: data.valoresNuevos || null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          observaciones: data.observaciones,
          metadata: data.metadata || null,
        },
      });
    } catch (error) {
      this.logger.error('Error al registrar auditoría:', error);
      // No lanzamos el error para no afectar el flujo principal
    }
  }

  /**
   * Obtiene los logs de auditoría con filtros y paginación
   */
  async getLogs(params: AuditQueryParams) {
    const {
      page = 1,
      limit = 50,
      usuarioId,
      entidad,
      tipoOperacion,
      nivel,
      modulo,
      fechaInicio,
      fechaFin,
      busqueda,
    } = params;

    const skip = (page - 1) * limit;

    // Construir filtros dinámicamente
    const where: Prisma.AuditoriaLogWhereInput = {};

    if (usuarioId) where.usuarioId = usuarioId;
    // if (usuarioEmail) where.usuarioEmail = { contains: usuarioEmail, mode: 'insensitive' };
    if (entidad) where.entidad = entidad;
    if (tipoOperacion) where.tipoOperacion = tipoOperacion;
    if (nivel) where.nivel = nivel;
    if (modulo) where.modulo = modulo;

    if (fechaInicio || fechaFin) {
      where.fechaHora = {};
      if (fechaInicio) where.fechaHora.gte = fechaInicio;
      if (fechaFin) where.fechaHora.lte = fechaFin;
    }

    if (busqueda) {
      where.OR = [
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
        { observaciones: { contains: busqueda, mode: 'insensitive' } },
      ];
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditoriaLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaHora: 'desc' },
      }),
      this.prisma.auditoriaLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Obtiene estadísticas de auditoría
   */
  async getStats(fechaInicio?: Date, fechaFin?: Date) {
    const where: Prisma.AuditoriaLogWhereInput = {};

    if (fechaInicio || fechaFin) {
      where.fechaHora = {};
      if (fechaInicio) where.fechaHora.gte = fechaInicio;
      if (fechaFin) where.fechaHora.lte = fechaFin;
    }

    const [
      totalLogs,
      operacionesPorTipo,
      logsPorNivel,
      entidadesMasAuditadas,
    ] = await Promise.all([
      this.prisma.auditoriaLog.count({ where }),

      this.prisma.auditoriaLog.groupBy({
        by: ['tipoOperacion'],
        where,
        _count: { tipoOperacion: true },
        orderBy: { _count: { tipoOperacion: 'desc' } },
      }),

      this.prisma.auditoriaLog.groupBy({
        by: ['nivel'],
        where,
        _count: { nivel: true },
      }),

      this.prisma.auditoriaLog.groupBy({
        by: ['entidad'],
        where,
        _count: { entidad: true },
        orderBy: { _count: { entidad: 'desc' } },
        take: 10,
      }),

    ]);

    return {
      totalLogs,
      operacionesPorTipo: operacionesPorTipo.map(item => ({
        tipo: item.tipoOperacion,
        cantidad: item._count.tipoOperacion,
      })),
      logsPorNivel: logsPorNivel.map(item => ({
        nivel: item.nivel,
        cantidad: item._count.nivel,
      })),
      entidadesMasAuditadas: entidadesMasAuditadas.map(item => ({
        entidad: item.entidad,
        cantidad: item._count.entidad,
      })),
      // usuariosActivos: usuariosActivos.map(item => ({
      //   usuario: item.usuarioEmail,
      //   cantidad: item._count.usuarioEmail,
      // })),
    };
  }

  /**
   * Métodos de conveniencia para operaciones comunes
   */
  async logCreate(entidad: string, entidadId: string, valoresNuevos: any, usuarioId?:string, contexto?: any) {
    await this.log({
      usuarioId,
      tipoOperacion: TipoOperacion.CREAR,
      entidad,
      entidadId,
      descripcion: `Se creó un nuevo registro en ${entidad}`,
      valoresNuevos,
      ipAddress: contexto?.ip,
      userAgent: contexto?.userAgent,
    });
  }

  async logUpdate(entidad: string, entidadId: string, valoresAnteriores: any, valoresNuevos: any, usuario?: any, contexto?: any) {
    await this.log({
      usuarioId: usuario?.id,
      tipoOperacion: TipoOperacion.ACTUALIZAR,
      entidad,
      entidadId,
      descripcion: `Se actualizó un registro en ${entidad}`,
      valoresAnteriores,
      valoresNuevos,
      ipAddress: contexto?.ip,
      userAgent: contexto?.userAgent,
    });
  }

  async logDelete(entidad: string, entidadId: string, valoresAnteriores: any, usuario?: any, contexto?: any) {
    await this.log({
      usuarioId: usuario?.id,
      tipoOperacion: TipoOperacion.ELIMINAR,
      entidad,
      entidadId,
      descripcion: `Se eliminó un registro en ${entidad}`,
      valoresAnteriores,
      nivel: NivelAuditoria.ADVERTENCIA,
      ipAddress: contexto?.ip,
      userAgent: contexto?.userAgent,
    });
  }


  async logLogin(usuario: User, contexto?: Request) {
    const { ip, userAgent } = getClientInfo(contexto);
    await this.log({
      usuarioId: usuario?.id,
      tipoOperacion: TipoOperacion.INICIAR_SESION,
      entidad: 'User',
      entidadId: usuario?.id,
      descripcion: `Usuario ${usuario?.email} inició sesión`,
      ipAddress: typeof ip === 'string' ? ip : Array.isArray(ip) ? ip[0] : undefined,
      userAgent: userAgent
    });
  }


  async logLogout(usuario: any, contexto?: any) {
    await this.log({
      usuarioId: usuario?.id,
      tipoOperacion: TipoOperacion.CERRAR_SESION,
      entidad: 'User',
      entidadId: usuario?.id,
      descripcion: `Usuario ${usuario?.email} cerró sesión`,
      ipAddress: contexto?.ip,
      userAgent: contexto?.userAgent,
    });
  }
}