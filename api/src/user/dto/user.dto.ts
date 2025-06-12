import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  estado: boolean

}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  id: string;
}