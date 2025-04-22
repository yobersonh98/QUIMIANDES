import { IsString, IsOptional } from 'class-validator';

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  description?: string;
  
  @IsString()
  @IsOptional()
  fileName?: string;
}
