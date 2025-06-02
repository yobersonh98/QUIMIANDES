import { PrismaClient, Prisma, } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"

type PrismaTransacction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgsgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

// interfaces/jwt-payload.interface.ts
export interface JwtPayload {
  sub: string; // ID del usuario
  email: string;
  roles?: string[];
  // otros campos del payload si los tienes
}
