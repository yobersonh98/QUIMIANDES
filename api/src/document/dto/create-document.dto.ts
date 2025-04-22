import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsOptional()
  description?: string;
}