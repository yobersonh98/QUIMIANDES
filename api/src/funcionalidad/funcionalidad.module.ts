
import { Module } from "@nestjs/common";
import { FuncionalidadService } from "./funcionalidad.service";
import { FuncionalidadController } from "./funcionalidad.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [FuncionalidadController],
  providers: [FuncionalidadService],
  exports: [FuncionalidadService]
})
export class FuncionalidadModule {}
