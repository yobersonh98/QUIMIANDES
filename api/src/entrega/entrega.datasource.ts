import { Injectable } from "@nestjs/common";
import { PrismaService } from "./../prisma/prisma.service";

@Injectable()
export class EntregaDataSource {
  constructor(
    private prisma: PrismaService
  ) { }


}