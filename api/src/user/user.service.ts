import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/user.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';

export type IUser = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private pagination: PrismaGenericPaginationService) { }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        email: true,
        name: true,
        id: true,
      },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const whereInput: Prisma.UserWhereInput = {
      name: paginationDto.search ? { contains: paginationDto.search, mode: 'insensitive' } : undefined,
      email: paginationDto.search ? { contains: paginationDto.search, mode: 'insensitive' } : undefined,
    }
    return this.pagination.paginateGeneric({
      model: 'User',
      pagination: paginationDto,
      args: {
        where: whereInput
      }
    })
  }

  async createUser(
    data: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    const pwdHash = await bcrypt.hash(data.password, 10);
    data.password = pwdHash;
    const createdUser = await this.prisma.user.create({
      data,
    });
    delete createdUser.password;
    return createdUser;
  }

  async updateUser(data: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.findOne({
      id: data.id,
    });
    if (!user) {
      throw new NotFoundException();
    }
    if (data.password) {
      const pwdHash = await bcrypt.hash(data.password, 10);
      data.password = pwdHash;
    }
    const userSaved = await this.prisma.user.update({
      where: {
        id: data.id
      },
      omit: {
        password: true
      },
      data,
    });

    return userSaved;
  }

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, 'password'>> {
    return this.prisma.user.delete({
      where,
    });
  }
}
