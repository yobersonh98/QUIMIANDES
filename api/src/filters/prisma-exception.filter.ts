import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(`[Prisma Error]: ${exception.message}`, exception.stack);

    // Valores por defecto
    let statusCode = HttpStatus.BAD_REQUEST;
    let message = 'Ocurrió un error inesperado con la base de datos.';

    switch (exception.code) {
      case 'P2003': // Violación de restricción de clave foránea
        message = 'No se puede eliminar este registro porque está relacionado con otros datos.';
        statusCode = HttpStatus.CONFLICT;
        break;

      case 'P2002': // Violación de restricción de unicidad
        message = `Ya existe un registro con un valor duplicado.`;
        statusCode = HttpStatus.CONFLICT;
        break;

      case 'P2025': // Registro no encontrado
        message = `El recurso solicitado no existe.`;
        statusCode = HttpStatus.NOT_FOUND;
        break;

      default:
        // O puedes usar exception.meta si deseas más detalle
        message = 'Error en la base de datos.';
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: exception.code,
    });
  }
}
