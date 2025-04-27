import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Document } from '@prisma/client';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ConfigService } from '@nestjs/config';
import { createReadStream, promises as fsPromises, existsSync } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { StreamableFile } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private readonly UPLOAD_DIR = 'uploads';
  private readonly ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

  async create(
    file: Express.Multer.File,
    description?: string,
  ): Promise<Document> {
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }

    // Asegurar directorio
    try {
      if (!existsSync(this.UPLOAD_DIR)) {
        await fsPromises.mkdir(this.UPLOAD_DIR, { recursive: true });
      }
    } catch (error) {
      throw new InternalServerErrorException('Error creando directorio');
    }

    // Generar nombre único
    const ext = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.UPLOAD_DIR, fileName);

    // Guardar archivo
    try {
      await fsPromises.writeFile(filePath, file.buffer);
    } catch (error) {
      throw new InternalServerErrorException('Error guardando archivo');
    }

    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/${fileName}`;

    return this.prisma.document.create({
      data: {
        fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        url: fileUrl,
        description,
      },
    });
  }

  async findAll(): Promise<Document[]> {
    return this.prisma.document.findMany();
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }
    return document;
  }

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    await this.findOne(id);
    return this.prisma.document.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<Document> {
    const document = await this.findOne(id);

    try {
      if (existsSync(document.path)) {
        await fsPromises.unlink(document.path);
      }
    } catch (error) {
      console.error('Error eliminando archivo físico:', error);
    }

    return this.prisma.document.delete({ where: { id } });
  }

  async getFileByName(fileName: string): Promise<{ path: string; mimeType: string }> {
    const document = await this.prisma.document.findFirst({ where: { fileName } });
    if (!document) {
      throw new NotFoundException(`Archivo ${fileName} no encontrado`);
    }

    if (!existsSync(document.path)) {
      throw new NotFoundException('Archivo no encontrado en disco');
    }

    return {
      path: document.path,
      mimeType: document.mimeType,
    };
  }

  streamFile(filePath: string): StreamableFile {
    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }
}
