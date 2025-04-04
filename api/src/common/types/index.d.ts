import { PrismaClient, Prisma, } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"

type PrismaTransacction = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgsgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
