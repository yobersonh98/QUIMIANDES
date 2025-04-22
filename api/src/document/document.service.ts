
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Document } from '@prisma/client';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private readonly uploadDir = 'uploads';

  async create(
    file: Express.Multer.File,
    description?: string,
  ): Promise<Document> {
    // Asegurarse de que el directorio existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Generar un nombre de archivo único
    const fileExtension = path.extname(file.originalname);
    const randomName = crypto.randomUUID();
    const fileName = `${randomName}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Guardar el archivo en el sistema de archivos
    fs.writeFileSync(filePath, file.buffer);

    // URL base para acceder al documento
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/documents/${fileName}`;

    // Crear registro en la base de datos
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
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    await this.findOne(id);

    return this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
    });
  }

  async remove(id: string): Promise<Document> {
    const document = await this.findOne(id);

    // Eliminar el archivo del sistema de archivos
    try {
      fs.unlinkSync(document.path);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Eliminar el registro de la base de datos
    return this.prisma.document.delete({
      where: { id },
    });
  }

  async getFileByName(fileName: string): Promise<{path: string; mimeType: string}> {
    const document = await this.prisma.document.findFirst({
      where: { fileName },
    });

    if (!document) {
      throw new NotFoundException(`Document with name ${fileName} not found`);
    }

    return {
      path: document.path,
      mimeType: document.mimeType,
    };
  }
}
