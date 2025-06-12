import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Put,
  Request,
  Query,
} from '@nestjs/common';
import { IUser, UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signupUser(@Body() payload: CreateUserDto): Promise<IUser> {
    const existingUser = await this.userService.findOne({
      email: payload.email,
    });
    if (existingUser) {
      throw new BadRequestException('usuario ya existente con ese mismo email');
    }
    return await this.userService.createUser(payload);
  }

  @Get()
  async list(@Query() params: PaginationDto) {
    return await this.userService.findAll(params)
  }

  @Put('/:id')
  async updateUser(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<IUser> {
    body.id = id
    return this.userService.updateUser(body)
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<IUser> {
    const user = await this.userService.findOne({
      id,
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
