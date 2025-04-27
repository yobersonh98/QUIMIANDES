
import { Module } from "@nestjs/common";
import { DocumentsService } from "./document.service";
import { DocumentsController } from "./document.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentModule {}
