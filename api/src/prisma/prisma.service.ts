import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new Logger(PrismaService.name);
  public readonly TimeToWait = 20000 // 20  segundos
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected');
  }
}
