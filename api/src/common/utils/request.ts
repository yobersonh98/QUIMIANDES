import { Request } from 'express';

export function getClientInfo(req: Request): { ip: string | undefined; userAgent: string | undefined, userId?: string; email?:string; roles?:string[] } {
  // User-Agent del cliente (navegador, app móvil, etc.)
  const userAgent = req.headers['user-agent'];

  // IP del cliente con soporte para proxies (x-forwarded-for)
  const xForwardedFor = req.headers['x-forwarded-for'];
  let ip: string | undefined;

  if (typeof xForwardedFor === 'string') {
    // Si hay múltiples IPs separadas por coma, toma la primera (la del cliente real)
    ip = xForwardedFor.split(',')[0].trim();
  } else if (Array.isArray(xForwardedFor)) {
    ip = xForwardedFor[0];
  } else {
    ip = req.ip || req.socket?.remoteAddress;
  }
  const userId = req.user?.sub;
  const roles = req.user.roles
  const email = req.user.email
  return {
    ip,
    userAgent,
    userId,
    email,
    roles
  };
}1
